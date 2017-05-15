import React from 'react';
import { Row, Col, Form, Input, Button, Icon, Select, DatePicker } from 'antd';
import { filterObject } from '../../common/util';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class DownloadManageSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advSearchShow: false,
      formData: {},
    };
  }

  handleTimeChange(date, dateString) {
    console.log('From: ', dateString[0], ', to: ', dateString[1]);
    this.props.form.setFieldsValue({ uploadStart: dateString[0], uploadEnd: dateString[1] });
  }

  render() {
    const FormItem = Form.Item;
    const { onSubmit, onReset } = this.props;
    const { getFieldProps, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form horizontal className="advanced-search-form">
        <Row>
          <Col sm={24} md={8}>
            <FormItem label='项目名称' {...formItemLayout}>
              <Input maxLength={20} {...getFieldProps('proName') } />
            </FormItem>
          </Col>
          <Col sm={24} md={8}>
            <FormItem label='文件名' {...formItemLayout}>
              <Input maxLength={20} {...getFieldProps('fileName') } />
            </FormItem>
          </Col>
          <Col sm={24} md={8}>
            <FormItem label='上传时间' {...formItemLayout}>
              <RangePicker placeholder="请选择上传时间" style={{ width: '100%' }} format="yyyy-MM-dd"
                onChange={this.handleTimeChange.bind(this)}
                value={[getFieldValue('uploadStart'), getFieldValue('uploadEnd')]}
                defaultValue={[...getFieldProps('uploadStart'), ...getFieldProps('uploadEnd')]}
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
DownloadManageSearchForm.defaultProps = {
  onSubmit: noop,
  onReset: noop,
};

DownloadManageSearchForm = Form.create()(DownloadManageSearchForm);
export default DownloadManageSearchForm;
