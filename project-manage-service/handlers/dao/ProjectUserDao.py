#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib

from dbservers.Mysql import PySQL
from utils.Utils import Utils

class ProjectUserDao(object):

    def __init__(self):
        pass

    def getList(self, page, size, proId, userCreator, userId, userName):
        """
        查询数据库 user 列表
        """
        start = ( int(page) - 1) * int(size)
        try:
            sql = """
                SELECT user.*
                FROM man_auth_user AS user
                WHERE user.USER_CREATOR='{userCreator}'
                {id}{name}
                AND user.USER_ID NOT IN (
                    SELECT member.USER_ID
                    FROM man_pro_member AS member
                    WHERE member.USER_CREATOR='{userCreator}'
                    AND member.PRO_ID='{proId}'
                )
                ORDER BY USER_ID
                LIMIT {start}, {size};
                """.format(
                    userCreator=userCreator,
                    proId=proId,
                    id=' AND USER_ID like "%{}%"'.format(userId) if userId else '',
                    name=' AND USER_NAME like "%{}%"'.format(userName) if userName else '',
                    start=start,
                    size=size
                    )
            
            sqlTotal = """
                SELECT COUNT(1)
                FROM man_auth_user AS user
                WHERE user.USER_CREATOR='{userCreator}'
                {id}{name}
                AND user.USER_ID NOT IN (
                    SELECT member.USER_ID
                    FROM man_pro_member AS member
                    WHERE member.USER_CREATOR='{userCreator}'
                    AND member.PRO_ID='{proId}'
                )
                ORDER BY USER_ID;
                """.format(
                    userCreator=userCreator,
                    proId=proId,
                    id=' AND USER_ID like "%{}%"'.format(userId) if userId else '',
                    name=' AND USER_NAME like "%{}%"'.format(userName) if userName else ''
                    )
            list = PySQL.get(sql)
            total = PySQL.count(sqlTotal)
            return list, total
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return [], 0
    
    def getInfo(self, page, size, proId, userId, userName):
        """
        查询数据库 project-user 列表
        """
        start = ( int(page) - 1) * int(size)
        try:
            sql = """
                SELECT *
                FROM man_pro_member
                WHERE PRO_ID='{proId}'
                {id}{name}
                ORDER BY USER_ID
                LIMIT {start}, {size};
                """.format(
                    proId=proId,
                    id=' AND USER_ID like "%{}%"'.format(userId) if userId else '',
                    name=' AND USER_NAME like "%{}%"'.format(userName) if userName else '',
                    start=start,
                    size=size
                    )
            sqlTotal = """
                SELECT COUNT(1)
                FROM man_pro_member
                WHERE PRO_ID='{proId}'
                {id}{name}
                ORDER BY USER_ID
                LIMIT {start}, {size};
                """.format(
                    proId=proId,
                    id=' AND USER_ID like "%{}%"'.format(userId) if userId else '',
                    name=' AND USER_NAME like "%{}%"'.format(userName) if userName else '',
                    start=start,
                    size=size
                    )
            list = PySQL.get(sql)
            total = PySQL.count(sqlTotal)
            return list, total
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return [], 0

    def append(self, proId, proName, userCreator, allUsers):
        """
        添加 project 记录
        """
        count = 0
        try:
            tmp = []
            for u in allUsers:
                tmp.append("('{}','{}','{}','{}','{}')".format(proId, proName, u['userId'], u['userName'], userCreator))
            t = ",".join(tmp)
            Utils.log(t)
            sql = """
                INSERT INTO man_pro_member(
                    PRO_ID,
                    PRO_NAME,
                    USER_ID,
                    USER_NAME,
                    USER_CREATOR
                )VALUES
                {};
                """.format(t)
            Utils.log('打印创建项目SQL', sql) # print log
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def remove(self, proId, userId):
        """
        移除成员信息, 如果已分配任务则不能移除
        """
        count = 0
        try:
            sql = """
                DELETE FROM man_pro_member
                WHERE PRO_ID='{proId}'
                AND USER_ID='{userId}';
                """.format(proId=proId, userId=userId)
            Utils.log('打印移除成员SQL', sql) # print log
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def valid(self, proId, userId):
        """
        校验成员是否已分配任务
        """
        count = 0
        try:
            SQL = """
                SELECT 1 FROM man_pro_task
                WHERE PRO_ID='{proId}'
                AND USER_ID='{userId}';
                """.format(proId=proId, userId=userId)
            Utils.log('打印校验成员SQL', SQL) # print log
            count = PySQL.execute(SQL)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0
