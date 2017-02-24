#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from handlers.BaseHandler import BaseHandler
from handlers.dao.LoginDao import LoginDao

class UpdatePwdHandler(BaseHandler):
    """
    修改账号登录密码
    """

    @tornado.web.authenticated
    def post(self):
        """
        修改密码
        """
        rsp = RspInfo()
        token = self.get_argument('token', None)
        oldPwd = self.get_argument('oldPwd', None)
        newPwd = self.get_argument('newPwd', None)
        if oldPwd and newPwd:
            userId = self.current_user.get('userId', None)
            dao = LoginDao()
            result = dao.updatePwd(userId, oldPwd, newPwd)
            if result:
                rsp.setSuccess()
                self.write(rsp.toDict())
                return
        self.write({'oldPwd': oldPwd, 'newPwd': newPwd, 'token': token})
        return