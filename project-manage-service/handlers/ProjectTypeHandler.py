#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from utils.Switch import switch
from handlers.BaseHandler import BaseHandler
from handlers.dao.ProjectTypeDao import ProjectTypeDao

class ProjectTypeHandler(BaseHandler):
    """
    获取项目类型列表
    """

    @tornado.web.authenticated
    def get(self, opt):
        """
        project type list
        """
        rsp = RspInfo()
        rsp = self.queryList()
        self.write(rsp.toDict())
        return

    @tornado.web.authenticated
    def post(self, opt):
        """
        项目类型列表
        """
        rsp = RspInfo()
        rsp = self.queryList()
        self.write(rsp.toDict())
        return

    def queryList(self):
        """
        加载项目类型
        """
        token = self.get_argument('token', None)
        
        rsp = RspInfo()
        try:
            dao = ProjectTypeDao()
            list = dao.getList()
            rsp.setSuccess()
            rsp.setInfo("加载项目类型成功")
            rsp.setData(list)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("加载项目类型失败")
        finally:
            del(dao)
        return rsp
