import React from 'react';
import { Form, Row, Col, Input, Select } from 'antd';
import { getLoginInfo } from '../../common/util';

const FormItem = Form.Item;
const Option = Select.Option;

class UserManageEditForm extends React.Component {
  constructor(props) {
    super(props);
    const info = getLoginInfo();
    this.state = ({
      valid: false,
      userAuth: info.userAuth,
    });
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
    // console.log('formReset = ' + nextProps.formReset);
    // 重置表单
    if (nextProps.formReset === true) {
      console.log('child component form reset.');
      this.props.form.resetFields();
    }
  }

  // 子页面表单校验
  validForm() {
    console.log('=====进入validForm');
    const { editType, validCallback } = this.props;

    this.props.form.validateFields((errors, data) => {
      console.log('error = ', errors);
      // 执行父页面回调函数
      validCallback(editType, errors, data);
    });
  }

  render() {
    const { formData, editType } = this.props;
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
              <Input placeholder="请输入用户登录名" maxLength="20" readOnly={ editType === '2' }
                {...getFieldProps('userId', {
                  initialValue: formData.USER_ID !== undefined ? formData.USER_ID : '',
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
                initialValue: formData.USER_NAME !== undefined ? formData.USER_NAME : '',
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
        { this.state.userAuth === '0' ?
        <Row>
          <Col sm={24} md={24}>
            <FormItem label="用户权限" {...formItemLayout}>
              <Select placeholder="请选择用户权限" {...getFieldProps('userAuth', {
                initialValue: formData.USER_AUTH !== undefined ? formData.USER_AUTH : '2',
                validate: [{
                  rules: [
                    { required: true, message: '请选择用户权限', whitespace: true },
                  ],
                  trigger: 'onBlur',
                }],
                validateFirst: true,
              })}
              >
                <Option value="1">项目组长</Option>
                <Option value="2">项目成员</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        :
        <div hidden>
          <Row>
            <Col sm={24} md={24}>
              <FormItem >
                <Input {...getFieldProps('userAuth', { initialValue: '2' })} />
              </FormItem>
            </Col>
          </Row>
        </div>
        }
        <Row>
          <Col sm={24} md={24}>
            <FormItem label="初始状态" {...formItemLayout}>
              <Select placeholder="请选择用户状态" {...getFieldProps('userLogin', {
                initialValue: formData.USER_LOGIN !== undefined ? formData.USER_LOGIN : '1',
                validate: [{
                  rules: [
                    { required: true, message: '请选择用户状态', whitespace: true },
                  ],
                  trigger: 'onBlur',
                }],
                validateFirst: true,
              })}
              >
                <Option value="1">启用</Option>
                <Option value="0">禁用</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
const noop = () => { };
UserManageEditForm.defaultProps = {
  valid: false,        // 校验状态，通过父页面修改该值触发componentWillReceiveProps方法
  formData: {},        // 父页面表单数据
  validCallback: noop, // 回调函数
  formReset: false,     // 表单重置标识位
};

UserManageEditForm = Form.create()(UserManageEditForm);
export default UserManageEditForm;
