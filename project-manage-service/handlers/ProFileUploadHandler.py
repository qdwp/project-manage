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
from handlers.dao.ProjectFileDao import ProjectFileDao

class ProFileUploadHandler(BaseHandler):
    """
    上传项目文件
    """

    @tornado.web.authenticated
    def post(self):
        """
        上传项目文件
        """
        rsp = RspInfo()
        try:
            upload_path=os.path.join(os.path.dirname(__file__), UPLOADPATH)
            fileName = self.get_argument('fileName', None)
            projectId = self.get_argument('projectId', None)
            projectName = self.get_argument('projectName', None)
            uploadBy = self.get_argument('uploadBy', None)
            file_metas = self.request.files['file']
            for meta in file_metas:
                filename=meta['filename']
                filepath=os.path.join(upload_path, filename)
                with open(filepath,'wb') as up:
                    up.write(meta['body'])

            # 入库
            dao = ProjectFileDao()
            res = dao.inset(fileName, projectId, projectName, uploadBy)
            rsp.setSuccess()
            if res:
                rsp.setInfo("上传文件成功")
            else:
                rsp.setInfo("上传文件入库失败")
        except Exception as e:
            Utils.log('ERROR 上传文件失败 {}'.format(e))
            rsp.setInfo("上传文件失败")
        self.write(rsp.toDict())
        return
