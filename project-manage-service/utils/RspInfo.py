#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json

class RspInfo(object):
    """
    返回值信息统一格式化
    请求成功: "0000"
    请求失败: "9999"
    登录超时: "_SSO"
    异地登录: "_SSO"
    """

    def __init__(self, code = '9999', info = '请求数据失败', data = {}):
        self.rspCode = code
        self.rspInfo = info
        self.rspData = data

    def setSuccess(self):
        self.rspCode = '0000'
        self.rspInfo = '请求数据成功'

    def setData(self, list = None, total = 0):
        self.rspData = {
            'list': list,
            'total': total
        }

    def setObj(self, data = None):
        self.rspData = data

    def setInfo(self, info = ''):
        self.rspInfo = info
    
    def setNoLogin(self):
        self.rspCode = '0001'
        self.rspInfo = '未检测到登录信息，即将跳转到登录页面'

    def toDict(self):
        return self.__dict__

    def toJson(self):
        return json.dumps({
            'rspCode': self.rspCode,
            'rspInfo': self.rspInfo,
            'rspData': self.rspData
        })
