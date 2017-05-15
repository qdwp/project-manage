import React from 'react';
import { Row, Col, Form, Input, Button, Icon, DatePicker } from 'antd';
import { filterObject } from '../../../common/util';

class ModuleManageSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advSearchShow: false,
      formData: {},
    };
  }

  handleLimitTimeChange(date, string) {
    console.log(date, string);
    this.props.form.setFieldsValue({ limitTime: string });
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
            <FormItem label='项目名称' {...formItemLayout}>
              <Input placeholder="请输入项目名称" maxLength={20} {...getFieldProps('proName') } />
            </FormItem>
          </Col>
          <Col sm={12} md={6}>
            <FormItem label='模块名称' {...formItemLayout}>
              <Input placeholder="请输入模块名称" maxLength={20} {...getFieldProps('modName') } />
            </FormItem>
          </Col>
          <Col sm={12} md={6}>
            <FormItem label='负责成员' {...formItemLayout}>
              <Input placeholder="请输入模块名称" maxLength={20} {...getFieldProps('userName') } />
            </FormItem>
          </Col>
          <Col sm={12} md={6}>
            <FormItem label='任务时限' {...formItemLayout}>
              <DatePicker {...getFieldProps('limitTime', { initialValue: '' })}
                onChange={ this.handleLimitTimeChange.bind(this) }
                placeholder="请选择结束日期" style={{ width: '100%' }} format="yyyy-MM-dd"
              />
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
ModuleManageSearchForm.defaultProps = {
  onSubmit: noop,
  onReset: noop,
};

ModuleManageSearchForm = Form.create()(ModuleManageSearchForm);
export default ModuleManageSearchForm;
