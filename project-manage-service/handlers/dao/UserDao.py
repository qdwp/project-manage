#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from dbservers.Mysql import PySQL
from utils.Utils import Utils

class UserDao(object):

    def __init__(self):
        pass

    def getList(self, page, size, userId, userName, userAuth, userLogin, userCreator):
        """
        查询数据库用户列表
        """
        start = ( int(page) - 1) * int(size)
        try:
            sql = """
                SELECT USER_ID,USER_NAME,USER_AUTH,USER_LOGIN,USER_CREATOR,USER_CRE_TIME
                FROM man_auth_user
                WHERE 1=1
                {}{}{}{}{}{}
                ORDER BY USER_AUTH, USER_ID
                LIMIT {start}, {size};
                """.format(
                    ' AND USER_ID like "%{}%"'.format(userId) if userId else '',
                    ' AND USER_Name like "%{}%"'.format(userName) if userName else '',
                    ' AND USER_AUTH = "{}"'.format(userAuth) if userAuth else '',
                    ' AND USER_LOGIN = "{}"'.format(userLogin) if userLogin else '',
                    ' AND USER_CREATOR = "{}"'.format(userCreator) if userCreator and userCreator != 'admin' else '',
                    ' OR USER_ID = "{}"'.format(userCreator) if userCreator and userCreator != 'admin' else '',
                    start=start,
                    size=size
                    )
            Utils.log('查询数据库用户列表SQL', sql)
            list = PySQL.get(sql)
            sqlTotal = """
                SELECT COUNT(1) FROM man_auth_user
                WHERE 1=1
                {}{}{}{}{}{};
                """.format(
                    ' AND USER_ID like "%{}%"'.format(userId) if userId else '',
                    ' AND USER_Name like "%{}%"'.format(userName) if userName else '',
                    ' AND USER_AUTH = "{}"'.format(userAuth) if userAuth else '',
                    ' AND USER_LOGIN = "{}"'.format(userLogin) if userLogin else '',
                    ' AND USER_CREATOR = "{}"'.format(userCreator) if userCreator and userCreator != 'admin' else '',
                    ' OR USER_ID = "{}"'.format(userCreator) if userCreator and userCreator != 'admin' else '',
                    )
            total = PySQL.count(sqlTotal)
            return list, total
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return [], 0
    
    def validInsert(self, userId):
        """
        检查用户名是否存在
        """
        count = 0
        try:
            sql = """
                SELECT COUNT(1) FROM man_auth_user
                WHERE USER_ID="{}";
                """.format(userId)
            count = PySQL.count(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def insert(self, userId, userName, userAuth, userLogin, userCreator):
        """
        添加用户记录
        """
        count = 0
        try:
            sql = """
                INSERT INTO man_auth_user(
                    USER_ID,
                    USER_NAME,
                    USER_AUTH,
                    USER_LOGIN,
                    USER_CREATOR,
                    USER_CRE_TIME
                )VALUES(
                    '{}','{}','{}','{}','{}','{}'
                );
                """.format(userId, userName, userAuth, userLogin, userCreator, Utils.getLocalTime())
            Utils.log('添加用户记录SQL', sql)
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def update(self, userId, userName, userAuth, userLogin, currentAuth):
        """
        修改用户记录
        """
        count = 0
        try:
            sql = """
                UPDATE man_auth_user SET
                    USER_NAME='{}',
                    USER_AUTH='{}',
                    USER_LOGIN='{}'
                WHERE USER_ID='{}'
                AND USER_AUTH > '{}';
                """.format(userName, userAuth, userLogin, userId, currentAuth)
            Utils.log(sql) # print log
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def delete(self, userId, currentAuth):
        """
        删除用户记录
        """
        count = 0
        try:
            sql = """
                DELETE FROM man_auth_user
                WHERE USER_ID='{}'
                AND USER_AUTH > '{}';
                """.format(userId, currentAuth)
            Utils.log(sql) # print log
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def reset(self, userId, currentAuth):
        """
        重置用户密码 111111
        """
        count = 0
        try:
            besql = """
                SELECT 1 FROM man_auth_user
                WHERE USER_ID='{}'
                AND USER_PWD='96e79218965eb72c92a549dd5a330112';
                """.format(userId)
            res = PySQL.execute(besql)
            if res > 0:
                Utils.log('愿密码已为默认值')
                return True
            sql = """
                UPDATE man_auth_user
                SET USER_PWD=Default
                WHERE USER_ID='{}'
                AND USER_AUTH >= '{}';
                """.format(userId, currentAuth)
            Utils.log(sql) # print log
            count = PySQL.execute(sql)
            print(count)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0
