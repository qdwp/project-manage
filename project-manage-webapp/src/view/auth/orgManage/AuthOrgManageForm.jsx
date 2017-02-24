import React from "react"
import { Row, Col, Form, Input, Select, Button } from "antd";
import QueueAnim from "rc-queue-anim";
import { filterObject } from "../../../common/util";
const Option = Select.Option;
/**
 * AuthOrgManageForm 示例查询条件表单
 * 
 * 
 */
class AuthOrgManageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            advSearchShow: false
        }
    }
    
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
        
        //渲染虚拟DOM
        return (
            <Form horizontal className="advanced-search-form">
                <Row>

                    <Col sm={12} md={6}>
                    <FormItem label="机构名称：" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                        <Input placeholder="请输入机构名称" {...getFieldProps("orgName")} />
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
AuthOrgManageForm.defaultProps = {
    onSubmit: noop,
    onReset: noop
};

AuthOrgManageForm = Form.create()(AuthOrgManageForm);
export default AuthOrgManageForm;