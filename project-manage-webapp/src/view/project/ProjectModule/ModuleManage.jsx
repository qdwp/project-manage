import React from 'react';
import { Button, Modal, Table, Icon, Transfer, Form } from 'antd';
import QueueAnim from 'rc-queue-anim';
import TdCard from '../../../component/TdCard';
import { openNotice, buildTableTip } from '../../../common/antdUtil';
import { url } from '../../../config/server';
import { rspInfo } from '../../../common/authConstant';
import { callAjax, parseDate, getLoginInfo } from '../../../common/util';
import { filterObject } from '../../../common/util';
import TdPageTable from '../../../component/TdPageTable';
import ModuleManageSearchForm from './ModuleManageSearchForm';
const confirm = Modal.confirm;
const ButtonGroup = Button.Group;

class ModuleManage extends React.Component {
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
      const modId = this.state.tableSelectedRowKeys[0];
      const obj = this;
      confirm({
        title: '删除',
        content: '您是否确认要删除所选任务模块 ?',
        onOk() {
          const opt = {
            url: url.task.delete,
            type: 'POST',
            data: { modId },
          };
          callAjax(opt, (result) => {
            if (result.rspCode === rspInfo.RSP_SUCCESS) {
              openNotice('success', '删除任务模块成功');
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
              openNotice('error', result.rspInfo);
            }
          }, (rep, info, opt) => {
            openNotice('error', rspInfo.RSP_NETWORK_ERROR);
          });
        },
        onCancel() { },
      });
    } else {
      openNotice('warning', '请选择要删除的用户记录');
    }
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
      { title: '项目名称', dataIndex: 'PRO_NAME', width: 200, render: (text) => buildTableTip(text, 200) },
      { title: '模块名称', dataIndex: 'MODULE_NAME', width: 200, render: (text) => buildTableTip(text, 200) },
      { title: '负责成员', dataIndex: 'USER_NAME', width: 120, render: (text) => buildTableTip(text, 120) },
      { title: '模块描述', dataIndex: 'MODULE_DES', width: 200, render: (text) => buildTableTip(text, 200) },
      { title: '开始时间', dataIndex: 'MODULE_START', width: 150, render: (text) => buildTableTip(text, 150) },
      { title: '结束时间', dataIndex: 'MODULE_END', width: 150, render: (text) => buildTableTip(text, 150) },
    ];
    const toolbar = [
      { icon: 'delete', text: '删除', click: () => { obj.handlerDeleteBtnClick(); } },
    ];
    // 渲染虚拟DOM
    return (
      <div>
        <TdCard hideHead="true" shadow="true">
          <ModuleManageSearchForm
            onSubmit={this.handleFormSubmit.bind(this)}
            onReset={this.handleFormReset.bind(this)}
          />
          <p className="br" />

          <TdPageTable
            rowKey={record => record.MODULE_ID}
            rowSelectCallback={this.handlerRowSelect.bind(this)}
            toolbar={toolbar}
            url={url.task.list}
            loadParam={this.state.tdTableParam}
            reload={this.state.tdTableReload}
            renderResult={this.renderTableList.bind(this)}
            columns={tableColumns}
          />
        </TdCard>
      </div>
    );
  }
}

export default ModuleManage;
