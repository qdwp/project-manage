#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib

from dbservers.Mysql import PySQL
from utils.Utils import Utils

class ProjectTaskDao(object):

    def __init__(self):
        pass

    def insert(self, proId, userId, modId, modName, modDes, modStart, modEnd):
        """
        添加分配任务记录
        """
        count = 0
        try:
            sql = """
                INSERT INTO man_pro_task(
                    PRO_ID,
                    USER_ID,
                    MODULE_ID,
                    MODULE_NAME,
                    MODULE_DES,
                    MODULE_START,
                    MODULE_END,
                    CREATE_TIME
                )VALUES(
                    '{}','{}','{}','{}','{}','{}','{}','{}'
                );
                """.format(
                    proId,
                    userId,
                    modId,
                    modName,
                    modDes,
                    modStart,
                    modEnd,
                    Utils.getLocalTime()
                    )
            Utils.log('打印创建项目SQL', sql)
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def list(self, page, size, proName, userName, modName, limitTime, currentUser):
        """
        查询分配任务记录
        """
        start = ( int(page) - 1) * int(size)
        try:
            sql = """
                SELECT task.*, member.PRO_NAME, member.USER_NAME
                FROM man_pro_task AS task
                    LEFT JOIN man_pro_member AS member
                    ON task.PRO_ID = member.PRO_ID
                    AND task.USER_ID = member.USER_ID
                WHERE 1=1
                {}{}{}{}{}
                ORDER BY MODULE_END ASC, CREATE_TIME DESC
                LIMIT {start}, {size};
                """.format(
                    ' AND PRO_NAME like "%{}%"'.format(proName) if proName else '',
                    ' AND USER_NAME like "%{}%"'.format(userName) if userName else '',
                    ' AND MODULE_NAME like "%{}%"'.format(modName) if modName else '',
                    ' AND MODULE_END <= "{}"'.format(limitTime) if limitTime else '',
                    ' AND USER_CREATOR = "{}"'.format(currentUser) if currentUser else '',
                    start=start,
                    size=size
                    )
            Utils.log('查询数据库任务列表SQL', sql)
            list = PySQL.get(sql)
            sqlTotal = """
                SELECT COUNT(1)
                FROM man_pro_task AS task
                    LEFT JOIN man_pro_member AS member
                    ON task.PRO_ID = member.PRO_ID
                    AND task.USER_ID = member.USER_ID
                WHERE 1=1
                {}{}{}{}{}
                """.format(
                    ' AND PRO_NAME like "%{}%"'.format(proName) if proName else '',
                    ' AND USER_NAME like "%{}%"'.format(userName) if userName else '',
                    ' AND MODULE_NAME = "{}"'.format(modName) if modName else '',
                    ' AND MODULE_END <= "{}"'.format(limitTime) if limitTime else '',
                    ' AND USER_CREATOR = "{}"'.format(currentUser) if currentUser else '',
                    )
            total = PySQL.count(sqlTotal)
            return list, total
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return [], 0

    def delete(self, modId, currentAuth):
        """
        删除任务模块记录
        """
        count = 0
        try:
            sql = """
                DELETE FROM man_pro_task
                WHERE MODULE_ID='{}';
                """.format(modId)
            Utils.log(sql)
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0
