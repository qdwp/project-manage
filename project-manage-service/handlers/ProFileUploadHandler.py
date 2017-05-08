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
from handlers.dao.ProjectUserDao import ProjectUserDao

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
            uploadBy = self.get_argument('uploadBy', None)
            print("文件上传" + uploadBy)
            file_metas = self.request.files['file']
            for meta in file_metas:
                filename=meta['filename']
                filepath=os.path.join(upload_path,filename)
                with open(filepath,'wb') as up:
                    up.write(meta['body'])
            rsp.setSuccess()
            rsp.setInfo("文件上传成功")
        except Exception as e:
            Utils.log('ERROR 文件上传失败 {}'.format(e))
            rsp.setInfo("文件上传失败")
        self.write(rsp.toDict())
        return
