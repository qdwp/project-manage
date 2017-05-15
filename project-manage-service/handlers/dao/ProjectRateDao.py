#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import hashlib

from dbservers.Mysql import PySQL
from utils.Utils import Utils

class ProjectRateDao(object):

    def __init__(self):
        pass

    def query(self, modId):
        """
        查询任务进度
        """
        try:
            sql = """
                SELECT rate.*, task.MODULE_NAME, member.PRO_NAME, task.MODULE_START, task.MODULE_END
                FROM man_pro_rate AS rate
                    LEFT JOIN man_pro_task AS task
                        ON rate.MODULE_ID = task.MODULE_ID
                    LEFT JOIN man_pro_member AS member
                        ON task.PRO_ID = member.PRO_ID
                        AND rate.USER_ID = member.USER_ID
                WHERE rate.USER_ID='{}'
                ORDER BY task.CREATE_TIME DESC;
                """.format(modId)
            data = PySQL.get(sql)
            Utils.log(sql)
            Utils.log(data)
            return data
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return []

    def insert(self, userId, modId, currentUser):
        """
        初始化任务进度
        """
        count = 0
        try:
            sql = """
                INSERT INTO man_pro_rate(
                    USER_ID,
                    MODULE_ID,
                    TASK_RATE,
                    UPDATE_BY,
                    UPDATE_TIME
                )VALUES(
                    '{}','{}','{}','{}','{}'
                );
                """.format(
                    userId,
                    modId,
                    0,
                    currentUser,
                    Utils.getLocalTime()
                    )
            Utils.log('打印任务进度SQL', sql)
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def delete(self, modId):
        """
        删除任务进度
        """
        count = 0
        try:
            sql = """
                DELETE FROM man_pro_rate
                WHERE MODULE_ID='{}';
                """.format(modId)
            Utils.log(sql)
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0

    def update(self, data, currentUser):
        """
        更新任务进度
        """
        count = 0
        try:
            sql = """
                UPDATE man_pro_rate SET
                    TASK_RATE={},
                    UPDATE_BY='{}',
                    UPDATE_TIME='{}'
                WHERE TASK_RATE != {}
                AND USER_ID='{}'
                AND MODULE_ID='{}';
                """.format(
                    data['TASK_RATE'],
                    currentUser,
                    Utils.getLocalTime(),
                    data['TASK_RATE'],
                    data['USER_ID'],
                    data['MODULE_ID']
                    )
            Utils.log('打印更新任务进度SQL', sql)
            count = PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
        return count > 0
