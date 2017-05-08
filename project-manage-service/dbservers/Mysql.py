#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pymysql


# 设置连接数据库的配置，字符集 utf8mb4, 结果集"字典"DictCursor
config = {
    'host': '127.0.0.1',
    'port': 3306,
    'user': 'root',
    'password': 'root',
    'db': 'PROMANAGER',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor,
}


class PySQL(object):
    """
    pymysql 操作辅助类
    """
    @staticmethod
    def connect():
        """
        创建数据库连接
        """
        try:
            return pymysql.connect(**config)
        except:
            return None

    @staticmethod
    def select(sql):
        """
        查询列表数据
        @return list, total
        """
        conn = PySQL.connect()
        try:
            curs = conn.cursor()
            curs.execute(sql)
            data = list(curs.fetchall())
            return data, len(data)
        finally:
            if conn:
                conn.close()
        return [], 0

    @staticmethod
    def get(sql):
        """
        查询列表数据
        @return list
        """
        conn = PySQL.connect()
        try:
            curs = conn.cursor()
            curs.execute(sql)
            data = list(curs.fetchall())
            return data
        finally:
            if conn:
                conn.close()
        return []
    
    @staticmethod
    def count(sql):
        """
        查询列表数据
        @return list
        """
        conn = PySQL.connect()
        try:
            curs = conn.cursor()
            curs.execute(sql)
            count = curs.fetchone()['COUNT(1)']
            return count
        finally:
            if conn:
                conn.close()
        return 0

    @staticmethod
    def execute(sql):
        """
        返回数据行数
        @return rowcount
        """
        conn = PySQL.connect()
        try:
            curs = conn.cursor()
            curs.execute(sql)
            conn.commit()
            return curs.rowcount
        except:
            conn.rollback()
        finally:
            if conn:
                conn.close()
        return 0
