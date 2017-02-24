import React from 'react';
import { Row, Radio, Col, Form, Input } from 'antd';
import TdIconPicker from '../../../component/TdIconPicker';
import { requestSelectData } from '../../../common/util';
import { tdpub } from '../../../config/server';

const RadioGroup = Radio.Group;
/**
 * AuthMenuForm 分类菜单管理表单组件
 *
 * Auth: jiangdi  Time: 2016-05-05
 * Update: li.sy   Time: 2016-05-05
 */
class AuthMenuForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      selectParams: {},
      icon: props.formData.icon,
    };
  }

  // 组件加载完成时触发该事件
  componentDidMount() {
    // 加载下拉框数据
    requestSelectData(tdpub.dict.qryDictMutiList, { type: ['MENU_ICON'], isSpace: true }, false, (oRes) => {
      this.setState({
        selectParams: oRes,
      });
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
    // 重置表单
    if (nextProps.formReset === true) {
      this.props.form.resetFields();
    }
  }

  // 子页面表单校验
  validForm() {
    const { oprType, validCallback } = this.props;
    this.props.form.validateFields((errors, data) => {
      data.icon = this.state.icon;
      validCallback(oprType, errors, data);
    });
  }
  render() {
    // 定义变量和参数
    const FormItem = Form.Item;
    const { idObj, formData } = this.props;
    const { getFieldProps } = this.props.form;
    // 菜单名称校验
    const nameProps = getFieldProps(idObj.itmName ? idObj.itmName : 'itmName', {
      initialValue: (formData.itmName),
      validate: [{
        rules: [
          { required: true, message: '菜单名称不能为空', whitespace: true },
          { min: 1, max: 10, message: '菜单名称为 1~10 个字符' },
        ],
        trigger: 'onBlur',
      }],
      validateFirst: true,
    });
    // 菜单url校验
    const itmUrlProps = getFieldProps(idObj.itmUrl ? idObj.itmUrl : 'itmUrl', {
      initialValue: (formData.itmUrl),
      validate: [{
        rules: [
          { required: true, message: '菜单地址不能为空', whitespace: true },
          { min: 1, max: 30, message: '菜单地址为 1~30 个字符' },
        ],
        trigger: 'onBlur',
      }],
      validateFirst: true,
    });

    // 用户状态校验
    const itmTyp = getFieldProps(idObj.itmTyp ? idObj.itmTyp : 'itmTyp', {
      initialValue: formData.itmTyp,
      validate: [{
        rules: [
          { required: true, message: '菜单类型必选' },
        ],
        trigger: 'onBlur',
      }],
    });
    const iconObj = getFieldProps(idObj.icon ? idObj.icon : 'icon', {
      initialValue: formData.icon,
    });

    const itmId = getFieldProps(idObj.itmId ? idObj.itmId : 'itmId',
      { initialValue: this.props.formData.itmId ? this.props.formData.itmId : null });
    const parentItmId = getFieldProps(idObj.parentItmId ? idObj.parentItmId : 'parentItmId',
      { initialValue: this.props.formData.parentItmId ? this.props.formData.parentItmId : '' });
    const parentItmName = getFieldProps(idObj.parentItmName ? idObj.parentItmName : 'parentItmName',
      { initialValue: this.props.formData.parentItmName ? this.props.formData.parentItmName : '' });
    const isUse = getFieldProps(idObj.isUse ? idObj.isUse : 'isUse',
      { initialValue: this.props.formData.isUse ? this.props.formData.isUse : '' });
    const itmDesc = getFieldProps(idObj.itmDesc ? idObj.itmDesc : 'itmDesc',
      {
        initialValue: this.props.formData.itmDesc ? this.props.formData.itmDesc : '',
        validate: [{
          rules: [
            { max: 100, message: '描述不能超过100个字符', whitespace: true },
          ],
          trigger: 'onBlur',
        }],
        validateFirst: true,
      });
    const itemDisable = {
      disabled: true,
    };
    const itemHidden = {
      hidden: true,
    };
    // 渲染虚拟DOM
    return (
      <Form horizontal form={this.props.form}>
        <div hidden>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label='菜单ID：'>
                <Input {...itmId} />
              </FormItem>
            </Col>
          </Row>
        </div>
        <div hidden>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label='上级菜单编号：' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                <Input {...parentItmId } placeholder='请选择上级菜单ID' {...(this.props.oprType === 3 || this.props.oprType === 1 ? null : itemDisable) } />
              </FormItem>
            </Col>
          </Row>
        </div>
        <div {...(this.props.oprType === 1 ? null : itemHidden) }>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label='上级菜单：' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} >
                <Input {...parentItmName } placeholder='请选择上级菜单' {...(this.props.oprType === 3  ? null : itemDisable) } />
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row>
          <Col sm={24} md={24}>
            <FormItem label='菜单名称：' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              <Input {...nameProps} placeholder='请输入菜单名' maxLength='10' {...(this.props.oprType === 3 ? itemDisable : null) } />
            </FormItem>
          </Col>
        </Row>
        <div {...(this.props.oprType === 3 ? null : itemHidden) }>
          <Row>
            <Col sm={24} md={24}>
              <FormItem label='菜单状态：' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} >
                <RadioGroup {...isUse } {...(this.props.oprType === 3 ? itemDisable : null) } >
                  <Radio value='1'>启用</Radio>
                  <Radio value='0'>禁用</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </div>
        <Row>
          <Col sm={24} md={24}>
            <FormItem label='菜单类型：' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              <RadioGroup {...itmTyp} {...(this.props.oprType === 3 ? itemDisable : null) }>
                <Radio value='1'>菜单</Radio>
                <Radio value='2'>按钮</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24}>
            <FormItem label='菜单图标：' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              <TdIconPicker {...iconObj} onPick={(val) => { this.setState({ icon: val }); }} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24}>
            <FormItem label='菜单路径：' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              <Input placeholder='请输入菜单路径' maxLength='30' {...itmUrlProps } {...(this.props.oprType === 3 ? itemDisable : null) } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={24} md={24}>
            <FormItem label='描述：' labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
              <Input type='textarea' {...itmDesc } maxLength='100' placeholder='菜单描述' {...(this.props.oprType === 3 ? itemDisable : null) } />
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}
const noop = () => { };
AuthMenuForm.defaultProps = {
  valid: false,    // 校验状态，通过父页面修改该值触发componentWillReceiveProps方法
  idObj: {},       // ID属性对象
  oprType: 0,      // 操作类型 0：默认值 1：新增 2：修改 3详情：
  formData: {},    // 父页面表单数据
  validCallback: noop, // 回调函数
  formReset: false,    // 表单重置标识位
};

AuthMenuForm = Form.create()(AuthMenuForm);
export default AuthMenuForm;
