#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from utils.Switch import switch
from handlers.BaseHandler import BaseHandler
from handlers.dao.ProjectTaskDao import ProjectTaskDao
from handlers.dao.ProjectRateDao import ProjectRateDao

class ProjectTaskHandler(BaseHandler):
    """
    项目任务管理
    """

    @tornado.web.authenticated
    def post(self, opt):
        """
        任务管理
        """
        rsp = RspInfo()
        for case in switch(opt):
            if case('add'):
                rsp = self.add()
                break
            if case('list'):
                rsp = self.list()
                break
            if case('delete'):
                rsp = self.delete()
                break
            if case(): # Default
                self.write_error(404)
                return
        self.write(rsp.toDict())
        return

    def add(self):
        """
        执行分配任务
        """
        token = self.get_argument('token', None)
        proId = self.get_argument('proId', None)
        userId = self.get_argument('userId', None)
        modName = self.get_argument('modName', None)
        modDes = self.get_argument('modDes', None)
        modStart = self.get_argument('modStart', None)
        modEnd = self.get_argument('modEnd', None)
        currentUser = self.get_current_user()['userId'] or ''
        rsp = RspInfo()
        try:
            dao = ProjectTaskDao()
            modId = Utils.makeId()
            res = dao.insert(proId, userId, modId, modName, modDes, modStart, modEnd)
            if res:
                # 添加任务模块时, 添加任务进度信息
                rate = ProjectRateDao()
                rate.insert(userId, modId, currentUser)
                rsp.setSuccess()
                rsp.setInfo("添加任务模块成功")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("添加任务模块失败")
        finally:
            del(dao)
            del(rate)
        return rsp

    def list(self):
        """
        查询任务列表
        """
        token = self.get_argument('token', None)
        page = self.get_argument('pageNum', 1)
        size = self.get_argument('pageSize', 10)
        proName = self.get_argument('proName', None)
        userName = self.get_argument('userName', None)
        modName = self.get_argument('modName', None)
        limitTime = self.get_argument('limitTime', None)
        currentUser = self.get_current_user()['userId'] or ''
        rsp = RspInfo()
        try:
            dao = ProjectTaskDao()
            list, total = dao.list(page, size, proName, userName, modName, limitTime, currentUser)
            rsp.setSuccess()
            rsp.setData(list, total)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("查询项目列表失败")
        finally:
            del(dao)
        return rsp

    def delete(self):
        """
        删除任务模块
        """
        token = self.get_argument('token', None)
        modId = self.get_argument('modId', '')
        currentAuth = self.get_current_user()['userAuth'] or ''
        rsp = RspInfo()
        try:
            dao = ProjectTaskDao()
            res = dao.delete(modId, currentAuth)
            if res:
                # 删除任务模块时, 删除任务进度信息
                rate = ProjectRateDao()
                rate.delete(modId)
                rsp.setSuccess()
                rsp.setInfo("删除任务模块成功")
            else:
                rsp.setInfo("删除任务模块失败")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("删除任务模块失败")
        finally:
            del(dao)
            del(rate)
        return rsp
