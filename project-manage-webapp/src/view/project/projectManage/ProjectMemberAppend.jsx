import React from 'react';
import { Button, Modal, Table, Icon, Transfer, Form } from 'antd';
import { openNotice, buildTableTip } from '../../../common/antdUtil';
import { url } from '../../../config/server';
import { rspInfo } from '../../../common/authConstant';
import { getLoginInfo } from '../../../common/util';
import TdPageTable from '../../../component/TdPageTable';
import ProjectMemberAppendSearch from './ProjectMemberAppendSearch';

class ProjectMemberAppend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tdTableReload: false,
      tdTableParam: { userCreator: getLoginInfo().userId },
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
      tdTableParam: { userCreator: getLoginInfo().userId, proId: project },
    });
  }

  // 父页面通过修改props 中属性的值触发该方法
  componentWillReceiveProps(nextProps) {
    this.setState({
      tdTableParam: { userCreator: getLoginInfo().userId, proId: nextProps.project },
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
    this.setState({
      tdTableReload: true,
      tdTableParam: Object.assign({}, this.state.tdTableParam, data),
      tableSelectedRows: [],
    }, () => {
      this.setState({
        tdTableReload: false,
      });
    });
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

  renderTableList(result) {
    if (result.rspCode === rspInfo.RSP_SUCCESS) {
      return { list: result.rspData.list, total: result.rspData.total };
    }
    return {};
  }

  render() {
    // 定义变量和参数
    const obj = this;
    const { onOk, onNo } = this.props;
    const tableColumns = [
      { title: '登录用户', dataIndex: 'USER_ID', width: 180 },
      { title: '用户姓名', dataIndex: 'USER_NAME', width: 180 },
      {
        title: '是否启用', dataIndex: 'USER_LOGIN', width: 120, render: (text) => {
          return (
            <span>
              {text === '0' ? '禁用' : '启用'}
            </span>
          );
        },
      },
    ];
    // 渲染虚拟DOM
    return (
      <div>
        <ProjectMemberAppendSearch
          formReset={this.state.formReset}
          onSubmit={this.handleFormSubmit.bind(this)}
          onReset={this.handleFormReset.bind(this)}
        />
        <p className="br" />

        <TdPageTable rowKey={record => record.USER_ID}
          rowSelectCallback={this.handlerRowSelect.bind(this)}
          url={url.project.userList}
          loadParam={this.state.tdTableParam}
          reload={this.state.tdTableReload}
          renderResult={this.renderTableList.bind(this)}
          columns={tableColumns}
        />

        <p className="br" />

        <div style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: '10px' }} size="large"
            onClick={() => {
              onNo();
            }}
          >取消</Button>
          <Button htmlType='submit' type='primary' size="large"
            onClick={() => {
              onOk(obj.state.tableSelectedRowKeys, obj.state.tableSelectedRows);
            }}
          ><Icon type="plus" />添加</Button>
        </div>
      </div>
    );
  }
}

const noop = () => { };
// 定义组件标签的可配置属性
ProjectMemberAppend.defaultProps = {
  call: false,
  onOk: noop,
  onNo: noop,
};

export default ProjectMemberAppend;
