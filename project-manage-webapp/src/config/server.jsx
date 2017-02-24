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
  },
};
