import React from "react"
import { Button, Form, Input, Col, Radio,Select,Row } from 'antd';
const createForm = Form.create;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
import TdSelect from "../../../component/TdSelect";
import {requestSelectData} from "../../../common/util";
import { tdpub } from "../../../config/server";
/**
 * AuthRole 角色表单管理表单组件
 *
 * Auth: 陈洪  Time: 2016-05-11
 * Update: duxury   Time: 2016-05-05
 */
class AuthRoleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: false,
            selectParams: {}
        }
    }
    //组件加载完成时触发该事件
    componentDidMount() {
        //加载下拉框数据
        requestSelectData(tdpub.dict.qryDictMutiList, { type: ["SYS_ID"], isSpace: true }, false, (oRes) => {
            this.setState({
                selectParams: oRes
            });
        });
    }
    //父页面通过修改props 中属性的值触发该方法
    componentWillReceiveProps(nextProps) {
        //更新表单数据
        if (nextProps.valid === true && this.state.valid === false) {
            this.setState({ valid: true }, () => {
                this.validForm();
                this.setState({ valid: false });
            });
        }

        //重置表单
        if (nextProps.formReset === true) {
            this.props.form.resetFields();
        }
    }

    //子页面表单校验
    validForm() {
        const { oprType, validCallback } = this.props;
        const obj = this;
        this.props.form.validateFields((errors, data) => {
            //执行父页面回调函数
            validCallback(oprType, errors, data);
        });
    }
render() {
        //渲染虚拟DOM
        const FormItem = Form.Item;
        const { idObj, oprType, formData } = this.props;
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;

        //角色名称校验   /^[\u4e00-\u9fa5\*]|[a-zA-Z0-9_.]*$/
        const nameProps = getFieldProps(idObj.roleName ? idObj.roleName : "roleName", {
            initialValue: (formData.roleName),
            validate: [{
                rules: [
                    { required: true, message: '角色名称不能为空',whitespace: true },
                    { pattern: /^([\u4e00-\u9fa5\]|[a-zA-Z0-9_])*$/g, message:'角色名称由汉字、字母、数字、下划线组成'},
                    { min: 2, max:20, message: '角色名称为 2~20 个字符',whitespace: true }
                ],
                trigger: 'onBlur'
            }],
            validateFirst:true
        });

        //角色id校验
        const roleId = getFieldProps(idObj.roleId ? idObj.roleId : "roleId", {
            initialValue: formData.roleId
        });
        //系统id校验
        const sysId = getFieldProps(idObj.sysId ? idObj.sysId : "sysId", {
            initialValue: formData.sysId,
            validate: [{
                rules: [
                    { required: true, message: '所属系统必选' }
                ],
                trigger: 'onBlur',
            }]
        });
        //角色描述校验
        const roleDesc = getFieldProps(idObj.roleDesc ? idObj.roleDesc : "roleDesc", {
            initialValue: formData.roleDesc,
            validate: [{
                rules: [
                    { max:100, message: '角色描述最多100个字符',whitespace: true }
                ],
                trigger: 'onBlur',
            }]
        });
        const itemDisable = {
            disabled: true
        }
        const itemHidden = {
            hidden: true
        }
        return (
            <Form className="compact-form" horizontal form={this.props.form}>
                <div {...itemHidden}>
                <Row>
                    <Col sm={24} md={24}>
                        <FormItem label="角色编号：" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                            <Input placeholder="请输入角色编号"  {...roleId} {...(this.props.oprType === 2 || this.props.oprType === 3 ? itemDisable : null) }/>
                        </FormItem>
                    </Col>
                </Row>
                </div>
                <Row>
                    <Col  sm={24} md={24}>
                        <FormItem label="所属系统：" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                            <TdSelect {...sysId} {...(this.props.oprType === 1 ?  null: itemDisable)} noblank={true}
                                dict={{ dict_value: "value", dict_text: "text"}}
                                data={this.state.selectParams.SYS_ID}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col sm={24} md={24}>
                        <FormItem label="角色名称："
                            labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                            <Input placeholder="请输入角色名" maxLength="20" {...nameProps} {...(this.props.oprType === 3 ?  itemDisable:null )}/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col sm={24} md={24}>
                        <div  {...(this.props.oprType === 3 ?  null: itemHidden)}>
                            <FormItem  label="是否使用："
                                labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                                <RadioGroup
                                {...getFieldProps(idObj.isUse ? idObj.isUse : "isUse", { initialValue: this.props.formData.isUse }) }
                                  {...(this.props.oprType === 3 ?  itemDisable:null )}>
                                <Radio value="1">启用</Radio>
                                <Radio value="0">禁用</Radio>
                                </RadioGroup>
                            </FormItem>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col sm={24} md={24}>
                        <FormItem
                            label="角色描述：" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                            <Input type="textarea" placeholder="角色描述" {...(this.props.oprType === 3 ?  itemDisable:null )}
                            {...roleDesc}/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const noop = () => { };
AuthRoleForm.defaultProps = {
    valid: false,        //校验状态，通过父页面修改该值触发componentWillReceiveProps方法
    idObj: {},          //ID属性对象
    oprType: 0,         //操作类型 0：默认值 1：新增 2：修改 3详情：
    formData: {},        //父页面表单数据
    validCallback: noop, //回调函数
    formReset: false     //表单重置标识位
}

AuthRoleForm = Form.create()(AuthRoleForm);
export default AuthRoleForm;
