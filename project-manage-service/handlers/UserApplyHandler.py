#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from utils.Switch import switch
from handlers.BaseHandler import BaseHandler
from handlers.dao.ApplyDao import ApplyDao
from handlers.dao.UserDao import UserDao


class UserApplyHandler(BaseHandler):
    """
    请求登录账号处理
    """

    def get(self):
        rsp = RspInfo()
        rsp.setNoLogin()
        self.write(rsp.toJson())
        return

    def post(self, opt):
        rsp = RspInfo()
        for case in switch(opt):
            if case('commit'):
                rsp = self.commit()
                break
            if case('list'):
                rsp = self.list()
                break
            if case('handle'):
                rsp = self.handle()
                break
            if case(): # Default
                self.write_error(404)
                return
        self.write(rsp.toDict())
        return
    
    def commit(self):
        rsp = RspInfo()
        token = self.get_argument('token', None)
        userId = self.get_argument('userId', None)
        userName = self.get_argument('userName', None)
        userPwd = self.get_argument('userPwd', None)
        if userId and userPwd and userName:
            dao = ApplyDao()
            res = dao.apply(userId, userName, userPwd)
            if 0 == res:
                rsp.setInfo("账号正在使用或已提交申请")
            elif 1 == res:
                rsp.setSuccess()
                rsp.setInfo("账号申请提交成功")
            else:
                rsp.setInfo("账号申请提交失败")
        else:
            rsp.setInfo("参数校验失败")
        return rsp

    def list(self):
        rsp = RspInfo()
        token = self.get_argument('token', None)
        page = self.get_argument('pageNum', 1)
        size = self.get_argument('pageSize', 10)
        userId = self.get_argument('userId', None)
        userName = self.get_argument('userName', None)
        applyStart = self.get_argument('applyStart', None)
        applyEnd = self.get_argument('applyEnd', None)
        userCreator = self.get_current_user()['userId'] or None

        try:
            dao = ApplyDao()
            list, total = dao.list(page, size, userId, userName, applyStart, applyEnd, userCreator)
            rsp.setSuccess()
            rsp.setData(list, total)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("获取文件下载列表失败")
        finally:
            del(dao)
        return rsp

    def handle(self):
        rsp = RspInfo()
        token = self.get_argument('token', None)
        userId = self.get_argument('userId', None)
        userName = self.get_argument('userName', None)
        userPwd = self.get_argument('userPwd', None)
        userCreator = self.get_current_user()['userId'] or None

        try:
            dao = ApplyDao()
            user = UserDao()
            if not userId:
                rsp.setInfo("参数校验失败")
                return rsp
            res_1 =  dao.remove(userId)
            res_2 = user.insert(userId, userName, '1', '1', userCreator)
            if res_1 and res_2:
                rsp.setSuccess()
                rsp.setInfo("审核用户通过")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("审核用户失败")
        finally:
            del(dao)
            del(user)
        return rsp