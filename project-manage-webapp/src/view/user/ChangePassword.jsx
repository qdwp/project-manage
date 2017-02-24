import React from 'react';
import MD5 from 'crypto-js/md5';
import { PropTypes } from 'react';
import TdCard from '../../component/TdCard';
import { Row, Col, Form, Input, Button } from 'antd';
import { openNotice } from '../../common/antdUtil';
import { url } from '../../config/server';
import { rspInfo } from '../../common/authConstant';
import { callAjax, filterObject, getLoginInfo, setLoginInfo } from '../../common/util';
const FormItem = Form.Item;

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLoading: false,
      value: '',
    };
  }
// 父页面通过修改props 中属性的值触发该方法
  componentWillReceiveProps(nextProps) {
    // 更新表单数据
    if (nextProps.valid === true && this.state.valid === false) {
      this.setState({ valid: true }, () => {
        this.validForm();
        this.setState({ valid: false });
      });
    }
    console.log('formReset = ', nextProps.formReset);
    // 重置表单
    if (nextProps.formReset === true) {
      console.log('child component form reset.');
      this.props.form.resetFields();
      this.setState({
        value: '',
      });
    }
  }

  onChange(value) {
    this.setState({ value });
  }
  // 子页面表单校验
  validForm() {
    console.log('=====进入validForm');
    const { oprType, validCallback } = this.props;
    const obj = this;
    this.props.form.validateFields((errors, data) => {
      // data.orgId = this.state.value;
      console.log(`error = ${errors}`);
      // 执行父页面回调函数
      validCallback(oprType, errors, data);
    });
  }
  handleSubmit() {
    this.props.form.validateFields((errors, data) => {
      // data.orgId = this.state.value;
      if (!!errors) {
        console.log('子表单校验失败', data);
        // return;
      } else {
        console.log('子表单校验成功', data);
        this.realSubmit();
      }
    });
  }

  realSubmit() {
    const data = filterObject(this.props.form.getFieldsValue());
    callAjax({
      url: url.user.updatePwd,
      type: 'POST',
      data: {
        newPwd: MD5(data.newPwd).toString(),
        oldPwd: MD5(data.oldPwd).toString(),
      },
    }, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        this.setState({
          modalVisible: false,
          confirmLoading: false,
          buttonLoading: true,
        }, () => {
          const info = getLoginInfo();
          info.isFirstLogin = 0;
          setLoginInfo(info);
          this.props.form.resetFields();
        });
        openNotice('success', '修改密码成功，即将跳转到登录页面');
        setTimeout(() => {
          window.location.href = '/#/login';
        }, 2000);
      } else {
        openNotice('error', result.rspMsg, '提示');
        this.setState({
          confirmLoading: false,
        });
      }
    }, (error) => {
      console.log(error);
      openNotice('error', '发送请求失败');
    });
  }

  handleReset() {
    this.props.form.resetFields();
  }
  /**
   * 校验2次密码一致
   */
  checkPass2(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('newPwd')) {
      callback('两次输入新密码不一致！');
    } else {
      callback();
    }
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const { getFieldProps } = this.props.form;

    // 表单校验
    // 旧密码校验
    const oldPwd = getFieldProps('oldPwd', {
      initialValue: '',
      validate: [{
        rules: [
          { required: true, message: '旧密码不能为空', whitespace: true },
        ],
        trigger: 'onBlur',

      }],
      validateFirst: true,
    });
    const newPwd = getFieldProps('newPwd', {
      initialValue: '',
      validate: [{
        rules: [
          { required: true, message: '新密码不能为空', whitespace: true },
          { max: 10, message: '密码最大10位' },
        ],
        trigger: 'onBlur',
      }],
      validateFirst: true,
    });
    const newPwdRepeat = getFieldProps('newPwdRepeat', {
      initialValue: '',
      validate: [{
        rules: [
          { required: true, message: '确认密码不能为空', whitespace: true },
          { max: 10, message: '密码最大10位' },
          { validator: this.checkPass2.bind(this) },
        ],
        trigger: 'onBlur',

      }],
      validateFirst: true,
    });
    return (
      <TdCard hideHead='true' shadow='true'>
        <div style={{ maxWidth: 600, margin: 'auto' }}>
          <Form className="compact-form" horizontal>
            <Row>
              <Col sm={24} md={24}>
                <FormItem label="请输入旧密码：" {...formItemLayout}>
                  <Input type="password" placeholder="请输入旧密码" maxLength="10" {...oldPwd} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col sm={24} md={24}>
                <FormItem label="请输入新密码：" {...formItemLayout}>
                  <Input type="password" placeholder="请输入新密码" maxLength="10" {...newPwd} />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col sm={24} md={24}>
                <FormItem label="请再次输入新密码：" {...formItemLayout}>
                  <Input type="password" placeholder="请再次输入新密码" maxLength="10" {...newPwdRepeat} />
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col sm={24} md={24}>
                <FormItem wrapperCol={{ span: 12, offset: 7 }}>
                  <Button type="primary" loading={this.state.buttonLoading} onClick={this.handleSubmit.bind(this)}>确定</Button>
                  &nbsp;&nbsp;&nbsp;
                            <Button type="ghost" disabled={this.state.buttonLoading} onClick={this.handleReset.bind(this)}>重置</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </TdCard>
    );
  }
}
// 应用contextTypes(不做手工页面跳转则不需要)
ChangePassword.contextTypes = {
  router: PropTypes.object.isRequired,
};

ChangePassword = Form.create()(ChangePassword);
export default ChangePassword;
