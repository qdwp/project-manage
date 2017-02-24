import React from "react"
import { Row, Col, Form, Input, DatePicker, Select, Button, } from "antd";
import QueueAnim from "rc-queue-anim";
import { filterObject } from "../../../common/util";
import TdSelect from "../../../component/TdSelect";
import {requestSelectData} from "../../../common/util";
import { tdpub } from "../../../config/server";
/**
 * Demo00 角色管理
 *
 * Auth：yujun Time：2016-04-25
 */
class AuthRoleManageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            advSearchShow: false,
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
    //事件控制相关方法
    //点击“高级搜索”事件
    handleAdvLinkClick() {
        this.setState({
            advSearchShow: !this.state.advSearchShow
        });
    }

    render() {
        //定义变量和参数
        const FormItem = Form.Item;
        const { onSubmit, onReset } = this.props;
        const { getFieldProps } = this.props.form;

        //定义虚拟DOM代码片段
        const advSearchVDom = [
            
        ];
        const isUse = getFieldProps("isUse", {
            initialValue: ""
        });
        //系统id校验
        const sysId = getFieldProps("sysId", {
            initialValue: ""
        });
        //渲染虚拟DOM
        return (
            <Form horizontal className="advanced-search-form">
                <Row>
                    <Col sm={12} md={6}>
                        <FormItem label="角色名称：" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <Input placeholder="请输入角色名称" {...getFieldProps("roleName")} />
                        </FormItem>
                    </Col>
                    <Col sm={12} md={6}>
                        <FormItem label="所属系统：" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            
                            <TdSelect {...sysId} 
                                blankText="请选择"
                                dict={{ dict_value: "value", dict_text: "text"}}
                                data={this.state.selectParams.SYS_ID}/>
                        </FormItem>
                    </Col>
                    <Col sm={12} md={6}>
                        <FormItem label="角色状态：" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                            <Select initialValue="" {...isUse}>
                                <Select.Option value="">请选择</Select.Option>
                                <Select.Option value="0">禁用</Select.Option>
                                <Select.Option value="1">启用</Select.Option>
                            </Select>
                        </FormItem>
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
AuthRoleManageForm.defaultProps = {
    onSubmit: noop,
    onReset: noop
};

AuthRoleManageForm = Form.create()(AuthRoleManageForm);
export default AuthRoleManageForm;
