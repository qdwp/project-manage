import React from 'react';
import { Button, Modal } from 'antd';
import TdCard from '../../component/TdCard';
import { openNotice, buildTableTip } from '../../common/antdUtil';
import { url } from '../../config/server';
import { rspInfo } from '../../common/authConstant';
import { callAjax, getLoginInfo } from '../../common/util';
import { filterObject } from '../../common/util';
import TdPageTable from '../../component/TdPageTable';
import UserManageSearchForm from './UserManageSearchForm';
import UserManageEditForm from './UserManageEditForm';
const confirm = Modal.confirm;

class UserManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalTitle: '',
      tdTableReload: false,
      tdTableParam: {},
      formReset: false,
      formData: {},
      tableSelectedRows: [],
      tableSelectedRowKeys: [],
      confirmLoading: false,
      tableLoading: false,
      editType: '1',
    };
  }

  handleFormSubmit(data) {
    this.setState({
      tdTableReload: true,
      tdTableParam: data,
      tableSelectedRows: [],
    }, () => {
      this.setState({
        tdTableReload: false,
      });
    });
  }

  handleFormReset() {
    this.setState({
      tableSelectedRows: [],
      tableSelectedRowKeys: [],
    });
  }

  // 添加用户
  handleAddBtnClick() {
    this.setState({
      formData: {},
      modalVisible: true,
      modalTitle: '添加新用户',
      editType: '1',
    }, () => {
      // 重置子组件表单数据
      this.setState({ formReset: true }, () => {
        // 将子组件表单重置标识置为false
        this.setState({
          formReset: false,
        });
      });
    });
  }

  // 修改项目信息
  handlerEditBtnClick() {
    if (this.state.tableSelectedRows.length === 1) {
      // const info = getLoginInfo();
      // if (info.userId === this.state.tableSelectedRowKeys[0]) {
      //   openNotice('warning', '不能修改当前用户', '提示');
      //   return;
      // }
      this.setState({
        formData: this.state.tableSelectedRows[0],
        modalVisible: true,
        modalTitle: '修改用户信息',
        editType: '2',
      }, () => {
        // 重置子组件表单数据
        this.setState({ formReset: true }, () => {
          // 将子组件表单重置标识置为false
          this.setState({
            formReset: false,
          });
        });
      });
    } else if (this.state.tableSelectedRows.length > 1) {
      openNotice('warning', '不能同时选择多条用户记录', '提示');
      // console.log('删除数据', this.state.tableSelectedRowKeys, this.state.tableSelectedRows);
    } else {
      openNotice('warning', '请选择要修改的用户记录', '提示');
    }
  }

  handlerRowSelect(selectedRowKeys, selectedRows) {
    this.setState({
      tableSelectedRows: selectedRows,
      tableSelectedRowKeys: selectedRowKeys,
    });
  }

  // 删除用户
  handlerDeleteBtnClick() {
    if (this.state.tableSelectedRows.length > 1) {
      openNotice('warning', '不允许同时删除多个用户');
      return;
    } else if (this.state.tableSelectedRows.length > 0) {
      const userId = this.state.tableSelectedRowKeys[0];
      if (userId === getLoginInfo().userId) {
        openNotice('warning', '不允许删除自身账户');
        return;
      }
      const obj = this;
      confirm({
        title: '删除',
        content: `您是否确认要删除用户 ${userId} ?`,
        onOk() {
          const opt = {
            url: url.user.delete,
            type: 'POST',
            data: { userId },
          };
          callAjax(opt, (result) => {
            if (result.rspCode === rspInfo.RSP_SUCCESS) {
              openNotice('success', '删除用户成功', '提示');
              // 重新加载table数据
              obj.setState({
                tdTableReload: true,
                tableSelectedRowKeys: [],
                tableSelectedRows: [],
              }, () => {
                obj.setState({
                  tdTableReload: false,
                });
              });
            } else {
              openNotice('error', result.rspInfo, '删除用户成功');
            }
          }, (rep, info, opt) => {
            openNotice('error', rspInfo.RSP_NETWORK_ERROR, '提示');
          });
        },
        onCancel() { },
      });
    } else {
      openNotice('warning', '请选择要删除的用户记录', '提示');
    }
  }

  // 重置密码
  handleRestPwdLinkClick() {
    if (this.state.tableSelectedRows.length > 0) {
      // console.log('重置密码', this.state.tableSelectedRowKeys, this.state.tableSelectedRows);
      const userId = this.state.tableSelectedRowKeys[0];
      const obj = this;
      confirm({
        title: '重置',
        content: `您是否确认要重置用户 ${userId} 的密码 ?`,
        onOk() {
          const opt = {
            url: url.user.reset,
            type: 'POST',
            data: { userId },
          };
          callAjax(opt, (result) => {
            if (result.rspCode === rspInfo.RSP_SUCCESS) {
              openNotice('success', '重置密码成功', '提示');
              // 重新加载table数据
              obj.setState({
                tdTableReload: true,
                tableSelectedRowKeys: [],
                tableSelectedRows: [],
              }, () => {
                obj.setState({
                  tdTableReload: false,
                });
              });
            } else {
              openNotice('error', result.rspInfo, '重置密码成功');
            }
          }, (rep, info, opt) => {
            openNotice('error', rspInfo.RSP_NETWORK_ERROR, '提示');
          });
        },
        onCancel() { },
      });
    } else {
      openNotice('warning', '请选择要删除的用户记录', '提示');
    }
  }

  // 模态框确认点击事件，修改子页面props valid状态,触发子页面执行回调
  handleModalOk() {
    this.setState({
      modelIsValid: true,
    }, () => {
      this.setState({ modelIsValid: false });
    });
  }

  // 模态框子页面回调
  callbackValid(editType, errors, data) {
    console.log('callbackValid', data);
    this.setState({
      modelIsValid: false,
    });
    const obj = this;
    if (!!errors) {
      console.log('填写信息有误');
    } else {
      this.setState({
        // formData: Object.assign({}, this.state.formData, data),
        formData: data,
        formReset: false,
        confirmLoading: true,
      }, () => {
        switch (editType) {
          case '1':
            obj.handleAddModalOk();
            break;
          case '2':
            obj.handlEditModalOk();
            break;
          default:
            openNotice('error', '操作失败');
            break;
        }
      });
    }
  }


  // 添加对话框的确定按钮
  handleAddModalOk() {
    // 获取addUserForm表单数据
    const formData = filterObject(this.state.formData);
    formData.userCreator = getLoginInfo().userId;
    const opt = {
      url: url.user.add,
      data: formData,
    };
    const obj = this;
    // 请求后台添加用户接口
    callAjax(opt, (result) => {
      console.log(result);
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        openNotice('success', '添加用户成功,初始密码为 111111', '提示');
        // obj.props.form.resetFields();
        obj.setState({
          confirmLoading: false,
          modalVisible: !obj.state.modalVisible,
          editType: 0,
          tdTableReload: true,
          tableSelectedRowKeys: [],
          tableSelectedRows: [],
        }, () => {
          obj.setState({
            tdTableReload: false,
          });
        });
      } else {
        openNotice('error', result.rspInfo, '提示');
        obj.setState({
          confirmLoading: false,
        });
      }
    }, (req, info, opt) => {
      openNotice('error', rspInfo.RSP_NETWORK_ERROR, '提示');
      obj.setState({
        confirmLoading: false,
      });
    });
  }
  /**
   * 编辑用户弹出框确定事件
   */
  handlEditModalOk() {
    const formData = filterObject(this.state.formData);
    const opt = {
      url: url.user.update,
      data: formData,
    };
    const obj = this;
    callAjax(opt, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        openNotice('success', '更新用户信息成功', '提示');
        // obj.props.form.resetFields();
        obj.setState({
          confirmLoading: false,
          modalVisible: !obj.state.modalVisible,
          modalOprType: 0,
          tdTableReload: true,
          tableSelectedRowKeys: [],
          tableSelectedRows: [],
        }, () => {
          obj.setState({
            tdTableReload: false,
          });
        });
      } else {
        openNotice('error', result.rspInfo, '修改用户失败');
        obj.setState({
          confirmLoading: false,
        });
      }
    }, (req, info, opt) => {
      openNotice('error', rspInfo.RSP_NETWORK_ERROR, '提示');
      obj.setState({
        confirmLoading: false,
      });
    });
  }
  renderTableList(result) {
    if (result.rspCode === rspInfo.RSP_SUCCESS) {
      return { list: result.rspData.list, total: result.rspData.total };
    }
    return {};
  }

  render() {
    // 定义变量和参数
    const obj = this;
    const tableColumns = [
      { title: '用户账号', dataIndex: 'USER_ID', width: 180, render: (text) => buildTableTip(text, 180) },
      { title: '用户姓名', dataIndex: 'USER_NAME', width: 180 },
      {
        title: '用户权限', dataIndex: 'USER_AUTH', width: 150, render: (text) => {
          return (
            <span>
              {text === '0' ? '管理员' : text === '1' ? '项目组长' : '项目成员'}
            </span>
          );
        },
      },
      {
        title: '用户状态', dataIndex: 'USER_LOGIN', width: 100, render: (text) => {
          return (
            <span>
              {text === '0' ? <font color="#FF4500">禁用</font> : <font color="#00CD00">启用</font>}
            </span>
          );
        },
      },
      { title: '创建人', dataIndex: 'USER_CREATOR', width: 150, render: (text) => buildTableTip(text, 150) },
      { title: '创建时间', dataIndex: 'USER_CRE_TIME', width: 150, render: (text) => buildTableTip(text, 150) },
    ];
    const toolbar = [
      { icon: 'plus', text: '新增', click: () => { obj.handleAddBtnClick(); } },
      { icon: 'edit', text: '修改', click: () => { obj.handlerEditBtnClick(); } },
      { icon: 'delete', text: '删除', click: () => { obj.handlerDeleteBtnClick(); } },
      { icon: 'notification', text: '重置密码', click: () => { obj.handleRestPwdLinkClick(); } },
    ];
    // 渲染虚拟DOM
    return (
      <div>
        <TdCard hideHead="true" shadow="true">
          <UserManageSearchForm
            onSubmit={this.handleFormSubmit.bind(this)}
            onReset={this.handleFormReset.bind(this)}
          />
          <p className="br" />

          <TdPageTable rowKey={record => record.USER_ID}
            rowSelectCallback={this.handlerRowSelect.bind(this)}
            toolbar={toolbar}
            url={url.user.list}
            loadParam={this.state.tdTableParam}
            reload={this.state.tdTableReload}
            renderResult={this.renderTableList.bind(this)}
            columns={tableColumns}
          />
          <Modal title={this.state.modalTitle} visible={this.state.modalVisible}
            confirmLoading={this.state.confirmLoading}
            onCancel={() => { this.setState({ modalVisible: false }); } }
            onOk={this.handleModalOk.bind(this)}
          >
            <UserManageEditForm formReset={this.state.formReset}
              editType={this.state.editType}
              valid={this.state.modelIsValid}
              formData={this.state.formData}
              validCallback={(editType, errors, data) => {
                this.callbackValid(editType, errors, data);
              } }
            />
          </Modal>
        </TdCard>
      </div>
    );
  }
}

export default UserManage;
