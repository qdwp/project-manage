import { hostUrl } from './url';


export const url = {
  user: {
    apply: `${hostUrl}/user/apply/commit`,
    event: `${hostUrl}/user/apply/list`,
    handle: `${hostUrl}/user/apply/handle`,
    login: `${hostUrl}/user/login`,
    list: `${hostUrl}/user/userList`,
    updatePwd: `${hostUrl}/user/updatePwd`,
    validToken: `${hostUrl}/user/validToken`,
    add: `${hostUrl}/user/record/add`,
    update: `${hostUrl}/user/record/update`,
    delete: `${hostUrl}/user/record/delete`,
    reset: `${hostUrl}/user/record/reset`,
  },
  project: {
    list: `${hostUrl}/project/list`,
    add: `${hostUrl}/project/record/add`,
    update: `${hostUrl}/project/record/update`,
    delete: `${hostUrl}/project/record/delete`,
    userList: `${hostUrl}/project/user/list`,
    userInfo: `${hostUrl}/project/user/info`,
    userListAll: `${hostUrl}/project/user/all`,
    userAppend: `${hostUrl}/project/user/append`,
    userRemove: `${hostUrl}/project/user/remove`,
    typeList: `${hostUrl}/project/type/list`,
    file: `${hostUrl}/project/file`,
  },
  module: {
    query: `${hostUrl}/project/module/query`,
  },
  task: {
    add: `${hostUrl}/project/task/add`,
    list: `${hostUrl}/project/task/list`,
    delete: `${hostUrl}/project/task/delete`,
  },
  rate: {
    query: `${hostUrl}/project/rate/query`,
    update: `${hostUrl}/project/rate/update`,
  },
  setting: {
    download: `${hostUrl}/setting/download/files`,
    delete: `${hostUrl}/setting/download/remove`,
  },
  bug: {
    append: `${hostUrl}/task/debug/append`,
    list: `${hostUrl}/task/debug/list`,
    record: `${hostUrl}/task/debug/record`,
    status: `${hostUrl}/task/debug/status`,
  },
};
