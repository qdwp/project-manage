#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import tornado.web
import json
from utils.Utils import Utils


class BaseHandler(tornado.web.RequestHandler):
    """
    初始化 RequestHandler 类,
    所有的请求处理都是继承此类
    """

    def get_current_user(self):
        token = self.get_argument('token', None)
        Utils.log(self.request.body)
        return Utils.getUserInfo(token)

    def write_error(self, status_code, **kwargs):
        """
        重写错误状态码信息
        """
        respose_info = {
            'status': '9999',
            'msg': u'错误的请求',
            'code': status_code,
        }
        self.write(respose_info)


    #解决js跨域请求问题
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Content-type', 'application/json application/x-www-form-urlencoded')
