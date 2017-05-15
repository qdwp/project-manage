#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from handlers.BaseHandler import BaseHandler
from handlers.dao.UserDao import UserDao

class UserListHandler(BaseHandler):
    """
    获取用户列表
    """

    @tornado.web.authenticated
    def post(self):
        """
        用户列表
        """
        rsp = RspInfo()
        token = self.get_argument('token', None)
        page = self.get_argument('pageNum', 1)
        size = self.get_argument('pageSize', 10)
        userId = self.get_argument('userId', None)
        userName = self.get_argument('userName', None)
        userAuth = self.get_argument('userAuth', None)
        userLogin = self.get_argument('userLogin', None)
        userCreator = self.get_current_user()['userId'] or None
        try:
            dao = UserDao()
            list, total = dao.getList(page, size, userId, userName, userAuth, userLogin, userCreator)
            rsp.setSuccess()
            rsp.setData(list, total)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("查询用户列表失败")
        finally:
            del(dao)
        self.write(rsp.toDict())
        return