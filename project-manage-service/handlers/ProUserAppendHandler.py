#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from utils.Switch import switch
from handlers.BaseHandler import BaseHandler
from handlers.dao.ProjectUserDao import ProjectUserDao

class ProUserAppendHandler(BaseHandler):
    """
    获取用户列表
    """

    @tornado.web.authenticated
    def post(self, opt):
        """
        用户列表
        """
        rsp = RspInfo()
        for case in switch(opt):
            if case('list'):
                rsp = self.queryList()
                break
            if case('info'):
                rsp = self.queryInfo()
                break
            if case('append'):
                rsp = self.append()
                break
            if case('remove'):
                rsp = self.remove()
                break
            if case(): # Default
                self.write_error(404)
                return
        self.write(rsp.toDict())
        return

    def queryList(self):
        """
        加载小组中不在当前项目中的成员
        """
        token = self.get_argument('token', None)
        page = self.get_argument('pageNum', 1)
        size = self.get_argument('pageSize', 10)
        proId = self.get_argument('proId', None)
        userCreator = self.get_current_user()['userId'] or None
        userId = self.get_argument('userId', None)
        userName = self.get_argument('userName', None)
        
        rsp = RspInfo()
        try:
            dao = ProjectUserDao()
            list, total = dao.getList(page, size, proId, userCreator, userId, userName)
            rsp.setSuccess()
            rsp.setInfo("加载成员成功")
            rsp.setData(list, total)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("加载成员失败")
        finally:
            del(dao)
        return rsp

    def queryInfo(self):
        """
        加载小组项目中的成员
        """
        token = self.get_argument('token', None)
        page = self.get_argument('pageNum', 1)
        size = self.get_argument('pageSize', 10)
        proId = self.get_argument('proId', None)
        userId = self.get_argument('userId', None)
        userName = self.get_argument('userName', None)
        
        rsp = RspInfo()
        try:
            dao = ProjectUserDao()
            list, total = dao.getInfo(page, size, proId, userId, userName)
            rsp.setSuccess()
            rsp.setInfo("加载成员成功")
            rsp.setData(list, total)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("加载成员失败")
        finally:
            del(dao)
        return rsp
    
    def append(self):
        """
        将项目成员添加的当前的项目中，以待分配模块任务
        """
        token = self.get_argument('token', None)
        proId = self.get_argument('proId', None)
        proName = self.get_argument('proName', None)
        userCreator = self.get_current_user()['userId'] or None
        users = self.get_argument('users', None)
        Utils.log(users)
        allUsers = json.loads(users)
        
        rsp = RspInfo()
        try:
            dao = ProjectUserDao()
            res = dao.append(proId, proName, userCreator, allUsers)
            if res:
                rsp.setSuccess()
                rsp.setInfo("添加成员成功")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("添加成员失败")
        finally:
            del(dao)
        return rsp

    def remove(self):
        """
        移除项目成员，已分配任务的不可移除
        """
        token = self.get_argument('token', None)
        proId = self.get_argument('proId', None)
        userId = self.get_argument('userId', None)
        
        rsp = RspInfo()
        try:
            dao = ProjectUserDao()
            if dao.valid(proId, userId):
                Utils.log('INFO', '已分配任务的不可移除')
                rsp.setInfo('已分配任务的成员不可移除')
            else:
                res = dao.remove(proId, userId)
                rsp.setSuccess()
                rsp.setInfo("移除项目成员成功")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("移除项目成员失败")
        finally:
            del(dao)
        return rsp
