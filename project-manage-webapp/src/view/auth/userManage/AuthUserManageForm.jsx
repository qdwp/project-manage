import React from 'react';
import {Row, Col, Form, Input, Select, Button, Checkbox, Icon, InputNumber, Radio ,TreeSelect,Tree } from 'antd';
import { callAjax } from '../../../common/util';
import { userRealNameValidate } from '../../../common/validUtil';
import { tddefUrl } from "../../../config/server";
import { rspInfo } from "../../../common/authConstant";
import { openNotice } from "../../../common/antdUtil";
import "./style.less";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;

/**
 * 指定用户限额管理 表单组件
 *
 * Auth:duxury  Time:2016-05-10
 */
class AuthUserManageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: false,
            value: "",
            treeData:[]
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
        console.log("formReset = "  + nextProps.formReset);
        //重置表单
        if (nextProps.formReset === true) {
            console.log("child component form reset.");
            this.props.form.resetFields();
            this.setState({
                value:""
            });
        }
    }

    //子页面表单校验
    validForm() {
        console.log("=====进入validForm");
        const { oprType, validCallback } = this.props;
        const obj = this;
        this.props.form.validateFields((errors, data) => {
            //data.orgId = this.state.value;
            console.log("error = "+errors);
            //执行父页面回调函数
            validCallback(oprType, errors, data);
        });
    }
    onChange(value) {
        console.log(arguments);
        this.setState({ value });
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };

        const { idObj, oprType, formData } = this.props;

        const { getFieldProps, isFieldValidating, getFieldError } = this.props.form;

        const itemDisable = {
            disabled: true
        }
        const itemHidden = {
            hidden: true
        }
        //表单校验
        //用户名id校验
        const usrId = getFieldProps(idObj.usrId ? idObj.usrId : "usrId", {
            initialValue: formData.usrId
        });
        //用户名校验
        const usrName = getFieldProps(idObj.usrName ? idObj.usrName : "usrName", {
            initialValue: formData.usrName,
            validate: [{
                rules: [
                    { required: true, message: '用户名不能为空',whitespace: true },
                    { pattern: /^[a-zA-Z0-9_.@]*$/g, message:'用户名由字母、数字、@、.符号组成'},
                    {max: 20, message: '用户名不能超过20位'},
                    {min: 2, message: '用户名不能小于2位'}
                ],
                trigger: 'onBlur'

            }],
            validateFirst:true
        });


        //用户真实姓名校验
        const usrRealName = getFieldProps(idObj.usrRealName ? idObj.usrRealName : "usrRealName", {
            initialValue: formData.usrRealName,
            validate: [{
                rules: [
                    { required: true, message: '用户真实姓名不能为空' ,whitespace: true},
                    { validator: userRealNameValidate},
                ],
                trigger: 'onBlur',
            }],
            validateFirst:true
        });
        //用户状态校验
        const usrStatus = getFieldProps(idObj.usrStatus ? idObj.usrStatus : "usrStatus", {
            initialValue: formData.usrStatus
        });
        //用户描述
        const usrDesc = getFieldProps(idObj.usrDesc ? idObj.usrDesc : "usrDesc", {
            initialValue: formData.usrDesc,
            validate: [{
                rules: [
                    { max: 100, message: '用户描述不能超过100个字符' ,whitespace: true}
                ],
                trigger: 'onBlur',
            }]
        });
        //所属机构
        const orgId = getFieldProps(idObj.orgId ? idObj.orgId : "orgId", {
            initialValue: formData.orgId,
            value: this.props.value,
            //validate: [{
            //    rules: [
            //      {required: true, type:'string',message: '所属机构不能为空'},
            //    ],
            //    trigger: 'onChange',
            //}]
        });
        const loopTreeSelect = data => data.map((item) => {
            if (item.children && item.isUse == 1) {
                return (
                <TreeNode value={item.value} key={item.key} title={item.orgName} disabled={item.key === 'RootOrg'}>
                    {loopTreeSelect(item.children)}
                </TreeNode>
                );
            }
            if(item.isUse == 1){
              return (<TreeNode value={item.value} key={item.key} title={item.orgName}/>);
            }else{
              //display: none;
              return (<TreeNode value={item.value} key={item.key} title={item.orgName} className="td-displayNone"  disabled={true}/>);
            }
        });

        return (
            <Form className="compact-form" horizontal form={this.props.form}>
                <div {...itemHidden}>
                <Row>
                    <Col sm={24} md={24}>
                        <FormItem label="用户编号：" {...formItemLayout}>
                            <Input placeholder="请输入用户编号"  {...usrId} {...(this.props.oprType === 2 || this.props.oprType === 3 ? itemDisable : null) }/>
                        </FormItem>
                    </Col>
                </Row>
                </div>
                <Row>
                    <Col sm={24} md={24}>
                        <FormItem label="用户名：" {...formItemLayout}>
                            <Input placeholder="请输入用户名" maxLength="20" {...usrName} {...(this.props.oprType === 2 || this.props.oprType === 3 ? itemDisable : null) }/>
                        </FormItem>
                    </Col>
                </Row>
              <Row>
                <Col sm={24} md={24}>
                  <FormItem  label="真实姓名：" {...formItemLayout}>
                    <Input placeholder="请输入用户真实姓名" maxLength="20"  {...usrRealName} {...(this.props.oprType === 3 ? itemDisable : null) }/>
                  </FormItem>
                </Col>
              </Row>
                <Row>
                    <Col sm={24} md={24}>
                        <FormItem  label="所属机构：" {...formItemLayout}>
                            <TreeSelect {...orgId} {...(this.props.oprType === 3 ?  itemDisable: null)}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择"
                                treeDefaultExpandAll >
                                {loopTreeSelect(this.props.treeData)}
                             </TreeSelect>
                        </FormItem>
                    </Col>
                </Row>

                <Row>
                    <Col sm={24} md={24}>
                        <div  {...(this.props.oprType === 3 ?  null: itemHidden)}>
                            <FormItem  label="用户状态：" {...formItemLayout}>
                                <RadioGroup {...usrStatus} {...(this.props.oprType === 3 ? itemDisable : null) }>
                                    <Radio value="1">启用</Radio>
                                    <Radio value="0">禁用</Radio>
                                </RadioGroup>
                            </FormItem>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={24} md={24}>
                        <FormItem label="描述：" {...formItemLayout}>
                            <Input type="textarea" maxLength="100" placeholder="用户描述" {...usrDesc}  {...(this.props.oprType === 3 ? itemDisable : null) }/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const noop = () => { };
AuthUserManageForm.defaultProps = {
    valid: false,        //校验状态，通过父页面修改该值触发componentWillReceiveProps方法
    idObj: {},          //ID属性对象
    oprType: 0,         //操作类型 0：默认值 1：新增 2：修改 3详情：
    formData: {},        //父页面表单数据
    validCallback: noop, //回调函数
    formReset: false,     //表单重置标识位
    treeData:[]
}

AuthUserManageForm = Form.create()(AuthUserManageForm);
export default AuthUserManageForm;
