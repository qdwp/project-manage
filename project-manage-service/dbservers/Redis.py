#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import redis

from utils.Config import TTL

class MyRedis(object):

    # 定义静态变量实例
    __instance=None

    def __init__(self):
        self.pool = redis.ConnectionPool(host = '127.0.0.1', port = 6379, db = 0)
        self.r = redis.Redis(connection_pool = self.pool)

    def __new__(cls, *args, **kwd):
        if cls.__instance is None:
            cls.__instance = object.__new__(cls, *args, **kwd)
        return cls.__instance

    def set(self, key, value):
        try:
            v = self.r.set(key, value, TTL)
        except Exception as e:
            print('ERROR {}'.format(e))
            v = False
        return v

    def get(self, key):
        try:
            v = self.r.get(key)
        except Exception as e:
            print('ERROR {}'.format(e))
            v = False
        return v

    def expire(self, key):
        try:
            v = self.r.expire(key, TTL)
        except Exception as e:
            print('ERROR {}'.format(e))
            v = False
        return v
