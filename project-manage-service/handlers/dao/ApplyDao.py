#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from dbservers.Mysql import PySQL
from utils.Utils import Utils

class ApplyDao(object):

    def __init__(self):
        pass

    def apply(self, userId, userName, userPwd):
        """
        检查登录信息，验证账户密码是否正确
        """
        try:
            validSQL_1 = "SELECT COUNT(1) FROM man_auth_user WHERE USER_ID='{}';".format(userId)
            validSQL_2 = "SELECT COUNT(1) FROM man_auth_apply WHERE USER_ID='{}';".format(userId)
            if PySQL.count(validSQL_1) > 0 or PySQL.count(validSQL_2) > 0:
                return 0
            applySQL = """
                INSERT INTO man_auth_apply(
                    USER_ID,
                    USER_NAME,
                    USER_PWD,
                    APPLY_TIME
                )VALUES(
                    '{}','{}','{}','{}'
                )
                """.format(
                    userId,
                    userName,
                    userPwd,
                    Utils.getLocalTime()
                    )
            if PySQL.execute(applySQL):
                return 1
            else:
                return -1 
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return -1
    
    def list(self, page, size, userId, userName, applyStart, applyEnd, userCreator):
        """
        查询待处理申请
        """
        start = ( int(page) - 1) * int(size)
        try:
            sql = """
                SELECT apply.*
                FROM man_auth_apply AS apply
                WHERE 1=1
                {}{}{}
                ORDER BY APPLY_TIME DESC
                LIMIT {start}, {size};
                """.format(
                    ' AND USER_ID like "%{}%"'.format(userId) if userId else '',
                    ' AND USER_NAME like "%{}%"'.format(userName) if userName else '',
                    ' AND APPLY_TIME BETWEEN "{}" AND "{}"'.format(
                        applyStart, applyEnd) if applyStart and applyEnd else '',
                    start = start,
                    size = size
                    )
            sqlTotal = """
                SELECT COUNT(1)
                FROM man_auth_apply
                WHERE 1=1
                {}{}{};
                """.format(
                    ' AND USER_ID like "%{}%"'.format(userId) if userId else '',
                    ' AND USER_NAME like "%{}%"'.format(userName) if userName else '',
                    ' AND APPLY_TIME BETWEEN "{}" AND "{}"'.format(
                        applyStart, applyEnd) if applyStart and applyEnd else '',
                    )
            Utils.log('查询待办列表SQL', sql)
            list = PySQL.get(sql)
            total = PySQL.count(sqlTotal)
            return list, total
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return [], 0

    def remove(self, userId):
        try:
            sql = "DELETE FROM man_auth_apply WHERE USER_ID='{}';".format(userId)
            return PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return 0
