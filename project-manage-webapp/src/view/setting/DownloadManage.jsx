import React from 'react';
import { Button, Modal } from 'antd';
import TdCard from '../../component/TdCard';
import { openNotice, buildTableTip } from '../../common/antdUtil';
import { url } from '../../config/server';
import { rspInfo } from '../../common/authConstant';
import { callAjax, getLoginInfo } from '../../common/util';
import { filterObject } from '../../common/util';
import TdPageTable from '../../component/TdPageTable';
import DownloadManageSearchForm from './DownloadManageSearchForm';
const confirm = Modal.confirm;

class DownloadManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  handlerRowSelect(selectedRowKeys, selectedRows) {
    this.setState({
      tableSelectedRows: selectedRows,
      tableSelectedRowKeys: selectedRowKeys,
    });
  }

  // 删除用户
  handlerDeleteBtnClick() {
    if (this.state.tableSelectedRows.length > 1) {
      openNotice('warning', '不允许同时删除多个文件');
    } else if (this.state.tableSelectedRows.length > 0) {
      const obj = this;
      confirm({
        title: '删除',
        content: '您是否确认要删除所选中文件 ?',
        onOk() {
          const opt = {
            url: url.setting.delete,
            type: 'POST',
            data: {
              fileId: obj.state.tableSelectedRowKeys[0],
              fileName: obj.state.tableSelectedRows[0].FILE_NAME,
            },
          };
          callAjax(opt, (result) => {
            if (result.rspCode === rspInfo.RSP_SUCCESS) {
              openNotice('success', '删除文件成功');
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
              openNotice('error', result.rspInfo, '删除文件失败');
            }
          }, (rep, info, opt) => {
            openNotice('error', rspInfo.RSP_NETWORK_ERROR);
          });
        },
        onCancel() { },
      });
    } else {
      openNotice('warning', '请选择要删除的文件记录');
    }
  }

  // 点击下载文件
  handlerDownBtnClick() {
    if (this.state.tableSelectedRows.length > 1) {
      openNotice('warning', '无法同时下载多个文件');
    } else if (this.state.tableSelectedRows.length > 0) {
      window.location.href = this.state.tableSelectedRows[0].FILE_URL;
    } else {
      openNotice('warning', '请选择要下载的文件');
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
      { title: '文件名', dataIndex: 'FILE_NAME', width: 300, render: (text) => buildTableTip(text, 300) },
      { title: '上传者', dataIndex: 'UPLOAD_BY', width: 200, render: (text) => buildTableTip(text, 200) },
      { title: '上传时间', dataIndex: 'UPLOAD_TIME', width: 150, render: (text) => buildTableTip(text, 150) },
    ];
    const toolbar = [
      { icon: 'delete', text: '删除', click: this.handlerDeleteBtnClick.bind(this) },
      { icon: 'download', text: '下载', click: this.handlerDownBtnClick.bind(this) },
    ];
    // 渲染虚拟DOM
    return (
      <div>
        <TdCard hideHead="true" shadow="true">
          <DownloadManageSearchForm
            onSubmit={this.handleFormSubmit.bind(this)}
            onReset={this.handleFormReset.bind(this)}
          />
          <p className="br" />

          <TdPageTable rowKey={record => record.ID}
            rowSelectCallback={this.handlerRowSelect.bind(this)}
            url={url.setting.download}
            loadParam={this.state.tdTableParam}
            reload={this.state.tdTableReload}
            renderResult={this.renderTableList.bind(this)}
            columns={tableColumns}
            xcroll={{ x: true }}
            toolbar={toolbar}
          />
        </TdCard>
      </div>
    );
  }
}

export default DownloadManage;
