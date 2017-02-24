#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib
import time
from jose import jwt
from utils.extraData import SECRET
from utils.extraData import LOGFILE

class Utils(object):
    """
    自定义扩展方法类
    """
    def __init__(self):
        pass

    @staticmethod
    def md5(string):
        """
        对密码进行MD5加密, 结果字符串大写
        @params password
        @retrun md5string
        """
        return hashlib.md5(string.encode('utf8')).hexdigest().upper()

    @staticmethod
    def verifyToken(token):
        """
        @params token
        @return userInfo
        """
        userInfo = {}
        try:
            userInfo = jwt.decode(token, SECRET)
            userInfo['token'] = token
        except Exception as e:
            pass
        return userInfo

    @staticmethod
    def makeToken(userInfo):
        """
        @params userInfo
        @retrun token
        """
        token = ''
        userInfo['time'] = time.time()
        try:
            token = jwt.encode(userInfo, SECRET)
        except expression as identifier:
            pass
        return token

    @staticmethod
    def getUserInfo(token):
        """
        @params token
        @return userInfo
        """
        userInfo = {}
        try:
            userInfo = jwt.decode(token, SECRET)
        except:
            userInfo = {}
        return userInfo

    @staticmethod
    def getLocalTime():
        """
        获取当前时间 格式化成2017-01-01 00:00:00形式
        """
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    
    @staticmethod
    def getDotTime():
        """
        获取当前时间戳
        """
        return time.time()

    @staticmethod
    def getShortDate():
        """
        获取当前日期 20170101
        """
        return time.strftime("%Y%m%d", time.localtime())

    @staticmethod
    def log(*input):
        """
        打印服务运行日志
        """
        with open(LOGFILE, 'a+') as f:
            f.write("{} > ".format(Utils.getLocalTime()))
            for v in input:
                f.write("{} ".format(v))
            f.write("\n")