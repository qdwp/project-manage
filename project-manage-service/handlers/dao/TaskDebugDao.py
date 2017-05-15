#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib

from dbservers.Mysql import PySQL
from utils.Utils import Utils
from utils.Config import DOWNLOAD_HOST

class TaskDebugDao(object):

    def __init__(self):
        pass
    
    def insert(self, proId, proName, modId, modName, bugTitle, bugLevel, bugDes, userId, currentUser):
        """
        添加新建问题记录
        """
        count = 0
        try:
            bugId = Utils.makeId()
            sql = """
                INSERT INTO man_pro_bug(
                    BUG_ID,
                    PRO_ID,
                    PRO_NAME,
                    MODULE_ID,
                    MODULE_NAME,
                    BUG_TITLE,
                    BUG_LEVEL,
                    BUG_DES,
                    CREATE_BY,
                    CREATE_TIME,
                    HANDLE_BY,
                    HANDLE_TIME
                )VALUES(
                    '{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}','{}'
                );
                """.format(
                    bugId,
                    proId,
                    proName,
                    modId,
                    modName,
                    bugTitle,
                    bugLevel,
                    bugDes,
                    currentUser,
                    Utils.getLocalTime(),
                    userId if userId else currentUser,
                    Utils.getLocalTime()
                )
            recordSQL = """
                INSERT INTO man_bug_record(
                    ID,
                    BUG_ID,
                    BUG_STATUS,
                    HANDLE_BY,
                    HANDLE_TIME
                )VALUES(
                    '{}','{}','{}','{}','{}'
                );
                """.format(
                    Utils.makeId(),
                    bugId,
                    'created',
                    currentUser,
                    Utils.getLocalTime()
                )
            Utils.log('打印新建问题SQL', sql) # print log
            count = PySQL.execute(sql)
            PySQL.execute(recordSQL)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def list(self, page, size, proName, modName, bugTitle, bugLevel, bugStatus,
                createBy, handleBy, createStart, createEnd, currentUserr):
        """
        查询问题列表
        """
        start = ( int(page) - 1) * int(size)
        try:
            sql = """
                SELECT bug.*
                FROM man_pro_bug AS bug
                WHERE 1=1
                {}{}{}{}{}{}{}{}
                AND bug.PRO_ID IN (
                	SELECT DISTINCT member.PRO_ID
                    FROM man_pro_member AS member
                    WHERE member.USER_ID = '{userId}'
                )
                ORDER BY CREATE_TIME DESC
                LIMIT {start}, {size};
                """.format(
                    ' AND PRO_Name like "%{}%"'.format(proName) if proName else '',
                    ' AND MODULE_NAME like "%{}%"'.format(modName) if modName else '',
                    ' AND BUG_TITLE like "%{}%"'.format(bugTitle) if bugTitle else '',
                    ' AND BUG_LEVEL = "{}"'.format(bugLevel) if bugLevel else '',
                    ' AND BUG_STATUS like "%{}%"'.format(bugStatus) if bugStatus else '',
                    ' AND CREATE_BY like "%{}%"'.format(createBy) if createBy else '',
                    ' AND HANDLE_BY like "%{}%"'.format(handleBy) if handleBy else '',
                    ' AND CREATE_TIME BETWEEN "{}" AND "{}"'.format(
                        createStart, createEnd) if createStart and createEnd else '',
                    userId = currentUserr,
                    start = start,
                    size = size
                    )
            sqlTotal = """
                SELECT COUNT(1)
                FROM man_pro_bug AS bug
                WHERE 1=1
                {}{}{}{}{}{}{}{}
                AND bug.PRO_ID IN (
                	SELECT DISTINCT member.PRO_ID
                    FROM man_pro_member AS member
                    WHERE member.USER_ID = '{userId}'
                );
                """.format(
                    ' AND PRO_Name like "%{}%"'.format(proName) if proName else '',
                    ' AND MODULE_NAME like "%{}%"'.format(modName) if modName else '',
                    ' AND BUG_TITLE like "%{}%"'.format(bugTitle) if bugTitle else '',
                    ' AND BUG_LEVEL = "{}"'.format(bugLevel) if bugLevel else '',
                    ' AND BUG_STATUS like "%{}%"'.format(bugStatus) if bugStatus else '',
                    ' AND CREATE_BY like "%{}%"'.format(createBy) if createBy else '',
                    ' AND HANDLE_BY like "%{}%"'.format(handleBy) if handleBy else '',
                    ' AND CREATE_TIME BETWEEN "{}" AND "{}"'.format(
                        createStart, createEnd) if createStart and createEnd else '',
                    userId = currentUserr,
                    )
            Utils.log('查询问题列表SQL', sql)
            list = PySQL.get(sql)
            total = PySQL.count(sqlTotal)
            return list, total
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return [], 0


    def record(self, page, size, currentUserr):
        """
        查询调试记录列表
        """
        start = ( int(page) - 1) * int(size)
        try:
            sql = """
                SELECT record.*,
                    bug.PRO_NAME, bug.MODULE_NAME, bug.BUG_TITLE, bug.BUG_LEVEL, bug.BUG_DES
                FROM man_bug_record AS record
                    LEFT JOIN man_pro_bug AS bug
                    ON record.BUG_ID = bug.BUG_ID
                WHERE bug.PRO_ID IN (
                	SELECT DISTINCT member.PRO_ID
                    FROM man_pro_member AS member
                    WHERE member.USER_ID = '{userId}'
                )
                ORDER BY HANDLE_TIME DESC
                LIMIT {start}, {size};
                """.format(
                    userId = currentUserr,
                    start = start,
                    size = size
                    )
            sqlTotal = """
                SELECT COUNT(1)
                FROM man_bug_record AS record
                    LEFT JOIN man_pro_bug AS bug
                    ON record.BUG_ID = bug.BUG_ID
                WHERE bug.PRO_ID IN (
                	SELECT DISTINCT member.PRO_ID
                    FROM man_pro_member AS member
                    WHERE member.USER_ID = '{userId}'
                );
                """.format(
                    userId = currentUserr
                    )
            Utils.log('查询问题列表SQL', sql)
            list = PySQL.get(sql)
            total = PySQL.count(sqlTotal)
            return list, total
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return [], 0

    def status(self, bugId, status, currentUser):
        """
        查询调试记录列表
        """
        try:
            bugSQL = """
                UPDATE man_pro_bug
                SET
                    BUG_STATUS='{status}',
                    HANDLE_BY='{handleBy}'
                    HANDLE_TIME='{handleTime}'
                WHERE BUG_ID='{bugId}';
                """.format(
                    status = 'created' if status == 'reset' else status,
                    handleBy = currentUser,
                    handleTime = Utils.getLocalTime(),
                    bugId = bugId
                    )
            recordSQL = """
                INSERT INTO man_bug_record(
                    ID,
                    BUG_ID,
                    BUG_STATUS,
                    HANDLE_BY,
                    HANDLE_TIME
                )VALUES(
                    '{}','{}','{}','{}','{}'
                );
                """.format(
                    Utils.makeId(),
                    bugId,
                    status,
                    currentUser,
                    Utils.getLocalTime()
                )
            Utils.log('更新问题状态SQL', bugSQL)
            Utils.log('插入调试记录SQL', recordSQL)
            return PySQL.execute(bugSQL) > 0 and PySQL.execute(recordSQL) > 0
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return False
    