import React from "react"
import { Row, Col, Form, Input, DatePicker, Select, Button,TreeSelect,Tree } from "antd";
import { filterObject } from "../../../common/util";
import { callAjax } from '../../../common/util';
import { tddefUrl } from "../../../config/server";
import { rspInfo } from "../../../common/authConstant";
import { openNotice } from "../../../common/antdUtil";
import QueueAnim from "rc-queue-anim";
const TreeNode = Tree.TreeNode;


/**
 * Demo00 示例查询条件表单
 * 
 * Auth：yujun Time：2016-04-25
 */
class AuthUserManageSearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            advSearchShow: false,
            value: "",
            treeData:[]
        }
    }
    //组件构建完成时触发
    componentDidMount() {
        let opt={
            url:tddefUrl.authOrg.selectDropdownListTree,
            type:"POST",
            dataType:"json",
            data:{}
        };
        let obj = this;
        callAjax(opt,function(result){
            if(result.rspCod === rspInfo.RSP_SUCCESS){
                obj.setState({
                    treeData:result.rspData.list
                });
            }else{
                openNotice("error",result.rspMsg,"查询机构信息失败");
            }
        },function(req, info, opt){
            console.log(info);
            openNotice("error",rspInfo.RSP_NETWORK_ERROR,"提示");
        });
    }
    //事件控制相关方法
    //点击“高级搜索”事件
    handleAdvLinkClick() {
        this.setState({
            advSearchShow: !this.state.advSearchShow
        });
    }
    onChange(value) {
        console.log(arguments);
        this.setState({ value });
    }
    render() {
        //定义变量和参数
        const FormItem = Form.Item;
        const { onSubmit, onReset } = this.props;
        const { getFieldProps } = this.props.form;
        
        //定义虚拟DOM代码片段
        const advSearchVDom = [
            
        ];
        const usrStatus = getFieldProps("usrStatus", {
            initialValue: ""
        });
        //所属机构
        const orgId = getFieldProps("orgId", {
            initialValue: "",
            value: this.props.value
        });
        const loopTreeSelect = data => data.map((item) => {
            if (item.children) {
                return (
                <TreeNode value={item.value} key={item.key} title={item.orgName} disabled={item.key === 'RootOrg'}>
                    {loopTreeSelect(item.children)}
                </TreeNode>
                );
            }
            return <TreeNode value={item.value} key={item.key} title={item.orgName}/>;
        });
        //渲染虚拟DOM
        return (
            <Form horizontal className="advanced-search-form">
                <Row>
                    <Col sm={12} md={6}>
                        <FormItem label="用户名：" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <Input placeholder="请输入用户名" {...getFieldProps("usrName")} />
                        </FormItem>
                    </Col>
                    <Col sm={12} md={6}>
                        <FormItem label="用户姓名：" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <Input placeholder="请输入用户姓名" {...getFieldProps("usrRealName")} />
                        </FormItem>
                    </Col>
                    <Col sm={12} md={6}>
                        <FormItem label="用户状态：" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <Select {...usrStatus}>
                                <Select.Option value="">请选择</Select.Option>
                                <Select.Option value="0">禁用</Select.Option>
                                <Select.Option value="1">启用</Select.Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={6}>
                       <FormItem  label="所属机构：" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}> 
                            <TreeSelect {...orgId} 
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择"
                                treeDefaultExpandAll >
                                <TreeNode value="" key="default" title="请选择"/>
                                {loopTreeSelect(this.props.treeData)}
                             </TreeSelect>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <QueueAnim key="adv-search" type={["right", "left"]} ease={["easeOutQuart", "easeInOutQuart"]}>
                            {this.state.advSearchShow === true ? advSearchVDom : null}
                        </QueueAnim>
                    </Col>
                </Row>
                <Row>
                    <Col sm={{span: 12, offset: 12}} md={{span: 6, offset: 18}} style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit" onClick={(e) => {
                            e.preventDefault();
                            onSubmit(filterObject(this.props.form.getFieldsValue()));
                        }}>搜索</Button>
                        <Button onClick={(e) => {
                            e.preventDefault();
                            this.props.form.resetFields();
                            onReset();
                        }}>重置</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const noop = () => {};
//定义组件标签的可配置属性
AuthUserManageSearchForm.defaultProps = {
    onSubmit: noop,
    onReset: noop,
    treeData:[]
};

AuthUserManageSearchForm = Form.create()(AuthUserManageSearchForm);
export default AuthUserManageSearchForm;