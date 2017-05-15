import React from 'react';
import { Button, Modal, Tooltip, Menu, Dropdown, Icon } from 'antd';
import TdCard from '../../component/TdCard';
import { openNotice, buildTableTip } from '../../common/antdUtil';
import { url } from '../../config/server';
import { rspInfo } from '../../common/authConstant';
import { callAjax, parseDate, getLoginInfo } from '../../common/util';
import { filterObject } from '../../common/util';
import TdPageTable from '../../component/TdPageTable';
import BugManageSearchForm from './BugManageSearchForm';
const confirm = Modal.confirm;
const ButtonGroup = Button.Group;

class BugManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      tdTableReload: false,
      tdTableParam: {},
      formReset: false,
      formData: {},
      tableSelectedRows: [],
      tableSelectedRowKeys: [],
      tableLoading: false,
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

  handlerRowSelect(selectedRowKeys, selectedRows) {
    this.setState({
      tableSelectedRows: selectedRows,
      tableSelectedRowKeys: selectedRowKeys,
    });
  }


  handleOperationClick(data) {
    this.setState({ data });
  }

  handleMenuClick(menu) {
    console.log(menu.key, this.state.data);
    if (this.state.data === undefined) {
      openNotice('error', '系统错误');
      return;
    }

    const opt = {
      url: url.bug.status,
      type: 'POST',
      data: {
        bugId: this.state.data.BUG_ID,
        status: menu.key,
      },
    };
    callAjax(opt, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        openNotice('success', result.rspInfo);
        this.setState({
          tdTableParam: this.state.tdTableParam,
          tdTableReload: true,
          tableSelectedRows: [],
        }, () => {
          this.setState({
            tdTableReload: false,
          });
        });
      } else {
        openNotice('error', result.rspInfo);
      }
    }, (rep, info, opt) => {
      openNotice('error', rspInfo.RSP_NETWORK_ERROR);
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

    const menu = (
      <Menu onClick={obj.handleMenuClick.bind(obj)}>
        <Menu.Item key="reset">
          <div>重置</div>
        </Menu.Item>
        <Menu.Item key="assigned">
          <div>认领</div>
        </Menu.Item>
        <Menu.Item key="solved">
          <div>解决</div>
        </Menu.Item>
        <Menu.Item key="closed">
          <div>关闭</div>
        </Menu.Item>
      </Menu>
    );

    const tableColumns = [
      {
        title: '操作', key: 'operation', width: 50, render: (text, record) => {
          return (
            <div className="overflow-text" style={{ width: '50' }} >
              <Dropdown overlay={menu} trigger={['click']}>
                <div onClick={() => obj.handleOperationClick(record)}>
                  <a className="ant-dropdown-link">
                    操作<Icon type="down" />
                  </a>
                </div>
              </Dropdown>
            </div>
          );
        },
      },
      { title: '项目名称', dataIndex: 'PRO_NAME', width: 200, render: (text) => buildTableTip(text, 200) },
      { title: '模块名称', dataIndex: 'MODULE_NAME', width: 200, render: (text) => buildTableTip(text, 200) },
      { title: 'BUG主题', dataIndex: 'BUG_TITLE', width: 200, render: (text) => buildTableTip(text, 200) },
      {
        title: 'BUG级别', dataIndex: 'BUG_LEVEL', width: 80, render: (text) => {
          return (
            <Tooltip placement="topLeft" title={text}>
              <div className="overflow-text" style={{ width: '80' }}><font color="#FF4500">{text}</font></div>
            </Tooltip>
          );
        },
      },
      { title: 'BUG描述', dataIndex: 'BUG_DES', width: 200, render: (text) => buildTableTip(text, 200) },
      {
        title: '状态', dataIndex: 'BUG_STATUS', width: 80, render: (text) => {
          return (
            <Tooltip placement="topLeft" title={text}>
              <div className="overflow-text" style={{ width: '80' }}>
                <font color="#00CD00">{text}</font>
              </div>
            </Tooltip>
          );
        },
      },
      { title: '经办人', dataIndex: 'HANDLE_BY', width: 100, render: (text) => buildTableTip(text, 100) },
      { title: '经办时间', dataIndex: 'HANDLE_TIME', width: 150, render: (text) => buildTableTip(text, 150) },
      { title: '创建人', dataIndex: 'CREATE_BY', width: 100, render: (text) => buildTableTip(text, 100) },
      { title: '创建时间', dataIndex: 'CREATE_TIME', width: 150, render: (text) => buildTableTip(text, 150) },
    ];
    // 渲染虚拟DOM
    return (
      <div>
        <TdCard hideHead="true" shadow="true">
          <BugManageSearchForm
            onSubmit={this.handleFormSubmit.bind(this)}
            onReset={this.handleFormReset.bind(this)}
          />
          <p className="br" />

          <TdPageTable
            rowKey={record => record.BUG_ID}
            rowSelectCallback={this.handlerRowSelect.bind(this)}
            url={url.bug.list}
            loadParam={this.state.tdTableParam}
            reload={this.state.tdTableReload}
            renderResult={this.renderTableList.bind(this)}
            columns={tableColumns}
            checkbox={false}
          />
        </TdCard>
      </div>
    );
  }
}

export default BugManage;
