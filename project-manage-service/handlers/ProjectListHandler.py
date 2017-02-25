#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from handlers.BaseHandler import BaseHandler
from handlers.dao.ProjectDao import ProjectDao

class ProjectListHandler(BaseHandler):
    """
    获取项目列表
    """

    @tornado.web.authenticated
    def post(self):
        """
        项目列表
        """
        rsp = RspInfo()
        token = self.get_argument('token', None)
        page = self.get_argument('pageNum', 1)
        size = self.get_argument('pageSize', 10)
        proId = self.get_argument('proId', None)
        proName = self.get_argument('proName', None)
        proType = self.get_argument('proType', None)
        proUse = self.get_argument('proUse', None)
        userCreator = self.get_current_user()['userId'] or None
        dao = ProjectDao()
        list, total = dao.getList(page, size, proId, proName, proType, proUse, userCreator)
        rsp.setSuccess()
        rsp.setData(list, total)
        self.write(rsp.toDict())
        return