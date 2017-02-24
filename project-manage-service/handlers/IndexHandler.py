#!/usr/bin/env python3
# -*- conding: utf-8 -*-

import tornado.web
from handlers.BaseHandler import BaseHandler


class IndexHandler(BaseHandler):
    """
    toenado 连接测试
    """
    @tornado.web.authenticated
    def get(self):
        token = self.get_argument('token', None)
        get_json = {
            'userId': self.current_user.get('userId', None),
            'userName': self.current_user.get('userName', None),
            'token': token,
            'json': u'Get测试返回数据',
            'method': 'GET'
        }
        self.write(get_json)

    @tornado.web.authenticated
    def post(self):
        token = self.get_argument('token', None)
        get_json = {
            'userId': self.current_user.get('userId', None),
            'userName': self.current_user.get('userName', None),
            'token': token,
            'json': u'Get测试返回数据',
            'method': 'POST'
        }
        self.write(get_json)
