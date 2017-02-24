import { combineReducers } from 'redux';
import { CLICK_MENU, BUILD_MENU, TOGGLE_MENU } from '../action/main';
import { buildMenu } from '../../common/antdUtil';

// 初始化状态(面包屑, 菜单)
const breadcrumbInitState = {
  curPath: ['HOME'],
};
const menuInitState = {
  curMenu: '',
  openKeys: ['DEMO'],
  menuData: null,
};

// 更新状态(面包屑, 菜单)
function updateBreadcrumbState(state = breadcrumbInitState, action) {
  let newState = {};
  switch (action.type) {
    case CLICK_MENU:
      // 组成面包屑路径,如：APP / DEMO / 01
      let curPath = action.item.keyPath;
      newState = Object.assign({}, state, { curPath: curPath ? curPath : ['HOME'] });
      break;
    default:
      newState = state;
  }
  return newState;
}
function updateMenuState(state = menuInitState, action) {
  let newState = {};
  switch (action.type) {
    case BUILD_MENU:
      newState = Object.assign({}, state, { menuData: buildMenu(action.data) });
      break;
    case CLICK_MENU:
      let openKeys = action.item.keyPath;
      newState = Object.assign({}, state, { curMenu: action.item.key, openKeys: openKeys.slice(1) });
      break;
    case TOGGLE_MENU:
      newState = Object.assign({}, state, { openKeys: action.item.open ? action.item.keyPath : action.item.keyPath.slice(1) });
      break;
    default:
      newState = state;
  }
  return newState;
}

const main = combineReducers({
  updateBreadcrumbState,
  updateMenuState,
});

export default main;
