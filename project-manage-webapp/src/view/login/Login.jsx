import './Login.less';
import React, { PropTypes } from 'react';
import MD5 from 'crypto-js/md5';
import { Form, Button, Row, Col, Modal } from 'antd';
import TdIconInput from '../../component/TdIconInput';
import { url } from '../../config/server';
import { setLoginInfo, setLocalToken, callAjax } from '../../common/util';
import { openNotice } from '../../common/antdUtil';
import { rspInfo } from '../../common/authConstant';
import ApplyAccountForm from './ApplyAccountForm';

const FormItem = Form.Item;

class Login extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      loading: false,
      modalVisible: false,
      modelIsValid: false,
      formReset: false,
    };
  }

  // 添加用户
  handleAddBtnClick() {
    this.setState({
      formData: {},
      modalVisible: true,
      modalTitle: '申请账号',
    }, () => {
      // 重置子组件表单数据
      this.setState({ formReset: true }, () => {
        // 将子组件表单重置标识置为false
        this.setState({
          formReset: false,
        });
      });
    });
  }

  handleFormSubmit(ev) {
    ev.preventDefault();
    const dat = this.props.form.getFieldsValue();
    if (!dat.usrName || dat.usrName.trim() === '') {
      openNotice('warning', '请输入用户名');
    } else if (!dat.usrPsw || dat.usrPsw.trim() === '') {
      openNotice('warning', '请输入密码');
    } else {
      this.setState({ loading: true }, () => {
        callAjax({
          url: url.user.login,
          type: 'POST',
          dataType: 'json',
          data: {
            userId: dat.usrName,
            userPwd: MD5(dat.usrPsw).toString(),
          },
        }, (result) => {
          if (result.rspCode === rspInfo.RSP_SUCCESS) {
            // 登录成功,保存登录信息(应包含用户名,用户权限,用户Token等信息)
            const info = result.rspData;
            setLoginInfo(info);
            setLocalToken(info.token);
            this.context.router.replace('/main');
          } else {
            openNotice('error', result.rspInfo);
            this.setState({ loading: false });
          }
        });
      });
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div className='td-login'>
        <header />
        <div className='td-login-header'>
          <div className='td-login-header-logo' />
          <ul>
            <li><a href='javascript:void(0);' onClick={() => this.handleAddBtnClick()}>申请账号</a></li>
          </ul>
        </div>
        <div className='td-login-form-warp' />
        <Form horizontal onSubmit={this.handleFormSubmit.bind(this) } className='td-login-form compact-form'>
          <h1>项目管理系统</h1>
          <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} >
            <TdIconInput position="left" icon="user" maxLength={20} placeholder="请输入用户名" {...getFieldProps('usrName') } />
          </FormItem>
          <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} >
            <TdIconInput position="left" icon="lock" maxLength={20} type="password" placeholder="请输入密码" {...getFieldProps('usrPsw') } />
          </FormItem>
          <Row>
            <Col span='24'>
              <Button size='large' type='primary' htmlType='submit' loading={this.state.loading}>确定</Button>
            </Col>
          </Row>
        </Form>
        <Modal title={this.state.modalTitle} visible={this.state.modalVisible}
          confirmLoading={this.state.confirmLoading}
          onCancel={() => { this.setState({ modalVisible: false }); }}
          footer={null}
        >
          <ApplyAccountForm
            valid={this.state.modelIsValid}
            formReset={this.state.formReset}
          />
        </Modal>
      </div>
    );
  }
}

// 应用contextTypes(不做手工页面跳转则不需要)
Login.contextTypes = {
  router: PropTypes.object.isRequired,
};
// 必须有create包装,才会带this.props.form属性
Login = Form.create()(Login);
export default Login;
