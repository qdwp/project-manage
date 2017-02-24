#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from dbservers.Mysql import PySQL
from utils.Utils import Utils

class LoginDao(object):

    def __init__(self):
        pass

    def checkLogin(self, id, pwd):
        """
        检查登录信息，验证账户密码是否正确
        """
        try:
            sql = "SELECT * FROM man_auth_user WHERE USER_LOGIN='1' AND USER_ID='{0}' AND USER_PWD='{1}';".format(id, pwd)
            return PySQL.select(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return [], 0

    def updatePwd(self, id, pwd, new):
        """
        检查登录信息，修改账户密码
        """
        try:
            sql = "UPDATE man_auth_user SET USER_PWD='{2}' WHERE USER_ID='{0}' AND USER_PWD='{1}';".format(id, pwd, new)
            return PySQL.execute(sql)
        except Exception as e:
            print('ERROR {}'.format(e))
            Utils.log('ERROR {}'.format(e))
            return 0

    def valid(self):
        pass
