#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import tornado.web

from jose import jwt

from utils.Utils import Utils
from utils.RspInfo import RspInfo
from utils.Switch import switch
from handlers.BaseHandler import BaseHandler
from handlers.dao.ProjectRateDao import ProjectRateDao

class ProjectRateHandler(BaseHandler):
    """
    项目任务进度管理
    """

    @tornado.web.authenticated
    def post(self, opt):
        """
        进度管理
        """
        rsp = RspInfo()
        for case in switch(opt):
            if case('query'):
                rsp = self.query()
                break
            if case('update'):
                rsp = self.update()
                break
            if case(): # Default
                self.write_error(404)
                return
        self.write(rsp.toDict())
        return

    def query(self):
        """
        查询任务进度
        """
        userId = self.get_current_user()['userId'] or ''
        rsp = RspInfo()
        try:
            dao = ProjectRateDao()
            res = dao.query(userId)
            rsp.setSuccess()
            rsp.setObj(res)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR 查询任务进度失败 {}'.format(e))
            rsp.setInfo("查询任务进度失败")
        finally:
            del(dao)
        return rsp

    def update(self):
        """
        更新任务进度
        """
        params = self.get_argument('data', [])
        currentUser = self.get_current_user()['userId'] or ''
        data = json.loads(params)
        Utils.log('data', data)

        rsp = RspInfo()
        try:
            dao = ProjectRateDao()
            for dat in data:
                dao.update(dat, currentUser)
            rsp.setSuccess()
            rsp.setInfo("更新进度成功")
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("更新进度失败")
        finally:
            del(dao)
        return rsp
