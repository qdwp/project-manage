import React,{ PropTypes }  from 'react';
import MD5 from 'crypto-js/md5';
import {Row, Col, Form, Input, Select, Button, Checkbox, Icon, InputNumber, Radio ,TreeSelect,Tree } from 'antd';
import TdCard from "../../../component/TdCard";
import { callAjax ,filterObject,getLoginInfo,setLoginInfo} from '../../../common/util';
import { tddefUrl } from "../../../config/server";
import { rspInfo } from "../../../common/authConstant";
import { openNotice } from "../../../common/antdUtil";
import { loginUrl } from  "../../../config/url";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;

/**
 * 更改密码
 *
 * Auth:li.sy  Time:2016-07-04
 */
class AuthUpdPwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: false,
            value: "",
            treeData:[],
            buttonLoading:false//修改密码成功返回登录页面时，确定按钮处于loading状态，不能点击
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
    handleSubmit(){
         this.props.form.validateFields((errors, data) => {
            //data.orgId = this.state.value;
            console.log("error = "+errors);
            if(!!errors){
                console.log("子表单校验失败",data);
                return;
            }else{
                console.log("子表单校验成功");
                this.realSubmit();
            }
            
        });
       
    }

    realSubmit(){
         let data = filterObject(this.props.form.getFieldsValue());
        callAjax({
            url: tddefUrl.authUsr.updatePwd,
            data: {
                usrPsw:MD5(data.newPwd).toString(),
                oldPwd:MD5(data.oldPwd).toString()
            },
        }, (result) => {
            if (result.rspCod === rspInfo.RSP_SUCCESS) {
                this.setState({
                    modalVisible:false,
                    confirmLoading: false,
                    buttonLoading:true
                },()=>{
                    let info = getLoginInfo();
                    info.isFirstLogin=0;
                    setLoginInfo(info);
                    this.props.form.resetFields();
                });
                openNotice('success', '修改密码成功，即将跳转到登录页面');
                setTimeout(() => {
                    window.location.href = loginUrl;
                }, 2000);  
            }else{
                openNotice("error",result.rspMsg,"提示");
                this.setState({
                    confirmLoading: false
                });
            }
        });
    }

    handleReset(){
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
        //旧密码校验
        const oldPwd = getFieldProps("oldPwd", {
            initialValue: '',
            validate: [{
                rules: [
                    { required: true, message: '旧密码不能为空',whitespace: true }
                ],
                trigger: 'onBlur'

            }],
            validateFirst:true
        });
        const newPwd = getFieldProps("newPwd", {
            initialValue: '',
            validate: [{
                rules: [
                    { required: true, message: '新密码不能为空',whitespace: true },
                    { max:10,message:'密码最大10位'}
                ],
                trigger: 'onBlur'
            }],
            validateFirst:true
        });
        const newPwdRepeat = getFieldProps("newPwdRepeat", {
            initialValue: '',
            validate: [{
                rules: [
                    { required: true, message: '确认密码不能为空',whitespace: true },
                    { max:10,message:'密码最大10位'},
                    { validator: this.checkPass2.bind(this)}
                ],
                trigger: 'onBlur'

            }],
            validateFirst:true
        });
        return (
            <TdCard shadow>
            <div style={{maxWidth: 600, margin: "auto"}}>
            <Form className="compact-form" horizontal form={this.props.form}>
                <Row>
                    <Col sm={24} md={24}>
                        <FormItem label="请输入旧密码：" {...formItemLayout}>
                            <Input type="password" placeholder="请输入旧密码"  maxLength="10" {...oldPwd} />
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
                        <FormItem  label="请再次输入新密码：" {...formItemLayout}>
                            <Input type="password" placeholder="请再次输入新密码"  maxLength="10"  {...newPwdRepeat} />
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

const noop = () => { };
AuthUpdPwd.defaultProps = {
    valid: false,        //校验状态，通过父页面修改该值触发componentWillReceiveProps方法
    idObj: {},          //ID属性对象
    oprType: 0,         //操作类型 0：默认值 1：新增 2：修改 3详情：
    formData: {},        //父页面表单数据
    validCallback: noop, //回调函数
    formReset: false,     //表单重置标识位
    treeData:[]
}

//应用contextTypes(不做手工页面跳转则不需要)
AuthUpdPwd.contextTypes = {
    router: PropTypes.object.isRequired
};

AuthUpdPwd = Form.create()(AuthUpdPwd);
export default AuthUpdPwd;
