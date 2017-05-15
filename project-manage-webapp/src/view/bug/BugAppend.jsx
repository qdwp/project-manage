import React from 'react';
import { Modal, Form, Row, Col, Input, Select, DatePicker, Button } from 'antd';
import { getLoginInfo, callAjax, filterObject } from '../../common/util';
import { url } from '../../config/server';
import { rspInfo } from '../../common/authConstant';
import TdCard from '../../component/TdCard';
import TdSelect from '../../component/TdSelect';
import { openNotice } from '../../common/antdUtil';
import BugAppendModal from './BugAppendModal';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class BugAppend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      member: [],
      module: [],
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

  onCallProjectModules() {
    const obj = this;
    const opt = {
      url: url.module.query,
      type: 'POST',
      dataType: 'json',
      data: { proId: obj.state.selectProjectId },
    };
    callAjax(opt, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        obj.setState({ module: result.rspData.list });
      }
    }, () => {
      //
    });
  }

  handleTimeChange(date, dateString) {
    console.log('From: ', dateString[0], ', to: ', dateString[1]);
    this.props.form.setFieldsValue({ modStart: dateString[0], modEnd: dateString[1] });
  }

  handleOnSelectModule(value, option) {
    if (value !== '') {
      this.props.form.setFieldsValue({ modName: option.props.children });
    }
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
        obj.onCallProjectModules();
      });
    } else {
      openNotice('error', '选择项目失败');
    }
  }

  // 执行分配任务上传
  realSubmit() {
    const data = filterObject(this.props.form.getFieldsValue());
    const opt = {
      url: url.bug.append,
      type: 'POST',
      data,
    };
    callAjax(opt, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        openNotice('success', result.rspInfo);
        this.handleReset();
      } else {
        openNotice('error', result.rspInfo);
      }
    }, (error) => {
      openNotice('error', rspInfo.RSP_NETWORK_ERROR);
    });
  }

  render() {
    const obj = this;
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    const bugLevel = [
      { value: 'Critical', text: 'Critical 致命问题[系统崩溃,需求不符]' },
      { value: 'Major', text: 'Major 严重问题[功能不全,计算错误]' },
      { value: 'Normal', text: 'Normal 一般问题[界面操作,信息不准]' },
      { value: 'Minor', text: 'Minor 微小问题[提示错误,格式规范]' },
      { value: 'Trivial', text: 'Trivial 轻微问题[描述不清,提出建议]' },
    ];

    return (
      <div>
        <TdCard hideHead='true' shadow='true'>
          <h2>创建问题</h2>
          <hr />
          <Form className="compact-form" horizontal >
            <div hidden>
            <Row>
              <Col sm={24} md={24}>
                <FormItem label="选择项目" {...formItemLayout}>
                  <Input {...getFieldProps('proId')} />
                  <Input {...getFieldProps('modName')} />
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
                <FormItem label="模块名称" {...formItemLayout}>
                  <TdSelect placeholder="请选择模块名称" onSelect={ obj.handleOnSelectModule.bind(this) }
                    {...getFieldProps('modId', { initialValue: '',
                      validate: [{
                        rules: [
                          { required: true, message: '请选择模块名称', whitespace: true },
                        ],
                        trigger: 'onBlur',
                      }],
                      validateFirst: true,
                     }) }
                    dict={{ dict_value: 'MODULE_ID', dict_text: 'MODULE_NAME' }}
                    data={obj.state.module} blankText="-- 请选择 --"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={24}>
                <FormItem label="BUG主题" {...formItemLayout}>
                  <Input placeholder="请输入BUG主题"
                    {...getFieldProps('bugTitle', {
                      initialValue: '',
                      validate: [{
                        rules: [
                          { required: true, message: '请输入BUG主题', whitespace: true },
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
                <FormItem label="BUG优先级" {...formItemLayout}>
                  <TdSelect noblank
                    {...getFieldProps('bugLevel', {
                      initialValue: 'Major',
                      validate: [{
                        rules: [
                          { required: true, message: '请输入BUG主题', whitespace: true },
                        ],
                        trigger: 'onBlur',
                      }],
                      validateFirst: true,
                    }) }
                    dict={{ dict_value: 'value', dict_text: 'text' }}
                    data={bugLevel}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={24}>
                <FormItem label="经办人" {...formItemLayout}>
                  <TdSelect
                    {...getFieldProps('userId', { initialValue: '' }) }
                    dict={{ dict_value: 'USER_ID', dict_text: 'USER_NAME' }}
                    data={obj.state.member} blankText="-- 公共 --"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={24}>
                <FormItem label="问题描述" {...formItemLayout}>
                  <Input placeholder="请输入问题描述" type="textarea" maxLength="500"
                    autosize={{ minRows: 3, maxRows: 6 }}
                    {...getFieldProps('bugDes', {
                      initialValue: '',
                      validate: [{
                        rules: [
                          { required: true, message: '请输入问题描述', whitespace: true },
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
                  <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
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
            <BugAppendModal
              validCallback={(success, data) => {
                this.callbackValid(success, data);
              } }
            />
          </Modal>
        </TdCard>
      </div>
    );
  }
}

BugAppend.defaultProps = {
  formData: {},        // 父页面表单数据
  formReset: false,     // 表单重置标识位
};

BugAppend = Form.create()(BugAppend);
export default BugAppend;
