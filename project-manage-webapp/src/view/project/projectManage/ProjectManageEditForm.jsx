import React from 'react';
import { Form, Row, Col, Input, Select } from 'antd';
import { getLoginInfo, callAjax } from '../../../common/util';
import { url } from '../../../config/server';
import { rspInfo } from '../../../common/authConstant';
import TdSelect from '../../../component/TdSelect';

const FormItem = Form.Item;
const Option = Select.Option;

class ProjectManageEditForm extends React.Component {
  constructor(props) {
    super(props);
    const info = getLoginInfo();
    this.state = ({
      valid: false,
      userAuth: info.userAuth,
      proType: {},
    });
  }

  componentDidMount() {
    const obj = this;
    const param = {};
    const opt = {
      url: url.project.typeList,
      type: 'GET',
      dataType: 'json',
      data: param,
    };
    callAjax(opt, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        obj.setState({ proType: result.rspData.list });
      }
    }, () => {
      //
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
    // console.log('=====进入validForm');
    const { editType, validCallback } = this.props;

    this.props.form.validateFields((errors, data) => {
      console.log('error = ', errors);
      // 执行父页面回调函数
      validCallback(editType, errors, data);
    });
  }

  render() {
    const obj = this;
    const { formData, editType } = this.props;
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form className="compact-form" horizontal >
        <div hidden>
          <FormItem>
            <Input {...getFieldProps('proId', {
              initialValue: formData.PRO_ID !== undefined ? formData.PRO_ID : '' })}
            />
          </FormItem>
        </div>
        <Row>
          <Col sm={24} md={24}>
            <FormItem label="项目名称" {...formItemLayout}>
              <Input placeholder="请输入项目名称" maxLength="20" readOnly={ editType === '2' }
                {...getFieldProps('proName', {
                  initialValue: formData.PRO_NAME !== undefined ? formData.PRO_NAME : '',
                  validate: [{
                    rules: [
                      { required: true, message: '请输入项目名称', whitespace: true },
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
            <FormItem label="项目类型" {...formItemLayout}>
              <TdSelect {...getFieldProps('proType', {
                initialValue: formData.PRO_TYPE !== undefined ? formData.PRO_TYPE : '',
                validate: [{
                  rules: [
                    { required: true, message: '请选择项目类型', whitespace: true },
                  ],
                  trigger: 'onBlur',
                }],
                validateFirst: true,
              })}
                dict={{ dict_value: 'TYPE_ID', dict_text: 'TYPE_TEXT' }}
                data={obj.state.proType} blankText="请选择"
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24}>
            <FormItem label="是否启用" {...formItemLayout}>
              <Select placeholder="请选择是否启用" {...getFieldProps('proUse', {
                initialValue: formData.PRO_USE !== undefined ? formData.PRO_USE : '0',
                validate: [{
                  rules: [
                    { required: true, message: '请选择是否启用', whitespace: true },
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
        <Row>
          <Col sm={24} md={24}>
            <FormItem label="项目描述" {...formItemLayout}>
              <Input placeholder="请输入项目描述" type="textarea" maxLength="99"
                autosize={{ minRows: 2, maxRows: 6 }}
                {...getFieldProps('proDes', {
                  initialValue: formData.PRO_DES !== undefined ? formData.PRO_DES : '',
                  validate: [{
                    rules: [
                      { required: true, message: '请输入项目描述', whitespace: true },
                    ],
                    trigger: 'onBlur',
                  }],
                  validateFirst: true,
                })}
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
const noop = () => { };
ProjectManageEditForm.defaultProps = {
  valid: false,        // 校验状态，通过父页面修改该值触发componentWillReceiveProps方法
  formData: {},        // 父页面表单数据
  validCallback: noop, // 回调函数
  formReset: false,     // 表单重置标识位
};

ProjectManageEditForm = Form.create()(ProjectManageEditForm);
export default ProjectManageEditForm;
