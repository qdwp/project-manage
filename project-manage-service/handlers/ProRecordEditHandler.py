#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from utils.Switch import switch
from handlers.BaseHandler import BaseHandler
from handlers.dao.ProjectDao import ProjectDao

class ProRecordEditHandler(BaseHandler):
    """
    编辑用户信息
    """

    @tornado.web.authenticated
    def post(self, opt):
        """
        项目列表
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
            if case(): # Default
                self.write_error(404)
                return
        self.write(rsp.toDict())
        return

    def add(self):
        """
        添加 project 记录
        """
        token = self.get_argument('token', None)
        proName = self.get_argument('proName', None)
        proType = self.get_argument('proType', None)
        proUse = self.get_argument('proUse', None)
        proDes = self.get_argument('proDes', None)
        userCreator = self.get_current_user()['userId'] or None
        rsp = RspInfo()
        try:
            dao = ProjectDao()
            res = dao.insert(proName, proType, proUse, proDes, userCreator)
            if res:
                rsp.setSuccess()
                rsp.setInfo("添加项目成功")
                rsp.setObj(token)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("添加项目失败")
        finally:
            del(dao)
        return rsp

    def update(self):
        """
        更新 project 记录
        """
        token = self.get_argument('token', None)
        proId = self.get_argument('proId', None)
        proName = self.get_argument('proName', None)
        proType = self.get_argument('proType', None)
        proUse = self.get_argument('proUse', None)
        proDes = self.get_argument('proDes', None)
        rsp = RspInfo()
        try:
            dao = ProjectDao()
            res = dao.update(proId, proType, proUse, proDes)
            if res:
                rsp.setSuccess()
                rsp.setInfo("更新用户成功")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("修改用户失败")
        finally:
            del(dao)
        return rsp

    def delete(self):
        """
        删除 project 记录
        """
        token = self.get_argument('token', None)
        proId = self.get_argument('proId', None)
        rsp = RspInfo()
        try:
            dao = ProjectDao()
            if dao.valid(proId):
                Utils.log('WARNING', '校验项目已分配成员或者模块')
                rsp.setInfo('校验项目已分配成员或者模块, 无法删除')
            elif dao.delete(proId):
                rsp.setSuccess()
                rsp.setInfo("删除用户成功")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("删除用户失败")
        finally:
            del(dao)
        return rsp
