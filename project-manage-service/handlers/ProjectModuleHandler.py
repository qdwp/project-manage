#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from utils.Switch import switch
from handlers.BaseHandler import BaseHandler
from handlers.dao.ProjectModuleDao import ProjectModuleDao

class ProjectModuleHandler(BaseHandler):
    """
    项目模块信息
    """

    @tornado.web.authenticated
    def post(self, opt):
        """
        项目模块信息
        """
        rsp = RspInfo()
        for case in switch(opt):
            if case('query'):
                rsp = self.query()
                break
            if case(): # Default
                self.write_error(404)
                return
        self.write(rsp.toDict())
        return

    def query(self):
        """
        查询项目模块信息
        """
        proId = self.get_argument('proId', None)
        userId = self.get_current_user()['userId'] or ''
        rsp = RspInfo()
        try:
            dao = ProjectModuleDao()
            list = dao.query(proId, userId)
            rsp.setSuccess()
            rsp.setData(list)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR 查询项目模块信息失败 {}'.format(e))
            rsp.setInfo("查询项目模块信息失败")
        finally:
            del(dao)
        return rsp
