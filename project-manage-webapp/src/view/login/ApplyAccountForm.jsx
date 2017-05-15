import React from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import MD5 from 'crypto-js/md5';
import { getLoginInfo, filterObject, callAjax } from '../../common/util';
import { url } from '../../config/server';
import { openNotice } from '../../common/antdUtil';
import { rspInfo } from '../../common/authConstant';

const FormItem = Form.Item;

class ApplyAccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      valid: false,
    });
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

  // 添加对话框的确定按钮
  realSubmit() {
    const data = filterObject(this.props.form.getFieldsValue());
    data.userPwd = MD5(data.userPwd).toString();
    const opt = {
      url: url.user.apply,
      data,
    };
    const obj = this;
    // 请求后台添加用户接口
    callAjax(opt, (result) => {
      console.log(result);
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        openNotice('success', result.rspInfo);
        this.props.form.resetFields();
        obj.setState({
          confirmLoading: false,
        });
      } else {
        openNotice('error', result.rspInfo);
        obj.setState({
          confirmLoading: false,
        });
      }
    }, (req, info, opt) => {
      openNotice('error', rspInfo.RSP_NETWORK_ERROR);
      obj.setState({
        confirmLoading: false,
      });
    });
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form className="compact-form" horizontal >
        <Row>
          <Col sm={24} md={24}>
            <FormItem label="用户名" {...formItemLayout}>
              <Input placeholder="请输入用户登录名" maxLength="20"
                {...getFieldProps('userId', {
                  initialValue: '',
                  validate: [{
                    rules: [
                      { required: true, message: '请输入用户登录名', whitespace: true },
                    ],
                    trigger: 'onBlur',
                  }],
                  validateFirst: true,
                })}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24}>
            <FormItem label="用户姓名" {...formItemLayout}>
              <Input placeholder="请输入用户姓名" maxLength="20" {...getFieldProps('userName', {
                initialValue: '',
                validate: [{
                  rules: [
                    { required: true, message: '请输入用户姓名', whitespace: true },
                  ],
                  trigger: 'onBlur',
                }],
                validateFirst: true,
              })}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24}>
            <FormItem label="登录密码" {...formItemLayout}>
              <Input placeholder="请输入用户登录密码" maxLength="20" type="password"
                {...getFieldProps('userPwd', {
                  initialValue: '',
                  validate: [{
                    rules: [
                      { required: true, message: '请输入用户登录密码', whitespace: true },
                    ],
                    trigger: 'onBlur',
                  }],
                  validateFirst: true,
                })}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24}>
            <FormItem label="默认权限" {...formItemLayout}>
              <Input placeholder="请输入用户姓名" maxLength="20"
                readOnly
                {...getFieldProps('userAuth', { initialValue: '项目组长' })}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24} style={{ textAlign: 'center' }}>
            <FormItem >
              <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
              &nbsp;&nbsp;&nbsp;
      <Button type="ghost" onClick={() => this.props.form.resetFields()}>重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
const noop = () => { };
ApplyAccountForm.defaultProps = {
  valid: false,        // 校验状态，通过父页面修改该值触发componentWillReceiveProps方法
  formData: {},        // 父页面表单数据
  validCallback: noop, // 回调函数
  formReset: false,     // 表单重置标识位
};

ApplyAccountForm = Form.create()(ApplyAccountForm);
export default ApplyAccountForm;
