#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from handlers.BaseHandler import BaseHandler
from handlers.dao.LoginDao import LoginDao


class ValidTokenHandler(BaseHandler):
    """
    验证登录信息
    """

    def get(self):
        rsp = RspInfo()
        rsp.setNoLogin()
        self.write(rsp.toJson())

    @tornado.web.authenticated
    def post(self):
        rsp = RspInfo()
        token = self.get_argument('token', None)
        userInfo = Utils.verifyToken(token)
        rsp.setSuccess()
        rsp.setObj(userInfo)
        self.write(rsp.toDict())
        return
