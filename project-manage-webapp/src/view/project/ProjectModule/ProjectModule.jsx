import React from 'react';
import { Modal, Form, Row, Col, Input, Select, DatePicker, Button } from 'antd';
import { getLoginInfo, callAjax } from '../../../common/util';
import { url } from '../../../config/server';
import { rspInfo } from '../../../common/authConstant';
import TdCard from '../../../component/TdCard';
import TdSelect from '../../../component/TdSelect';
import { openNotice } from '../../../common/antdUtil';
import ProjectModal from './ProjectModal';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class ProjectModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      member: {},
      fileName: '',
      fileStatus: false,
      modalVisible: false,
    };
  }

  componentDidMount() {
    const obj = this;
    const param = {};
    const opt = {
      url: url.project.list,
      type: 'POST',
      dataType: 'json',
      data: param,
    };
    callAjax(opt, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        obj.setState({ project: result.rspData.list });
      }
    }, () => {
      //
    });
  }

  onClickAFlag() {
    if (this.props.form.getFieldProps('proName').value === '') {
      openNotice('warning', '请选择项目');
      return;
    }
    window.$('#uploadBtn').click();
  }

  onChangeSelectFile() {
    console.log('选中文件');
    console.log(document.getElementById('uploadBtn').files[0].name);

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
    // formData.append('projectId', document.getElementById('uploadBtn').files[0]);
    // formData.append('projectName', document.getElementById('uploadBtn').files[0]);
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
          openNotice('success', '上传成功');
          this.setState({
            fileStatus: false,
            fileName: '',
          });
        } else {
          openNotice('erroe', result.rspInfo);
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

  openProjectModal() {
    //
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
  callbackValid(success, data) {
    //
    console.log(success, data);
  }


  realSubmit() {
    // const data = filterObject(this.props.form.getFieldsValue());
    // callAjax({
    //   url: url.user.updatePwd,
    //   type: 'POST',
    //   data: {
    //     newPwd: MD5(data.newPwd).toString(),
    //     oldPwd: MD5(data.oldPwd).toString(),
    //   },
    // }, (result) => {
    //   if (result.rspCode === rspInfo.RSP_SUCCESS) {
    //     this.setState({
    //       modalVisible: false,
    //       confirmLoading: false,
    //       buttonLoading: true,
    //     }, () => {
    //       const info = getLoginInfo();
    //       info.isFirstLogin = 0;
    //       setLoginInfo(info);
    //       this.props.form.resetFields();
    //     });
    //     openNotice('success', '修改密码成功，即将跳转到登录页面');
    //     setTimeout(() => {
    //       window.location.href = '/#/login';
    //     }, 2000);
    //   } else {
    //     openNotice('error', result.rspInfo, '提示');
    //     this.setState({
    //       confirmLoading: false,
    //     });
    //   }
    // }, (error) => {
    //   console.log(error);
    //   openNotice('error', '发送请求失败');
    // });
  }

  render() {
    const obj = this;
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div>
        <Row>
          <Col sm={24} md={12}>
            <TdCard hideHead='true' shadow='true'>
              <h2>分配任务</h2>
              <hr />
              <Form className="compact-form" horizontal >
                <Row>
                  <Col sm={24} md={24}>
                    <FormItem label="选择项目" {...formItemLayout}>
                      <Input readOnly onClick={ this.openProjectModal.bind(this) }
                        {...getFieldProps('proName', {
                          initialValue: '',
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
                      <TdSelect {...getFieldProps('userName', {
                        initialValue: '',
                        validate: [{
                          rules: [
                            { required: true, message: '请选择项目成员', whitespace: true },
                          ],
                          trigger: 'onBlur',
                        }],
                        validateFirst: true,
                      }) }
                        dict={{ dict_value: 'TYPE_ID', dict_text: 'TYPE_TEXT' }}
                        data={obj.state.member} blankText="请先选择项目"
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
                        {...getFieldProps('modTime', {
                          initialValue: '',
                          validate: [{
                            rules: [
                              { required: true, message: '请选择起止日期', whitespace: true },
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
                onCancel={() => { this.setState({ modalVisible: false }); } }
                onOk={this.handleModalOk.bind(this)} width="900"
              >
                <ProjectModal formReset={this.state.formReset}
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
  valid: false,        // 校验状态，通过父页面修改该值触发componentWillReceiveProps方法
  formData: {},        // 父页面表单数据
  formReset: false,     // 表单重置标识位
};

ProjectModule = Form.create()(ProjectModule);
export default ProjectModule;
