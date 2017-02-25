import './Main.less';
import appConf from '../../config/app.json';
import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Menu, Breadcrumb, Icon, Badge, Modal, Popover } from 'antd';
import TdCard from '../../component/TdCard';
import { clickMenuAction, buildMenuAction, toggleMenuAction } from '../../redux/action/main';
import { removeLoginInfo, getLocalToken, getLoginInfo, refreshLoginInfo } from '../../common/util';
import { buildMenu, openNotice } from '../../common/antdUtil';

/**
 * 工程总体主框架
 *
 * Auth：yujun Time：2016-04-22
 */
class Main extends React.Component {
  constructor(props) {
    super(props);
    const info = getLoginInfo();
    this.state = {
      checkInterval: null,
      info,
      ltk: getLocalToken(),
    };
  }

  // 组件构建完成时触发
  componentDidMount() {
    console.log('组件构建完成时触发, 检查是否登录');
    if (this.state.checkInterval === null) {
      this.state.checkInterval = setInterval(() => {
        if (this.state.ltk !== this.state.info.token) {
          refreshLoginInfo(this.state.ltk, true);
        }
      });
    }
    this.loadMenu();
    const { dispatch } = this.props;
    if (this.getMainState() !== null) {
      dispatch(clickMenuAction({
        keyPath: this.getMainState().updateBreadcrumbState.curPath[0] === '' ? ['HOME'] : this.getMainState().updateBreadcrumbState.curPath,
        key: this.getMainState().updateMenuState.curMenu,
      }));
    } else {
      dispatch(clickMenuAction({ keyPath: ['HOME'] }));
    }
    const info = getLoginInfo();
    if (info.isFirstLogin === 1) {
      openNotice('warning', '请及时修改初始密码', '提示');
    }
  }
  // 页面清除时，重置状态
  componentWillUnmount() {
    if (this.state.checkInterval !== null) {
      clearInterval(this.state.checkInterval);
      this.state.checkInterval = null;
    }
  }

  onToggle(item) {
    // 调用action中的动作修改组件状态
    const { dispatch } = this.props;
    dispatch(toggleMenuAction(item));
  }
  getMainState() {
    const appState = sessionStorage.getItem('appState');
    let state = null;
    if (appState !== null) {
      state = JSON.parse(appState).main;
    }
    return state;
  }
  loadMenu() {
    const { dispatch } = this.props;
    // action中发送ajax请求获取菜单数据
    dispatch(buildMenuAction({}));
  }
  doLogout() {
    const obj = this;
    const confirm = Modal.confirm;
    confirm({
      title: '退出',
      content: '确认要注销用户吗？',
      onOk() { obj.logout(1); },
    });
  }

  logout() {
    removeLoginInfo();
    this.context.router.replace('/login');
  }

  // 该方法在vdom中使用bind重新设置this指向Main组件
  handleMenuClick(item) {
    // 调用action中的动作修改组件状态
    const { dispatch } = this.props;
    dispatch(clickMenuAction(item));
  }
  handleLogoClick() {
    const { dispatch } = this.props;
    dispatch(clickMenuAction({ keyPath: ['HOME'] }));
  }

  handleMenuIconClick(e) {
    // 使用jquery实现菜单收缩效果
    const bool = parseInt(window.$('.td-layout-aside').css('left'), 10) === 0;
    if (bool) {
      window.$('.td-layout-aside').stop().animate({ left: -224 });
      window.$('.td-layout-container, .td-layout-copyright').stop().animate({ paddingLeft: 0 });
    } else {
      window.$('.td-layout-aside').stop().animate({ left: 0 });
      window.$('.td-layout-container, .td-layout-copyright').stop().animate({ paddingLeft: 224 });
    }
    e.preventDefault();
    e.stopPropagation();
  }


  render() {
    // const obj = this, confirm = Modal.confirm;
    // 获取注入的状态(面包屑,菜单)
    const { breadcrumbState, menuState } = this.props;
    const formatBreadcrumb = data => {
      let breadArray = [];
      if (data) {
        breadArray = data.concat();
      }
      return breadArray.reverse();
    };
    const loopBreadcrumb = data => data.map((item) => {
      return (
        <Breadcrumb.Item key={item}>
          {item}
        </Breadcrumb.Item>
      );
    });
    return (
      <div className="td-layout">
        <div className="td-layout-copyright">
          <div>
            <span>{appConf.copyright}</span>
          </div>
        </div>
        <div className="td-layout-container">
          <div className="td-layout-breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item>{appConf.app}</Breadcrumb.Item>
              {loopBreadcrumb(formatBreadcrumb(breadcrumbState.curPath))}
            </Breadcrumb>
          </div>
          <div className="td-layout-content">
            {this.props.children}
          </div>
        </div>
        <div className="td-layout-aside">
          <div className="td-layout-aside-user overflow-text">
            <a href="javascript:void(0)" title={getLoginInfo().userName}><span className="td-layout-aside-welcome">欢迎您：</span>{getLoginInfo().userName}</a>
          </div>
          <Menu mode="inline" style={{ borderRight: 0 }} theme="dark"
            selectedKeys={[menuState.curMenu]}
            onClick={this.handleMenuClick.bind(this)}
            onOpen={this.onToggle.bind(this)}
            onClose={this.onToggle.bind(this)}
            openKeys={menuState.openKeys}
            defaultOpenKeys={['DEMO']}
          >
            {menuState.menuData}
          </Menu>
        </div>
        <div className="td-layout-header">
          <Link to="main/home" onClick={this.handleLogoClick.bind(this)}><div className="td-layout-item-logo"></div></Link>
          <Icon type="info" />
          <Icon type="logout" className="td-layout-item td-layout-item-logout" onClick={this.doLogout.bind(this)} />
          <Icon type="bars" className="td-layout-item td-layout-item-menu" onClick={this.handleMenuIconClick.bind(this)} />
          <button id="hiddenLogoutBtn" style={{ display: 'none' }} onClick={this.logout.bind(this)}></button>
        </div>
      </div>
    );
  }
}

// 应用contextTypes(不做手工页面跳转则不需要)
Main.contextTypes = {
  router: PropTypes.object.isRequired,
};

// 当前状态(初始化时为reducer中定义的初始状态)
function mapStateToProps(state) {
  return {
    breadcrumbState: state.main.updateBreadcrumbState,
    menuState: state.main.updateMenuState,
  };
}
// 状态注入至组件Main的props中(初始化时为reducer中定义的初始状态)
export default connect(mapStateToProps)(Main);
