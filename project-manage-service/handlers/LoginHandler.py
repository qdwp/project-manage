#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from handlers.BaseHandler import BaseHandler
from handlers.dao.LoginDao import LoginDao


class LoginHandler(BaseHandler):
    """
    请求登录账号处理
    """

    def get(self):
        rsp = RspInfo()
        rsp.setNoLogin()
        self.write(rsp.toJson())
        return

    def post(self):
        rsp = RspInfo()
        userId = self.get_argument('userId', None)
        userPwd = self.get_argument('userPwd', None)
        if userId and userPwd:
            log = LoginDao()
            list, total = log.checkLogin(userId, userPwd)
            if 1 == total:
                info = {
                    'userId': list[0].get('USER_ID'),
                    'userName': list[0].get('USER_NAME'),
                    'userAuth': list[0].get('USER_AUTH')
                }
                token = Utils.makeToken(info)
                info['token'] = token
                rsp.setSuccess()
                rsp.setObj(info)
        else:
            pass
        self.write(rsp.toDict())
        return
