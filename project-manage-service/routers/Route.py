#!/usr/bin/env python3
# -*- conding: utf-8 -*-

from handlers.IndexHandler import IndexHandler
from handlers.LoginHandler import LoginHandler
from handlers.UserListHandler import UserListHandler
from handlers.UserEditHandler import UserEditHandler
from handlers.UpdatePwdHandler import UpdatePwdHandler
from handlers.ValidTokenHandler import ValidTokenHandler
from handlers.ProjectListHandler import ProjectListHandler
from handlers.ProRecordEditHandler import ProRecordEditHandler
from handlers.ProUserAppendHandler import ProUserAppendHandler
from handlers.ProjectTypeHandler import ProjectTypeHandler
from handlers.ProFileUploadHandler import ProFileUploadHandler

handlers = [
    (r'/', IndexHandler),                               # 测试server路由
    (r'/user/login', LoginHandler),                     # 登录账号
    (r'/user/userList', UserListHandler),               # 加载用户列表[查询列表]
    (r'/user/updatePwd', UpdatePwdHandler),             # 修改用户密码
    (r'/user/validToken', ValidTokenHandler),           # 校验token
    (r'/user/record/(\w+)', UserEditHandler),           # 用户记录增加修改
    (r'/project/list', ProjectListHandler),             # 加载项目列表
    (r'/project/type/(\w+)', ProjectTypeHandler),       # 项目类型列表操作
    (r'/project/record/(\w+)', ProRecordEditHandler),   # 项目记录添加修改删除
    (r'/project/user/(\w+)', ProUserAppendHandler),     # 项目用户成员记录添加
    (r'/project/file', ProFileUploadHandler),           # 项目文件上传
]
