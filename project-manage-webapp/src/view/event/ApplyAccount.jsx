import React from 'react';
import { Icon, Modal, Popconfirm } from 'antd';
import TdCard from '../../component/TdCard';
import { openNotice, buildTableTip } from '../../common/antdUtil';
import { url } from '../../config/server';
import { rspInfo } from '../../common/authConstant';
import { callAjax, getLoginInfo } from '../../common/util';
import { filterObject } from '../../common/util';
import TdPageTable from '../../component/TdPageTable';
import ApplyAccountSearchForm from './ApplyAccountSearchForm';
const confirm = Modal.confirm;

class ApplyAccount extends React.Component {
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

  handleOperationClick(record) {
    console.log(record);
    if (record === undefined) {
      openNotice('error', '系统错误');
      return;
    }
    const opt = {
      url: url.user.handle,
      type: 'POST',
      data: {
        userId: record.USER_ID,
        userName: record.USER_NAME,
        userPwd: record.USER_PWD,
      },
    };
    console.log(opt);
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
    const tableColumns = [
      { title: '用户账号', dataIndex: 'USER_ID', width: 200, render: (text) => buildTableTip(text, 200) },
      { title: '用户姓名', dataIndex: 'USER_NAME', width: 200, render: (text) => buildTableTip(text, 200) },
      {
        title: '用户权限', dataIndex: 'USER_AUTH', width: 150, render: (text) => {
          return (
            <div className="overflow-text" style={{ width: '150' }} >
              <span>项目组长</span>
            </div>
          );
        },
      },
      { title: '申请时间', dataIndex: 'APPLY_TIME', width: 150, render: (text) => buildTableTip(text, 150) },
      {
        title: '操作', key: 'operation', width: 100, render: (text, record) => {
          return (
            <div className="overflow-text" style={{ width: '100' }} >
                <Popconfirm title="确定要通过该用户申请吗？"
                  onConfirm={() => obj.handleOperationClick(record)}
                ><a className="ant-dropdown-link">
                    通过审核 <Icon type="filter" />
                  </a>
                </Popconfirm>
            </div>
          );
        },
      },
    ];
    // 渲染虚拟DOM
    return (
      <div>
        <TdCard hideHead="true" shadow="true">
          <ApplyAccountSearchForm
            onSubmit={this.handleFormSubmit.bind(this)}
            onReset={this.handleFormReset.bind(this)}
          />
          <p className="br" />

          <TdPageTable rowKey={record => record.USER_ID}
            url={url.user.event}
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

export default ApplyAccount;
