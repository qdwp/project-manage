import React from 'react';
import { Row, Col, Form, Input, Button, Icon, Select } from 'antd';
import { filterObject } from '../../common/util';

const Option = Select.Option;

class ProjectMemberAppendSearch extends React.Component {
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
          <Col sm={12} md={10}>
            <FormItem label='登录用户' {...formItemLayout}>
              <Input maxLength={20} {...getFieldProps('userId') } />
            </FormItem>
          </Col>
          <Col sm={12} md={10}>
            <FormItem label='成员姓名' {...formItemLayout}>
              <Input maxLength={20} {...getFieldProps('userName') } />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 12, offset: 12 }} md={{ span: 8, offset: 16 }} style={{ textAlign: 'right' }}>
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
ProjectMemberAppendSearch.defaultProps = {
  onSubmit: noop,
  onReset: noop,
};

ProjectMemberAppendSearch = Form.create()(ProjectMemberAppendSearch);
export default ProjectMemberAppendSearch;
