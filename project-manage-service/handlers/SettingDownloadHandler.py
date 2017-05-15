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
from handlers.dao.SettingDownloadDao import SettingDownloadDao

class SettingDownloadHandler(BaseHandler):
    """
    获取文件下载列表
    """

    @tornado.web.authenticated
    def post(self, opt):
        """
        文件列表
        """
        rsp = RspInfo()
        for case in switch(opt):
            if case('files'):
                rsp = self.list()
                break
            if case('remove'):
                rsp = self.remove()
                break
            if case(): # Default
                self.write_error(404)
                return
        self.write(rsp.toDict())
        return
    
    def list(self):
        """
        查询文件列表
        """
        rsp = RspInfo()
        token = self.get_argument('token', None)
        page = self.get_argument('pageNum', 1)
        size = self.get_argument('pageSize', 10)
        proName = self.get_argument('proName', None)
        fileName = self.get_argument('fileName', None)
        uploadStart = self.get_argument('uploadStart', None)
        uploadEnd = self.get_argument('uploadEnd', None)
        userCreator = self.get_current_user()['userId'] or None

        try:
            dao = SettingDownloadDao()
            list, total = dao.list(page, size, proName, fileName, uploadStart, uploadEnd, userCreator)
            rsp.setSuccess()
            rsp.setData(list, total)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            rsp.setInfo("获取文件下载列表失败")
        finally:
            del(dao)
        return rsp

    def remove(self):
        """
        删除文件
        """
        rsp = RspInfo()
        token = self.get_argument('token', None)
        fileId = self.get_argument('fileId', None)
        fileName = self.get_argument('fileName', None)
        userCreator = self.get_current_user()['userId'] or None

        try:
            dao = SettingDownloadDao()
            if dao.delete(fileId, userCreator):
                rsp.setSuccess()
                rsp.setInfo("删除文件成功")
            else:
                rsp.setInfo("删除文件失败")
            os.remove(os.path.join(os.path.dirname(__file__), UPLOADPATH, fileName)) # 删除服务器文件资源
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        finally:
            del(dao)
        return rsp