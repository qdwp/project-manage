import React from 'react';
import { Row, Col, Form, Input, Button, Icon, DatePicker } from 'antd';
import { filterObject } from '../../common/util';
import TdSelect from '../../component/TdSelect';
import QueueAnim from 'rc-queue-anim';

const RangePicker = DatePicker.RangePicker;

class BugManageSearchForm extends React.Component {
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

  // 点击“高级搜索”事件
  handleAdvLinkClick() {
    this.setState({
      advSearchShow: !this.state.advSearchShow,
    });
  }

  handleTimeChange(date, dateString) {
    this.props.form.setFieldsValue({ createStart: dateString[0], createEnd: dateString[1] });
  }

  render() {
    const FormItem = Form.Item;
    const { onSubmit, onReset } = this.props;
    const { getFieldProps, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const bugLevel = [
      { value: 'Critical', text: 'Critical 致命问题[系统崩溃,需求不符]' },
      { value: 'Major', text: 'Major 严重问题[功能不全,计算错误]' },
      { value: 'Normal', text: 'Normal 一般问题[界面操作,信息不准]' },
      { value: 'Minor', text: 'Minor 微小问题[提示错误,格式规范]' },
      { value: 'Trivial', text: 'Trivial 轻微问题[描述不清,提出建议]' },
    ];
    const bugStatus = [
      { value: 'created', text: 'created 创建' },
      { value: 'assigned', text: 'assigned 认领' },
      { value: 'solved', text: 'solved 解决' },
      { value: 'closed', text: 'closed 关闭' },
    ];

    const advSearchVDom = [
      <Row key = 'adv-1'>
        <Col sm={24} md={8}>
          <FormItem label='BUG级别' {...formItemLayout}>
            <TdSelect
              {...getFieldProps('bugLevel', { initialValue: '' }) }
              dict={{ dict_value: 'value', dict_text: 'text' }}
              data={bugLevel} blankText="-- 请选择 --"
            />
          </FormItem>
        </Col>
        <Col sm={24} md={8}>
          <FormItem label='处理状态' {...formItemLayout}>
            <TdSelect
              {...getFieldProps('bugStatus', { initialValue: '' }) }
              dict={{ dict_value: 'value', dict_text: 'text' }}
              data={bugStatus} blankText="-- 请选择 --"
            />
          </FormItem>
        </Col>
        <Col sm={24} md={8}>
          <FormItem label='经办人' {...formItemLayout}>
            <Input placeholder="请输入经办人" maxLength={20} {...getFieldProps('handleBy') } />
          </FormItem>
        </Col>
      </Row>,
      <Row key = 'adv-2'>
        <Col sm={24} md={8}>
          <FormItem label='创建人' {...formItemLayout}>
            <Input placeholder="请输入创建人" maxLength={20} {...getFieldProps('createBy') } />
          </FormItem>
        </Col>
        <Col sm={24} md={8}>
          <FormItem label='创建时间' {...formItemLayout}>
            <RangePicker placeholder="请选择创建时间" style={{ width: '100%' }} format="yyyy-MM-dd"
              onChange={this.handleTimeChange.bind(this)}
              value={[getFieldValue('createStart'), getFieldValue('createEnd')]}
              defaultValue={[...getFieldProps('createStart'), ...getFieldProps('createEnd')]}
            />
          </FormItem>
        </Col>
      </Row>,
    ];
    return (
      <Form horizontal className="advanced-search-form">
        <Row>
          <Col sm={24} md={8}>
            <FormItem label='项目名称' {...formItemLayout}>
              <Input placeholder="请输入项目名称" maxLength={20} {...getFieldProps('proName') } />
            </FormItem>
          </Col>
          <Col sm={24} md={8}>
            <FormItem label='模块名称' {...formItemLayout}>
              <Input placeholder="请输入模块名称" maxLength={20} {...getFieldProps('modName') } />
            </FormItem>
          </Col>
          <Col sm={24} md={8}>
            <FormItem label='BUG主题' {...formItemLayout}>
              <Input placeholder="请输入BUG主题" maxLength={20} {...getFieldProps('bugTitle') } />
            </FormItem>
          </Col>
        </Row>
        <Row key = 'adv-5' gutter={24}>
          <Col span='24'>
            <QueueAnim key='adv-search'
              type={['right', 'left']}
              ease={['easeOutQuart', 'easeInOutQuart']}
            >{this.state.advSearchShow === true ? advSearchVDom : null}</QueueAnim>
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 12, offset: 12 }} md={{ span: 6, offset: 18 }} style={{ textAlign: 'right' }}>
            <a href='javascript:void(0)' style={{ paddingTop: 10, paddingRight: 10, fontSize: 12 }}
              onClick={this.handleAdvLinkClick.bind(this) }
            >{this.state.advSearchShow === true ? '基本搜索' : '高级搜索'}&nbsp; <Icon type={this.state.advSearchShow === true ? 'up' : 'down'} style={{ fontSize: 10 }} /></a>
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
BugManageSearchForm.defaultProps = {
  onSubmit: noop,
  onReset: noop,
};

BugManageSearchForm = Form.create()(BugManageSearchForm);
export default BugManageSearchForm;
