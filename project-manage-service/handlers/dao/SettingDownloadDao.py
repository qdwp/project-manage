#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib

from dbservers.Mysql import PySQL
from utils.Utils import Utils
from utils.Config import DOWNLOAD_HOST

class SettingDownloadDao(object):

    def __init__(self):
        pass

    def list(self, page, size, proName, fileName, uploadStart, uploadEnd, userCreator):
        """
        查询上传服务器的文件列表
        """
        start = ( int(page) - 1) * int(size)
        try:
            sql = """
                SELECT file.*, CONCAT( '{downPath}', file.FILE_NAME ) AS FILE_URL
                FROM man_pro_file AS file
                WHERE 1=1
                {}{}{}
                ORDER BY UPLOAD_TIME DESC
                LIMIT {start}, {size};
                """.format(
                    ' AND PRO_Name like "%{}%"'.format(proName) if proName else '',
                    ' AND FILE_NAME like "%{}%"'.format(fileName) if fileName else '',
                    ' AND UPLOAD_TIME BETWEEN "{}" AND "{}"'.format(
                        uploadStart, uploadEnd) if uploadStart and uploadEnd else '',
                    downPath = DOWNLOAD_HOST,
                    start = start,
                    size = size
                    )
            sqlTotal = """
                SELECT COUNT(1)
                FROM man_pro_file AS file
                WHERE 1=1
                {}{}{}
                ORDER BY UPLOAD_TIME DESC;
                """.format(
                    ' AND PRO_Name like "%{}%"'.format(proName) if proName else '',
                    ' AND FILE_NAME like "%{}%"'.format(fileName) if fileName else '',
                    ' AND UPLOAD_TIME BETWEEN "{}" AND "{}"'.format(
                        uploadStart, uploadEnd) if uploadStart and uploadEnd else '',
                    )
            Utils.log('查询数据库上传服务器的文件列表SQL', sql)
            list = PySQL.get(sql)
            total = PySQL.count(sqlTotal)
            return list, total
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return [], 0


    def delete(self, fileId, userCreator):
        """
        删除文件
        """
        count = 0
        try:
            sql = """
                DELETE FROM man_pro_file
                WHERE ID='{}';
                """.format(fileId)
            Utils.log("删除项目文件", sql)
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0