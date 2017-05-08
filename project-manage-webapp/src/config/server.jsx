import { hostUrl } from './url';


export const url = {
  user: {
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
    userAppend: `${hostUrl}/project/user/append`,
    userRemove: `${hostUrl}/project/user/remove`,
    typeList: `${hostUrl}/project/type/list`,
    file: `${hostUrl}/project/file`,
  },
};
