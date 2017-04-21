#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado.options import define, options

from routers.Route import handlers

define("port", default=5000, help="run on the given port", type=int)


class Application(tornado.web.Application):

    @classmethod
    def main(self):
        settings = {'login_url': '/user/login'}
        tornado.options.parse_command_line()
        app = tornado.web.Application(handlers=handlers, **settings)
        http_server = tornado.httpserver.HTTPServer(app)
        http_server.listen(options.port)
        tornado.ioloop.IOLoop.instance().start()
