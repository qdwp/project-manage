#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib

from dbservers.Mysql import PySQL
from utils.Utils import Utils

class ProjectModuleDao(object):

    def __init__(self):
        pass

    def query(self, proId, userId):
        """
        查询数据库项目模块列表
        """
        try:
            sql = """
                SELECT task.MODULE_ID, task.MODULE_NAME
                FROM man_pro_task AS task
                WHERE task.PRO_ID='{}'
                ORDER BY CREATE_TIME;
                """.format(proId)
            Utils.log('查询数据库项目模块列表SQL', sql)
            list = PySQL.get(sql)
            return list
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return []
