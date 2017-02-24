import { getLoginInfo } from '../../common/util';

import adminMenu from '../../data/adminMenu.json';
import leaderMenu from '../../data/leaderMenu.json';
import numberMenu from '../../data/numberMenu.json';

export const TOGGLE_MENU = 'TOGGLE_MENU';
export const CLICK_MENU = 'CLICK_MENU';
export const BUILD_MENU = 'BUILD_MENU';

export function clickMenuAction(item) {
  return {
    type: CLICK_MENU,
    item,
  };
}

// 异步action 基于中间件thunkMiddleware (详见configureStore)
export function buildMenuAction() {
  // =======
  const info = getLoginInfo();
  // console.log(info);
  // 根据不同的用户权限，加载目录列表
  switch (info.userAuth) {
    case '0':
      return { type: BUILD_MENU, data: adminMenu };
    case '1':
      return { type: BUILD_MENU, data: leaderMenu };
    case '2':
      return { type: BUILD_MENU, data: numberMenu };
    default:
      return null;
  }
}

export function toggleMenuAction(item) {
  return {
    type: TOGGLE_MENU,
    item,
  };
}
