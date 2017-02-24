import React from 'react';
import { Row, Col, Form, Input, Button, Icon, Select } from 'antd';
import { filterObject } from '../../common/util';

const Option = Select.Option;

class ProjectManageSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advSearchShow: false,
      formData: {},
    };
  }

  render() {
    const FormItem = Form.Item;
    const { onSubmit, onReset } = this.props;
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form horizontal className="advanced-search-form">
        <Row>
          <Col sm={12} md={6}>
            <FormItem label='项目编号' {...formItemLayout}>
              <Input maxLength={20} {...getFieldProps('proId') } />
            </FormItem>
          </Col>
          <Col sm={12} md={6}>
            <FormItem label='项目名称' {...formItemLayout}>
              <Input maxLength={20} {...getFieldProps('proName') } />
            </FormItem>
          </Col>
          <Col sm={12} md={6}>
            <FormItem label='项目类型' {...formItemLayout}>
              <Select {...getFieldProps('proType', { initialValue: '' }) } >
                <Option value="">请选择</Option>
                <Option value="1">项目类型1</Option>
                <Option value="2">项目类型2</Option>
                <Option value="3">项目类型3</Option>
                <Option value="4">项目类型4</Option>
              </Select>
            </FormItem>
          </Col>
          <Col sm={12} md={6}>
            <FormItem label='是否启用' {...formItemLayout}>
              <Select {...getFieldProps('proUse', { initialValue: '' }) } >
                <Option value="">请选择</Option>
                <Option value="1">启用</Option>
                <Option value="0">禁用</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 12, offset: 12 }} md={{ span: 6, offset: 18 }} style={{ textAlign: 'right' }}>
            <Button type='primary' htmlType='submit'
              onClick={(e) => {
                e.preventDefault();
                onSubmit(filterObject(this.props.form.getFieldsValue()));
              }}
            ><Icon type="search" />搜索</Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                this.props.form.resetFields();
                onReset();
              }}
            >重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const noop = () => { };
// 定义组件标签的可配置属性
ProjectManageSearchForm.defaultProps = {
  onSubmit: noop,
  onReset: noop,
};

ProjectManageSearchForm = Form.create()(ProjectManageSearchForm);
export default ProjectManageSearchForm;
