#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import tornado.web
import json

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from dbservers.Redis import MyRedis


class BaseHandler(tornado.web.RequestHandler):
    """
    初始化 RequestHandler 类,
    所有的请求处理都是继承此类
    """

    def get_current_user(self):
        Utils.log(self.request.body)
        token = self.get_argument('token', None)
        # 查询 Redis 数据库
        r = MyRedis()
        info = Utils.getUserInfo(token)
        v = r.get(info['userId'])
        if v:
            if str(v, encoding="utf-8") == token:
                r.expire(info['userId'])
                return Utils.getUserInfo(token)
            else:
                rsp = RspInfo('_SSO', '您的账号已在其他地方登陆, 即将刷新页面')
                self.write(rsp.toDict())
                self.finish()
                return {}
        else:
            rsp = RspInfo('_SSO', '您的账号已登录超时, 即将跳转到登录页面')
            self.write(rsp.toDict())
            self.finish()
            return {}

    def write_error(self, status_code, **kwargs):
        """
        重写错误状态码信息
        """
        rsp = RspInfo()
        rsp.setObj(status_code)
        rsp.setInfo("错误的请求")
        self.write(respose_info)


    #解决js跨域请求问题
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Content-type', 'application/json application/x-www-form-urlencoded')
