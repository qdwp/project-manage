#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from utils.Switch import switch
from handlers.BaseHandler import BaseHandler
from handlers.dao.UserDao import UserDao

class UserEditHandler(BaseHandler):
    """
    编辑用户信息
    """

    @tornado.web.authenticated
    def post(self, opt):
        """
        用户列表
        """
        rsp = RspInfo()
        for case in switch(opt):
            if case('add'):
                rsp = self.add()
                break
            if case('update'):
                rsp = self.update()
                break
            if case('delete'):
                rsp = self.delete()
                break
            if case('reset'):
                rsp = self.reset()
                break
            if case(): # Default
                self.write_error(404)
                return
        self.write(rsp.toDict())
        return

    def add(self):
        """
        添加用户记录
        """
        token = self.get_argument('token', None)
        userId = self.get_argument('userId', None)
        userName = self.get_argument('userName', None)
        userAuth = self.get_argument('userAuth', None)
        userLogin = self.get_argument('userLogin', None)
        userCreator = self.get_current_user()['userId'] or None
        rsp = RspInfo()
        try:
            dao = UserDao()
            valid = dao.validInsert(userId)
            if valid:
                rsp.setInfo('该用户名已存在, 添加用户失败')
                raise Exception("该用户名已存在, 添加用户失败")
            res = dao.insert(userId, userName, userAuth, userLogin, userCreator)
            if res:
                rsp.setSuccess()
                rsp.setInfo("添加用户成功")
                rsp.setObj(token)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("添加用户失败")
        finally:
            del(dao)
        return rsp

    def update(self):
        """
        更新用户记录
        """
        token = self.get_argument('token', None)
        userId = self.get_argument('userId', None)
        userName = self.get_argument('userName', None)
        userAuth = self.get_argument('userAuth', None)
        userLogin = self.get_argument('userLogin', None)
        currentAuth = self.get_current_user()['userAuth'] or 9
        rsp = RspInfo()
        try:
            dao = UserDao()
            res = dao.update(userId, userName, userAuth, userLogin, currentAuth)
            if res:
                rsp.setSuccess()
                rsp.setInfo("更新用户成功")
            else:
                rsp.setInfo("更新用户失败")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("更新用户失败")
        finally:
            del(dao)
        return rsp

    def delete(self):
        """
        删除用户记录
        """
        token = self.get_argument('token', None)
        userId = self.get_argument('userId', None)
        currentAuth = self.get_current_user()['userAuth'] or 9
        rsp = RspInfo()
        try:
            dao = UserDao()
            res = dao.delete(userId, currentAuth)
            if res:
                rsp.setSuccess()
                rsp.setInfo("删除用户成功")
            else:
                rsp.setInfo("删除用户失败")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("删除用户失败")
        finally:
            del(dao)
        return rsp

    def reset(self):
        """
        重置用户密码
        """
        token = self.get_argument('token', None)
        userId = self.get_argument('userId', None)
        currentAuth = self.get_current_user()['userAuth'] or 9
        rsp = RspInfo()
        try:
            dao = UserDao()
            res = dao.reset(userId, currentAuth)
            if res:
                rsp.setSuccess()
                rsp.setInfo("重置用户密码成功")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("重置用户密码失败")
        finally:
            del(dao)
        return rsp