import React from 'react';
import { Button, Modal, Table, Icon, Transfer, Form } from 'antd';
import { openNotice, buildTableTip } from '../../../common/antdUtil';
import { url } from '../../../config/server';
import { rspInfo } from '../../../common/authConstant';
import { callAjax, getLoginInfo } from '../../../common/util';
import TdPageTable from '../../../component/TdPageTable';
import ProjectMemberInfoSearch from './ProjectMemberInfoSearch';

const confirm = Modal.confirm;

class ProjectMemberInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tdTableReload: false,
      tdTableParam: {},
      formReset: false,
      project: '',
      call: false,
      tableSelectedRows: [],
      tableSelectedRowKeys: [],
      confirmLoading: false,
      tableLoading: false,
    };
  }

  componentWillMount() {
    const { project } = this.props;
    this.setState({
      tdTableParam: { proId: project },
    });
  }

  // 父页面通过修改props 中属性的值触发该方法
  componentWillReceiveProps(nextProps) {
    this.setState({
      tdTableParam: { proId: nextProps.project },
    });
    // 更新表单数据
    if (nextProps.call === true && this.state.call === false) {
      this.setState({
        call: true,
        tdTableReload: true,
        project: nextProps.project,
      }, () => {
        this.setState({
          call: false,
          tdTableReload: false,
        });
      });
    }
    // 重置表单
    if (nextProps.formReset === true) {
      this.setState({
        formReset: true,
      }, () => {
        this.setState({
          formReset: false,
        });
      });
    }
  }

  handleFormSubmit(data) {
    console.log('handleFormSubmit', data);
    this.setState({
      tdTableReload: true,
      tdTableParam: Object.assign({}, this.state.tdTableParam, data),
      tableSelectedRows: [],
    }, () => {
      this.setState({
        tdTableReload: false,
      });
    });
    console.log(this.state.tdTableParam);
  }

  handleFormReset() {
    this.setState({
      tdTableParam: { userCreator: getLoginInfo().userId, proId: this.props.project },
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

  handleRemoveClick(text, record, key) {
    const obj = this;
    confirm({
      title: '您是否确认要从项目中移除该成员 ?',
      content: '',
      onOk() {
        const opt = {
          url: url.project.userRemove,
          type: 'POST',
          data: { proId: record.PRO_ID, userId: record.USER_ID },
        };
        callAjax(opt, (result) => {
          if (result.rspCode === rspInfo.RSP_SUCCESS) {
            openNotice('success', '移除成员记录成功', '提示');
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
            openNotice('error', result.rspInfo, '提示');
          }
        }, (rep, info, o) => {
          openNotice('error', rspInfo.RSP_NETWORK_ERROR, '提示');
        });
      },
      onCancel() { },
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
      { title: '登录用户', dataIndex: 'USER_ID', width: 180 },
      { title: '用户姓名', dataIndex: 'USER_NAME', width: 180 },
      {
        title: '操作', key: 'operation', width: 50, render(text, record, key) {
          return (
            <span>
              <a href='javascript:void(0)' onClick={() => { obj.handleRemoveClick(text, record, key); } }>移除</a>
            </span>
          );
        },
      },
      { title: '负责模块', dataIndex: 'MODULE_NAME', width: 250, render: (text) => buildTableTip(text, 250) },
    ];
    // 渲染虚拟DOM
    return (
      <div>
        <ProjectMemberInfoSearch
          formReset={this.state.formReset}
          onSubmit={this.handleFormSubmit.bind(this)}
          onReset={this.handleFormReset.bind(this)}
        />
        <p className="br" />

        <TdPageTable rowKey={record => record.USER_ID}
          checkbox={false} scroll={{ x: 780 }}
          rowSelectCallback={this.handlerRowSelect.bind(this)}
          url={url.project.userInfo}
          loadParam={this.state.tdTableParam}
          reload={this.state.tdTableReload}
          renderResult={this.renderTableList.bind(this)}
          columns={tableColumns}
        />
      </div>
    );
  }
}

const noop = () => { };
// 定义组件标签的可配置属性
ProjectMemberInfo.defaultProps = {
  call: false,
  onOk: noop,
  onNo: noop,
};

export default ProjectMemberInfo;
