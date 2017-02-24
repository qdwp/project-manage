import React from "react"
import { Button, Form, Input, Col, Row, Radio,Select } from 'antd';
const createForm = Form.create;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;


class AuthAgtAddModalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: false
        }
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
            console.log("child component form reset.");
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
        
        //机构名称校验
        const nameProps = getFieldProps(idObj.orgName ? idObj.orgName : "orgName", {
            initialValue: (formData.orgName),
            validate: [{
                rules: [
                    { required: true, message: '机构名不能为空' ,whitespace: true},
                    { min: 2, max:20, message: '机构名为 2~20 个字符' ,whitespace: true},
                ],
                trigger: 'onBlur'
            }],
            validateFirst:true
        });
        
        //机构ID校验
        const orgId = getFieldProps(idObj.orgId ? idObj.orgId : "orgId", {
            initialValue: (formData.orgId),
            validate: [{
                rules: [
                    { required: true, message: '机构编号不能为空' ,whitespace: true},
                    { pattern: /^[a-zA-Z0-9_]*$/g, message:'机构编号只能是字母数字和下划线的组合'},
                    { min: 2, max:20, message: '机构编号为 2~20 个字符' ,whitespace: true},
                ],
                trigger: 'onBlur'
            }],
            validateFirst:true
        });
        //机构描述校验
        const orgDesc = getFieldProps(idObj.orgDesc ? idObj.roleDesc : "orgDesc", {
            initialValue: formData.orgDesc,
            validate: [{
                rules: [
                    { max:100, message: '机构描述最多100个字符',whitespace: true } 
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
            <Form horizontal form={this.props.form}>
                <div {...itemHidden}>
                <Row>
                    <Col sm={24} md={24}>
                        <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="上级机构ID：">
                            <Input disabled={true} placeholder="请输入上级机构ID"
                            {...getFieldProps(idObj.parentOrgId ? idObj.parentOrgId : "parentOrgId", { initialValue: this.props.formData.parentOrgId ? this.props.formData.parentOrgId : null }) }/>
                        </FormItem>
                    </Col>
                </Row>
                </div>
                <Row>
                    <Col sm={24} md={24}>
                        <FormItem label="机构编号：" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} >
                            <Input maxLength="20" {...(this.props.oprType === 1 ? null : itemDisable) } {...orgId} placeholder="请输入机构编号"/>
                        </FormItem>
                     </Col>
                </Row>
                <Row>
                    <Col sm={24} md={24}>
                        <FormItem label="机构名：" labelCol={{ span: 6 }}  wrapperCol={{ span: 14 }} >
                                <Input {...nameProps} maxLength="20" placeholder="请输入机构名"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col sm={24} md={24}>
                        <FormItem
                            label="描述：" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
                            <Input type="textarea" placeholder="机构描述"
                            {...orgDesc }/>
                        </FormItem>  
                    </Col>
                </Row>                      
            </Form>
        );
    }
}

const noop = () => { };
AuthAgtAddModalForm.defaultProps = {
    valid: false,        //校验状态，通过父页面修改该值触发componentWillReceiveProps方法
    idObj: {},          //ID属性对象
    oprType: 0,         //操作类型 0：默认值 1：新增 2：修改 3详情：
    formData: {},        //父页面表单数据
    validCallback: noop, //回调函数
    formReset: false     //表单重置标识位
}

AuthAgtAddModalForm = Form.create()(AuthAgtAddModalForm);
export default AuthAgtAddModalForm;