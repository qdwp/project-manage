#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web
import os

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from utils.Switch import switch
from utils.Config import UPLOADPATH
from handlers.BaseHandler import BaseHandler
from handlers.dao.TaskDebugDao import TaskDebugDao

class TaskDebugHandler(BaseHandler):
    """
    任务调试管理
    """

    @tornado.web.authenticated
    def post(self, opt):
        """
        文件列表
        """
        rsp = RspInfo()
        for case in switch(opt):
            if case('append'):
                rsp = self.append()
                break
            if case('list'):
                rsp = self.list()
                break
            if case('record'):
                rsp = self.record()
                break
            if case('status'):
                rsp = self.status()
                break
            if case(): # Default
                self.write_error(404)
                return
        self.write(rsp.toDict())
        return
    
    def append(self):
        """
        创建任务问题 bug
        """
        token = self.get_argument('token', None)
        proId = self.get_argument('proId', None)
        proName = self.get_argument('proName', None)
        modId = self.get_argument('modId', None)
        modName = self.get_argument('modName', None)
        bugTitle = self.get_argument('bugTitle', None)
        bugLevel = self.get_argument('bugLevel', None)
        bugDes = self.get_argument('bugDes', None)
        userId = self.get_argument('userId', None)
        currentUser = self.get_current_user()['userId'] or ''
        
        rsp = RspInfo()
        try:
            dao = TaskDebugDao()
            res = dao.insert(proId, proName, modId, modName, bugTitle, bugLevel, bugDes, userId, currentUser)
            if res:
                rsp.setSuccess()
                rsp.setInfo("提交BUG成功")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("提交BUG失败")
        finally:
            del(dao)
        return rsp
    
    def list(self):
        """
        查询文件列表
        """
        rsp = RspInfo()
        token = self.get_argument('token', None)
        page = self.get_argument('pageNum', 1)
        size = self.get_argument('pageSize', 10)
        proName = self.get_argument('proName', None)
        modName = self.get_argument('modName', None)
        bugTitle = self.get_argument('bugTitle', None)
        bugLevel = self.get_argument('bugLevel', None)
        bugStatus = self.get_argument('bugStatus', None)
        createBy = self.get_argument('createBy', None)
        handleBy = self.get_argument('handleBy', None)
        createStart = self.get_argument('createStart', None)
        createEnd = self.get_argument('createEnd', None)
        userCreator = self.get_current_user()['userId'] or ''

        try:
            dao = TaskDebugDao()
            list, total = dao.list( page, size, proName, modName, bugTitle, bugLevel, bugStatus,
                createBy, handleBy, createStart, createEnd, userCreator )
            rsp.setSuccess()
            rsp.setData(list, total)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("获取文件下载列表失败")
        finally:
            del(dao)
        return rsp

    def record(self):
        """
        查询文件列表
        """
        rsp = RspInfo()
        token = self.get_argument('token', None)
        page = self.get_argument('pageNum', 1)
        size = self.get_argument('pageSize', 10)
        currentUserr = self.get_current_user()['userId'] or ''

        try:
            dao = TaskDebugDao()
            list, total = dao.record( page, size, currentUserr )
            rsp.setSuccess()
            rsp.setData(list, total)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("获取文件下载列表失败")
        finally:
            del(dao)
        return rsp
    

    def status(self):
        """
        修改问题状态
        """
        rsp = RspInfo()
        token = self.get_argument('token', None)
        bugId = self.get_argument('bugId', None)
        status = self.get_argument('status', None)
        currentUser = self.get_current_user()['userId'] or ''

        try:
            dao = TaskDebugDao()
            res = dao.status( bugId, status, currentUser )
            if res:
                rsp.setSuccess()
                rsp.setInfo('操作完成')
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("操作失败")
        finally:
            del(dao)
        return rsp
