import React from 'react';
import TdCard from '../../../component/TdCard';
import { openNotice, buildTableTip } from '../../../common/antdUtil';
import { url } from '../../../config/server';
import { rspInfo } from '../../../common/authConstant';
import TdPageTable from '../../../component/TdPageTable';
import ProjectManageSearchForm from '../projectManage/ProjectManageSearchForm';

class ProjectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tdTableReload: false,
      tdTableParam: {},
      formReset: false,
      formData: {},
      confirmLoading: false,
      tableLoading: false,
      project: '',
      proName: '',
      projectName: '',
      call: false,
    };
  }

  handleFormSubmit(data) {
    console.log(data);
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

  handlerRowClick(record, index) {
    console.log(record, index);
    const { validCallback } = this.props;
    validCallback(true, record);
  }

  renderTableList(result) {
    console.log(result);
    if (result.rspCode === rspInfo.RSP_SUCCESS) {
      return { list: result.rspData.list, total: result.rspData.total };
    }
    return {};
  }

  render() {
    // 定义变量和参数
    const tableColumns = [
      { title: '项目编号', dataIndex: 'PRO_ID', width: 200, render: (text) => buildTableTip(text, 180) },
      { title: '项目名称', dataIndex: 'PRO_NAME', width: 200, render: (text) => buildTableTip(text, 200) },
      { title: '项目类型', dataIndex: 'TYPE_TEXT', width: 150, render: (text) => buildTableTip(text, 150) },
      { title: '项目描述', dataIndex: 'PRO_DES', width: 180, render: (text) => buildTableTip(text, 180) },
      { title: '项目组长', dataIndex: 'PRO_LEADER', width: 120, render: (text) => buildTableTip(text, 120) },
      { title: '创建时间', dataIndex: 'PRO_CRE_TIME', width: 180, render: (text) => buildTableTip(text, 180) },
    ];
    // 渲染虚拟DOM
    return (
      <div>
          <ProjectManageSearchForm
            onSubmit={this.handleFormSubmit.bind(this)}
            onReset={this.handleFormReset.bind(this)}
          />
          <p className="br" />

          <TdPageTable rowKey={record => record.PRO_ID} scroll={{ x: true }} checkbox={ false }
            rowClickCallback={this.handlerRowClick.bind(this)}
            url={url.project.list}
            loadParam={this.state.tdTableParam}
            reload={this.state.tdTableReload}
            renderResult={this.renderTableList.bind(this)}
            columns={tableColumns}
          />
      </div>
    );
  }
}

export default ProjectModal;
