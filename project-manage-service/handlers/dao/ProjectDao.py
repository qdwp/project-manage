#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib

from dbservers.Mysql import PySQL
from utils.Utils import Utils

class ProjectDao(object):

    def __init__(self):
        pass

    def getList(self, page, size, proId, proName, proType, proUse, userCreator):
        """
        查询数据库 project 列表
        """
        start = ( int(page) - 1) * int(size)
        try:
            sql = """
                SELECT info.*,type.TYPE_TEXT
                FROM man_pro_info AS info, man_pro_type AS type
                WHERE info.PRO_TYPE=type.TYPE_ID
                {}{}{}{}{}
                ORDER BY PRO_ID
                LIMIT {start}, {size};
                """.format(
                    ' AND PRO_ID like "%{}%"'.format(proId) if proId else '',
                    ' AND PRO_Name like "%{}%"'.format(proName) if proName else '',
                    ' AND PRO_TYPE = "{}"'.format(proType) if proType else '',
                    ' AND PRO_USE = "{}"'.format(proUse) if proUse else '',
                    ' AND PRO_LEADER = "{}"'.format(userCreator) if userCreator else '',
                    start=start,
                    size=size
                    )
            Utils.log('查询数据库 project 列表SQL', sql)
            list = PySQL.get(sql)
            # sqlTotal = """
            #     SELECT 1 FROM man_auth_user
            #     WHERE 1=1
            #     {}{}{}{};
            #     """.format(
            #         ' AND USER_ID like "%{}%"'.format(userId) if userId else '',
            #         ' AND USER_NAME like "%{}%"'.format(userName) if userName else '',
            #         ' AND USER_AUTH = "{}"'.format(userAuth) if userAuth else '',
            #         ' AND USER_LOGIN = "{}"'.format(userLogin) if userLogin else ''
            #         )
            # total = PySQL.execute(sqlTotal)
            total = len(list)
            return list, total
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return [], 0
    
    def insert(self, proName, proType, proUse, proDes, userCreator):
        """
        添加 project 记录
        """
        count = 0
        try:
            sql = """
                INSERT INTO man_pro_info(
                    PRO_ID,
                    PRO_NAME,
                    PRO_TYPE,
                    PRO_LEADER,
                    PRO_USE,
                    PRO_CRE_TIME,
                    PRO_DES
                )VALUES(
                    '{}','{}','{}','{}','{}','{}','{}'
                );
                """.format(
                    self.makeProId(),
                    proName,
                    proType,
                    userCreator,
                    proUse,
                    Utils.getLocalTime(),
                    proDes)
            Utils.log('打印创建项目SQL', sql) # print log
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def update(self, proId, proType, proUse, proDes):
        """
        修改 project 记录
        """
        count = 0
        try:
            sql = """
                UPDATE man_pro_info SET 
                    PRO_TYPE='{}',
                    PRO_USE='{}',
                    PRO_DES='{}'
                WHERE PRO_ID='{}';
                """.format(proType, proUse, proDes, proId)
            Utils.log(sql) # print log
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def delete(self, proId):
        """
        删除 project 记录
        """
        count = 0
        try:
            sql = """
                DELETE FROM man_pro_info
                WHERE PRO_ID='{}';
                """.format(proId)
            Utils.log(sql) # print log
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def valid(self, proId):
        """
        校验项目是否已分配成员和模块
        """
        count = 0
        try:
            userSQl = """
                SELECT 1 from man_pro_member
                WHERE PRO_ID='{proId}';
                """.format(proId=proId)
            moduleSQL = """
                SELECT 1 from man_pro_module
                WHERE PRO_ID='{proId}';
                """.format(proId=proId)
            count = 1 if PySQL.execute(userSQl) > 0 or  PySQL.execute(moduleSQL) > 0 else 0
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def makeProId(self):
        """
        生成新项目ID
        """
        dot = str(Utils.getDotTime())
        return Utils.getShortDate() + hashlib.md5(dot.encode('utf-8')).hexdigest()[8:-8].upper()
