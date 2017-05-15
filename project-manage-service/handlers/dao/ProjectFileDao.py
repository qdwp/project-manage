#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib

from dbservers.Mysql import PySQL
from utils.Utils import Utils

class ProjectFileDao(object):

    def __init__(self):
        pass

    def inset(self, fileName, projectId, projectName, uploadBy):
        """
        上传文件信息入库
        """
        count = 0
        try:
            sql = """
                INSERT INTO man_pro_file(
                    ID,
                    FILE_NAME,
                    PRO_ID,
                    PRO_NAME,
                    UPLOAD_BY,
                    UPLOAD_TIME
                )VALUES(
                    '{}','{}','{}','{}','{}','{}'
                );
                """.format(
                    Utils.makeId(),
                    fileName,
                    projectId,
                    projectName,
                    uploadBy,
                    Utils.getLocalTime()
                    )
            Utils.log('打印上传文件信息入库SQL', sql)
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0
