import React from 'react';
import { Modal, Form, Row, Col, Input, DatePicker, Button } from 'antd';
import { getLoginInfo, callAjax, filterObject } from '../../../common/util';
import { url } from '../../../config/server';
import { rspInfo } from '../../../common/authConstant';
import TdCard from '../../../component/TdCard';
import TdSelect from '../../../component/TdSelect';
import { openNotice } from '../../../common/antdUtil';
import ProjectModuleModal from './ProjectModuleModal';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class ProjectModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      member: [],
      fileName: '',
      fileStatus: false,
      modalVisible: false,
      selectProjectId: '',
      selectProjectName: '',
      modStart: '',
      modEnd: '',
    };
  }

  componentDidMount() {
    //
  }

  onClickAFlag() {
    if (this.props.form.getFieldProps('proName').value === '') {
      openNotice('warning', '请选择项目');
      return;
    }
    window.$('#uploadBtn').click();
  }

  onChangeSelectFile() {
    this.setState({
      fileStatus: true,
      fileName: document.getElementById('uploadBtn').files[0].name,
    });
  }

  onClickSubmitFlag() {
    console.log(document.getElementById('uploadBtn').files[0]);
    if (document.getElementById('uploadBtn').files[0] === undefined) {
      openNotice('warning', '请选择文件');
      return;
    }
    const formData = new FormData();
    formData.append('file', document.getElementById('uploadBtn').files[0]);
    formData.append('fileName', document.getElementById('uploadBtn').files[0].name);
    formData.append('projectId', this.state.selectProjectId);
    formData.append('projectName', this.state.selectProjectName);
    formData.append('uploadBy', getLoginInfo().userId);
    formData.append('token', getLoginInfo().token);
    window.$.ajax({
      url: url.project.file,
      type: 'POST',
      data: formData,
      /**
      *必须false才会自动加上正确的Content-Type
      */
      contentType: false,
      /**
      * 必须false才会避开jQuery对 formdata 的默认处理
      * XMLHttpRequest会对 formdata 进行正确的处理
      */
      processData: false,
      success: (result) => {
        if (result.rspCode === rspInfo.RSP_SUCCESS) {
          openNotice('success', result.rspInfo);
          this.setState({
            fileStatus: false,
            fileName: '',
          });
        } else {
          openNotice('error', result.rspInfo);
        }
      },
      error: () => {
        openNotice('error', '上传失败');
      },
    });
  }

  onClickSelectOption(proId) {
    console.log('点击选择成员');
    if (proId !== '') {
      console.log(proId);
      const obj = this;
      const opt = {
        url: url.project.userInfo,
        type: 'POST',
        dataType: 'json',
        data: { proId },
      };
      callAjax(opt, (result) => {
        if (result.rspCode === rspInfo.RSP_SUCCESS) {
          obj.setState({ project: result.rspData.list });
        }
      }, () => {
        //
      });
    }
  }

  onCallProjectMembers() {
    const obj = this;
    const opt = {
      url: url.project.userListAll,
      type: 'POST',
      dataType: 'json',
      data: { proId: obj.state.selectProjectId },
    };
    callAjax(opt, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        obj.setState({ member: result.rspData.list });
      }
    }, () => {
      //
    });
  }

  handleTimeChange(date, dateString) {
    console.log('From: ', dateString[0], ', to: ', dateString[1]);
    this.props.form.setFieldsValue({ modStart: dateString[0], modEnd: dateString[1] });
  }

  openProjectModal() {
    console.log('打开项目模态框');
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  handleSubmit() {
    this.props.form.validateFields((errors, data) => {
      if (!!errors) {
        console.log('子表单校验失败', data);
      } else {
        console.log('子表单校验成功', data);
        this.realSubmit();
      }
    });
  }

  handleReset() {
    this.props.form.resetFields();
    this.props.form.setFieldsValue({ modStart: '', modEnd: '' });
    this.setState({
      selectProjectName: '',
      selectProjectId: '',
      member: [],
    });
  }

  // 模态框子页面回调
  callbackValid(success, data) {
    console.log(success, data);
    const obj = this;
    if (success) {
      this.setState({
        modalVisible: !this.state.modalVisible,
        selectProjectName: data.PRO_NAME,
        selectProjectId: data.PRO_ID,
      }, () => {
        this.props.form.setFieldsValue({ proName: data.PRO_NAME, proId: data.PRO_ID });
        obj.onCallProjectMembers();
      });
    } else {
      openNotice('error', '选择项目失败');
    }
  }

  // 执行分配任务上传
  realSubmit() {
    const data = filterObject(this.props.form.getFieldsValue());
    const opt = {
      url: url.task.add,
      type: 'POST',
      data,
    };
    callAjax(opt, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        openNotice('success', '分配任务成功');
        this.handleReset();
      } else {
        openNotice('error', result.rspInfo);
      }
    }, (error) => {
      console.log(error);
      openNotice('error', '发送请求失败');
    });
  }

  render() {
    const obj = this;
    const { getFieldProps, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };

    return (
      <div>
        <Row>
          <Col sm={24} md={12}>
            <TdCard hideHead='true' shadow='true'>
              <h2>分配任务</h2>
              <hr />
              <Form className="compact-form" horizontal >
                <div hidden>
                <Row>
                  <Col sm={24} md={24}>
                    <FormItem label="选择项目" {...formItemLayout}>
                      <Input {...getFieldProps('proId')} />
                    </FormItem>
                  </Col>
                </Row>
                </div>
                <Row>
                  <Col sm={24} md={24}>
                    <FormItem label="选择项目" {...formItemLayout}>
                      <Input readOnly placeholder="请选择项目" onClick={ this.openProjectModal.bind(this) }
                        {...getFieldProps('proName', {
                          initialValue: this.state.selectProjectName !== '' ? this.state.selectProjectName : '',
                          validate: [{
                            rules: [
                              { required: true, message: '请选择项目', whitespace: true },
                            ],
                            trigger: 'onBlur',
                          }],
                          validateFirst: true,
                        }) }
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24} md={24}>
                    <FormItem label="选择成员" {...formItemLayout}>
                      <TdSelect {...getFieldProps('userId', {
                        initialValue: '',
                        validate: [{
                          rules: [
                            { required: true, message: '请选择项目成员', whitespace: true },
                          ],
                          trigger: 'onBlur',
                        }],
                        validateFirst: true,
                      }) }
                        dict={{ dict_value: 'USER_ID', dict_text: 'USER_NAME' }}
                        data={obj.state.member} blankText="请选择项目成员"
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24} md={24}>
                    <FormItem label="模块名称" {...formItemLayout}>
                      <Input placeholder="请输入模块名称" maxLength="100"
                        {...getFieldProps('modName', {
                          initialValue: '',
                          validate: [{
                            rules: [
                              { required: true, message: '请输入项目名称', whitespace: true },
                            ],
                            trigger: 'onBlur',
                          }],
                          validateFirst: true,
                        }) }
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24} md={24}>
                    <FormItem label="起止日期" {...formItemLayout}>
                      <RangePicker placeholder="请选择起止日期" style={{ width: '100%' }} format="yyyy-MM-dd"
                        onChange={this.handleTimeChange.bind(this)}
                        value={[getFieldValue('modStart'), getFieldValue('modEnd')]}
                        defaultValue={[...getFieldProps('modStart'), ...getFieldProps('modEnd')]}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24} md={24}>
                    <FormItem label="模块描述" {...formItemLayout}>
                      <Input placeholder="请输入模块描述" type="textarea" maxLength="500"
                        autosize={{ minRows: 3, maxRows: 6 }}
                        {...getFieldProps('modDes', {
                          initialValue: '',
                          validate: [{
                            rules: [
                              { required: true, message: '请输入项目描述', whitespace: true },
                            ],
                            trigger: 'onBlur',
                          }],
                          validateFirst: true,
                        }) }
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col sm={24} md={24} style={{ textAlign: 'center' }}>
                    <FormItem >
                      <Button type="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
                      &nbsp;&nbsp;&nbsp;
              <Button type="ghost" onClick={this.handleReset.bind(this)}>重置</Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <Modal title="请选择项目" visible={this.state.modalVisible}
                confirmLoading={this.state.confirmLoading}
                onCancel={() => { this.setState({ modalVisible: false }); }}
                footer={null} width="900"
              >
                <ProjectModuleModal
                  validCallback={(success, data) => {
                    this.callbackValid(success, data);
                  } }
                />
              </Modal>
            </TdCard>
          </Col>
          <Col sm={24} md={12}>
            <TdCard hideHead='true' shadow='true' >
              <h3>上传附件</h3>
              <hr />
              <div style={{ border: '1px dashed #ABABAB', height: '100px' }} onClick={this.onClickAFlag.bind(this)}>
                <a>
                  <p style={{ textAlign: 'center' }}>点击上传文件</p>
                  <p style={{ textAlign: 'center' }}>注: 上传文件之前先选择项目</p>
                  <p style={{ textAlign: 'center', marginTop: '10px' }} hidden={ !this.state.fileStatus } >
                    { this.state.fileName }
                  </p>
                </a>
              </div>
              <br />
              <div hidden><input id="uploadBtn" type='file' onChange={ this.onChangeSelectFile.bind(this) } /></div>
              <Button type='ghost' onClick={this.onClickSubmitFlag.bind(this)} style={{ width: '100%' }} >上传</Button>
            </TdCard>
          </Col>
        </Row>
      </div>
    );
  }
}

ProjectModule.defaultProps = {
  formData: {},        // 父页面表单数据
  formReset: false,     // 表单重置标识位
};

ProjectModule = Form.create()(ProjectModule);
export default ProjectModule;
