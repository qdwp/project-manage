#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib

from dbservers.Mysql import PySQL
from utils.Utils import Utils

class ProjectTypeDao(object):

    def __init__(self):
        pass

    def getList(self):
        """
        查询 projec type 列表
        """
        try:
            sql = "SELECT CONVERT(TYPE_ID, char) AS TYPE_ID, TYPE_TEXT FROM man_pro_type;"
            list = PySQL.get(sql)
            return list
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return []
