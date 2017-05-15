import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import configureStore from '../redux/store/configureStore';
import { checkLogin, getLoginInfo, getLocalToken, getLocalItem, refreshLoginInfo, getUrlVal } from '../common/util';
import App from '../view/app/App';
import Login from '../view/login/Login';
import Main from '../view/main/Main';
import Home from '../view/home/Home';
import Error401 from '../view/error/401/Error401';
import Error404 from '../view/error/404/Error404';
import Error410 from '../view/error/410/Error410';

// 用户管理
import UserManage from '../view/user/UserManage';
import ChangePassword from '../view/user/ChangePassword';

// 我的待办
import ApplyAccount from '../view/event/ApplyAccount';

// 项目管理
import ProjectManage from '../view/project/ProjectManage/ProjectManage';

// 模块信息
import ProjectModule from '../view/project/ProjectModule/ProjectModule';
import ModuleManage from '../view/project/ProjectModule/ModuleManage';

// 项目进度
import ProjectRate from '../view/project/ProjectRate/ProjectRate';

// 调试调优
import BugAppend from '../view/bug/BugAppend';
import BugManage from '../view/bug/BugManage';
import BugRecord from '../view/bug/BugRecord';

// 管理中心
import DownloadManage from '../view/setting/DownloadManage';

// 针对IE8的补丁(_IEVersion from index.html)
if (!isNaN(window._IEVersion) && window._IEVersion < 9) {
  require('zrender/lib/vml/vml');  // 此处必须使用es5的写法？
}

const store = configureStore();
// 页面刷新或关闭时保存当前APP状态
window.$(window).bind('beforeunload', () => {
  sessionStorage.removeItem('appState');
  sessionStorage.setItem('appState', JSON.stringify(store.getState()));
});

// 权限校验(包括菜单权限菜单校验 和 登录token过期校验)
function checkAuth(nextState, replace) {
  // 使用nextState.location.pathname获取路径(如：main/demo/00)
  // const path = nextState.location.pathname;
  // 权限信息应在登录后保存到loginInfo中, 通过getLoginInfo方法获取并校验
  // 若登录token过期, 则：
  // replace("/login");
  // 若权限不匹配, 则：
  // replace("main/error/401");
}

function pageRedirect() {
  // const url = window.location.href, uSysId = getUrlVal(url, "sys"), uTk = getUrlVal(url, "tk");
  // const isLogin = checkLogin(), lSysId = getLocalItem("sys"), lTk = getLocalToken();
  const info = getLoginInfo();
  const lTk = getLocalToken();
  const lSysId = null;
  let page = 'login';
  // 如果为权限系统009
  // if (lSysId === null || lSysId === "009") {
  if (lTk !== null) {
    if (info.token === undefined) {
      refreshLoginInfo(lTk, false);
    }
    if (lSysId === null) {
      // 此处最好跳转至当前路由
      page = 'login';
    } else {
      page = 'main';
    }
  }
  // }
  return page;
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRedirect to={pageRedirect()} />
        <Route path="login" component={Login} />
        <Route path="main" component={Main}>
          <IndexRedirect to="home" />
          <Route path="error/401" component={Error401} />
          <Route path="error/410" component={Error410} />
          <Route onEnter={checkAuth} path="home" component={Home} />
          <Route path="user/manage" component={UserManage} />
          <Route path="user/apply" component={ApplyAccount} />
          <Route path="user/password" component={ChangePassword} />
          <Route path="project/manage" component={ProjectManage} />
          <Route path="project/module" component={ProjectModule} />
          <Route path="module/manage" component={ModuleManage} />
          <Route path="project/rate" component={ProjectRate} />
          <Route path="bug/append" component={BugAppend} />
          <Route path="bug/manage" component={BugManage} />
          <Route path="bug/notice" component={BugRecord} />
          <Route path="setting/download" component={DownloadManage} />

          <Route path="*" component={Error404} />
        </Route>
        <Route path="*" component={Error404} />
      </Route>
    </Router>
  </Provider>
  , document.getElementById('root')
);
