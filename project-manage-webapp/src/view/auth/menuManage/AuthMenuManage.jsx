import React from 'react';
import { Row, Col, Tooltip, Form, Input, DatePicker, Select, Table, Button, Modal, Radio, Checkbox, Icon } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TdCard from '../../../component/TdCard';
import { openNotice, buildTableTip } from '../../../common/antdUtil';
import { tddefUrl } from '../../../config/server';
import { defaultPage } from '../../../common/authConstant';
import { rspInfo } from '../../../common/authConstant';
import { callAjax, parseDate} from '../../../common/util';
import { filterObject } from '../../../common/util';
import AuthMenuManageForm from './AuthMenuManageForm';
import TdPageTable from '../../../component/TdPageTable';
import AuthMenuForm from './AuthMenuForm';

const confirm = Modal.confirm;
/**
 * AuthMenuManage 菜单管理功能
 * Auth:  jiangdi  Tim: 2016-05-10
 */
class AuthMenuManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advSearchShow: false,
      tableLoading: false,
      tableData: [],
      tdTableReload: false,
      tdTableParam: {
        sysId: '009',
      },
      modalVisible: false,
      modelIsValid: false,
      modalOprType: 0,
      formReset: false,
      formData: {},
      tableSelectedRows: [],
      tableSelectedRowKeys: [],
      modalTitle: '菜单管理',
      confirmLoading: false,
    };
  }
  // 点击“详情”链接事件(text:该单元格数据 record:该行记录对象 key:该行KEY)
  handleDetailLinkClick(text, record) {
    this.state.formData = record;
    this.setState({
      modalVisible: !this.state.modalVisible,
      modalOprType: 3,
      modalTitle: '菜单详情',
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
  // 点击添加按钮弹出添加对话框
  handleAddBtnClick() {
    const tableSelectedRows = this.state.tableSelectedRows;
    if (tableSelectedRows !== undefined && tableSelectedRows.length === 1) {
      this.setState({
        formData: {
          parentItmId: tableSelectedRows[0].itmId,
          parentItmName: tableSelectedRows[0].itmName,
        },
        modalVisible: !this.state.modalVisible,
        modalOprType: 1,
        modalTitle: '添加菜单',
      }, () => {
        // 重置子组件表单数据
        this.setState({ formReset: true }, () => {
          // 将子组件表单重置标识置为false
          this.setState({
            formReset: false,
          });
        });
      });
    } else if (this.state.tableSelectedRows.length === 0) {
      openNotice('warning', '请选择需要添加的父级菜单');
    } else {
      openNotice('warning', '不允许选择多条父级菜单');
    }
  }
  // 添加对话框的确定按钮
  handleAddModalOk() {
    // 获取addUserForm表单数据
    const addFormData = filterObject(this.state.formData);
    const obj = this;
    const opt = {
      url: tddefUrl.authItem.addItem,
      data: addFormData,
    };
    // 请求后台添加菜单接口
    callAjax(opt, (result) => {
      if (result.rspCod === rspInfo.RSP_SUCCESS) {
        openNotice('success', '添加菜单成功', '提示');
        obj.props.form.resetFields();
        obj.setState({
          confirmLoading: false,
          modalVisible: !obj.state.modalVisible,
          modalOprType: 0,
          tdTableReload: true,
          tableSelectedRows: [],
          tableSelectedRowKeys: [],
        }, () => {
          obj.setState({
            tdTableReload: false,
          });
        });
      } else {
        openNotice('error', result.rspMsg, '添加菜单失败');
        obj.setState({
          confirmLoading: false,
        });
      }
    }, () => {
      openNotice('error', rspInfo.RSP_NETWORK_ERROR, '提示');
      obj.setState({
        confirmLoading: false,
      });
    });
  }
  // 编辑菜单按钮事件
  handlerEditBtnClick() {
    const tableSelectedRows = this.state.tableSelectedRows;
    if (tableSelectedRows !== undefined && tableSelectedRows.length === 1) {
      this.state.formData = tableSelectedRows[0];
      this.setState({
        modalVisible: !this.state.modalVisible,
        modalOprType: 2,
        modalTitle: '编辑菜单',
      }, () => {
        // 重置子组件表单数据
        this.setState({ formReset: true }, () => {
          // 将子组件表单重置标识置为false
          this.setState({
            formReset: false,
          });
        });
      });
    } else if (tableSelectedRows !== undefined && tableSelectedRows.length === 0) {
      openNotice('warning', '请选择需修改的记录');
    } else {
      openNotice('warning', '不允许修改多条记录');
    }
  }
  // 编辑菜单弹出框确定事件
  handlEditModalOk() {
    const editFormData = filterObject(this.state.formData);
    const opt = {
      url: tddefUrl.authItem.editItem,
      data: editFormData,
    };
    const obj = this;
    callAjax(opt, (result) => {
      if (result.rspCod === rspInfo.RSP_SUCCESS) {
        openNotice('success', '修改菜单成功', '提示');
        obj.props.form.resetFields();
        obj.setState({
          tdTableReload: true,
          confirmLoading: false,
          modalVisible: !obj.state.modalVisible,
          tableSelectedRows: [],
          tableSelectedRowKeys: [],
        }, () => {
          obj.setState({
            tdTableReload: false,
          });
        });
      } else {
        openNotice('error', result.rspMsg, '修改菜单失败');
        obj.setState({
          confirmLoading: false,
        });
      }
    }, () => {
      openNotice('error', rspInfo.RSP_NETWORK_ERROR, '提示');
      obj.setState({
        confirmLoading: false,
      });
    });
  }
  // 删除按钮点击事件
  handlerDeleteBtnClick() {
    const obj = this;
    if (this.state.tableSelectedRows.length === 1) {
      confirm({
        title: '您是否确认要删除选中项',
        content: '',
        onOk() {
          const data = obj.state.tableSelectedRows;
          let itmIds = '';
          data.forEach(v => (itmIds = itmIds + ',' + v.itmId + ''));
          const opt = {
            url: tddefUrl.authItem.deleteItem,
            data: { itmId: itmIds.substring(1, itmIds.length) },
          };
          callAjax(opt, (result) => {
            if (result.rspCod === rspInfo.RSP_SUCCESS) {
              openNotice('success', '删除菜单成功', '提示');
              obj.setState({
                tdTableReload: true,
                tableSelectedRows: [],
                tableSelectedRowKeys: [],
              }, () => {
                obj.setState({
                  tdTableReload: false,
                });
              });
            } else {
              openNotice('error', result.rspMsg, '删除菜单失败');
            }
          }, () => {
            openNotice('error', rspInfo.RSP_NETWORK_ERROR, '提示');
          });
        },
      });
    } else if (this.state.tableSelectedRows.length > 1) {
      openNotice('warning', '不允许同时删除多条记录');
    } else {
      openNotice('warning', '请选择需删除的记录');
    }
  }
  // 启用按钮点击事件
  handlerEnableBtnClick() {
    if (this.state.tableSelectedRows.length === 1) {
      this.handlerRecordSts('enable');
    } else if (this.state.tableSelectedRows.length > 1) {
      openNotice('warning', '不允许同时启用多条记录');
    } else {
      openNotice('warning', '请选择需启用的记录');
    }
  }
  // 禁用按钮点击事件
  handlerDisableBtnClick() {
    if (this.state.tableSelectedRows.length === 1) {
      this.handlerRecordSts('disable');
    } else if (this.state.tableSelectedRows.length > 1) {
      openNotice('warning', '不允许同时禁用多条记录');
    } else {
      openNotice('warning', '请选择需禁用的记录');
    }
  }
  handlerRecordSts(param) {
    const obj = this;
    const data = obj.state.tableSelectedRows;
    const row = obj.state.tableSelectedRows[0];
    if (param === 'enable' && row.isUse === '1') {
      openNotice('warning', '菜单状态已启用，无需操作', '提示');
      return;
    }
    if (param === 'disable' && row.isUse === '0') {
      openNotice('warning', '菜单状态已禁用，无需操作', '提示');
      return;
    }
    let itmIds = '';
    data.forEach(v => (itmIds = itmIds + ',' + v.itmId + ''));
    confirm({
      title: '您是否确认要' + (param === 'enable' ? '启用' : '禁用') + '选中项',
      content: '',
      onOk() {
        const opt = {
          url: tddefUrl.authItem.enableItem,
          data: { isUse: (param === 'enable' ? '1' : '0'), itmId: itmIds.substring(1, itmIds.length) }
        };
        callAjax(opt, (result) => {
          if (result.rspCod === rspInfo.RSP_SUCCESS) {
            openNotice('success', (param === 'enable' ? '启用' : '禁用') + '菜单成功', '提示');
            obj.setState({
              tdTableReload: true,
              tableSelectedRows: [],
              tableSelectedRowKeys: [],
            }, () => {
              obj.setState({ tdTableReload: false });
            });
          } else {
            openNotice('error', result.rspMsg, (param === 'enable' ? '启用' : '禁用') + '菜单失败');
          }
        }, () => {
          openNotice('error', rspInfo.RSP_NETWORK_ERROR, '提示');
        });
      },
    });
  }
  handleFormSubmit(dat) {
    this.setState({ tdTableReload: true, tdTableParam: dat ,tableSelectedRows: []}, () => {
      this.setState({ tdTableReload: false });
    });
  }
  handleFormReset() {
    this.setState({ formData: {} });
  }
  // 模态框确认点击事件，修改子页面props valid状态,触发子页面执行回调
  handleModalOk() {
    this.setState({
      modelIsValid: true,
    });
  }
  // 模态框子页面回调
  callbackValid(oprType, errors, data) {
    this.setState({
      modelIsValid: false,
    });
    const obj = this;
    if (!!errors) {
      // return;
    } else {
      this.setState({
        formData: Object.assign({}, this.state.formData, data),
        formReset: false,
        confirmLoading: true,
      }, () => {
        switch (oprType) {
          case 1:
            obj.handleAddModalOk();
            break;
          case 2:
            obj.handlEditModalOk();
            break;
          default:
            openNotice('error', '操作失败');
            break;
        }
      });
    }
  }
  handlerRowSelect(selectedRowKeys, selectedRows) {
    this.setState({
      tableSelectedRows: selectedRows,
      tableSelectedRowKeys: selectedRowKeys,
    });
  }
  renderTableList(result) {
    return {
      total: result.rspData.total,
      list: result.rspData.list,
    };
  }
  render() {
    // 定义变量和参数
    const obj = this;
    const modalIsDetail = {
      footer: '',
    };
    const tableColumns = [
      { title: '分级',  width: 100},
      { title: '上级菜单', dataIndex: 'parentItmId', width: 100,  render: (text) => buildTableTip(text, 100) },
      { title: '类型', dataIndex: 'itmTyp', width: 80, render: (text) => (text === '1' ? '菜单' : '按钮') },
      { title: '所属系统', dataIndex: 'sysName', width: 150 },
      { title: '菜单名称', dataIndex: 'itmName', width: 90, render: (text) => buildTableTip(text, 90) },
      { title: '菜单描述', dataIndex: 'itmDesc', width: 100, render: (text) => buildTableTip(text, 100) },
      { title: '菜单路径', dataIndex: 'itmUrl', width: 150, render: (text) => buildTableTip(text, 150) },
      { title: '状态', dataIndex: 'isUse', width: 80, render: (text) => (text === '1' ? '启用' : '禁用') },
      { title: '创建人', dataIndex: 'creObj', width: 80,render: (text) => buildTableTip(text, 80) },
      { title: '创建时间', dataIndex: 'creTim', width: 150, render: (text) => buildTableTip(parseDate(text), 150) },
      // 以下click事件中不能使用this
      {
        title: '操作', key: 'operation', width: 80,fixed:'right', render(text, record, key) {
          return (
            <span>
              <a href='javascript:void(0)' onClick={() => { obj.handleDetailLinkClick(text, record, key); } }>详情</a>
            </span>
          );
        },
      },
    ];
    const toolbar = [
      { icon: 'plus', text: '新增', click: () => { obj.handleAddBtnClick(); } },
      { icon: 'edit', text: '修改', click: () => { obj.handlerEditBtnClick(); } },
      { icon: 'cross', text: '删除', click: () => { obj.handlerDeleteBtnClick(); } },
      { icon: 'check', text: '启用', click: () => { obj.handlerEnableBtnClick(); } },
      { icon: 'minus', text: '禁用', click: () => { obj.handlerDisableBtnClick(); } },
    ];
    // 渲染虚拟DOM
    return (
      <div>
        <TdCard hideHead='true' shadow='true'>
          <AuthMenuManageForm onSubmit={this.handleFormSubmit.bind(this) } onReset={this.handleFormReset.bind(this) } />
          <p className='br' />
          <TdPageTable rowKey={record => record.itmId}
            rowSelectCallback={this.handlerRowSelect.bind(this) } scroll={{ x: 1200 }}
            url={tddefUrl.authItem.queryItemList} pagination={false} toolbar={toolbar}
            loadParam={this.state.tdTableParam} reload={this.state.tdTableReload}
            renderResult={this.renderTableList} columns={tableColumns}
          />
          <Modal title={this.state.modalTitle} visible={this.state.modalVisible}
            confirmLoading={this.state.confirmLoading}
            onCancel={() => { this.setState({ modalVisible: false }); } }
            onOk={this.handleModalOk.bind(this) }
            {...(this.state.modalOprType === 3 ? modalIsDetail : null) }
          >
            <AuthMenuForm formReset={this.state.formReset}
              valid={this.state.modelIsValid}
              formData={this.state.formData}
              oprType={this.state.modalOprType}
              validCallback={(oprType, errors, data) => {
                this.callbackValid(oprType, errors, data);
              } }
            />
          </Modal>
        </TdCard>
      </div>
    );
  }
}
// 必须有create包装,才会带this.props.form属性
AuthMenuManage = Form.create()(AuthMenuManage);
export default AuthMenuManage;
