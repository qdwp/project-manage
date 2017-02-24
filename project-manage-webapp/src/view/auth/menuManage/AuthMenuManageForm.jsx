import React from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { filterObject } from '../../../common/util';
import TdSelect from '../../../component/TdSelect';
import { requestSelectData } from '../../../common/util';
import { tdpub } from '../../../config/server';

class AuthMenuManageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advSearchShow: false,
      selectParams: {},
    };
  }
  // 组件加载完成时触发该事件
  componentDidMount() {
    // 加载下拉框数据
    requestSelectData(tdpub.dict.qryDictMutiList, { type: ['SYS_ID'], isSpace: true }, false, (oRes) => {
      this.setState({
        selectParams: oRes,
      });
    });
  }
  render() {
    // 定义变量和参数
    const FormItem = Form.Item;
    const { onSubmit, onReset } = this.props;
    const { getFieldProps } = this.props.form;
    const sysId = getFieldProps('sysId', { initialValue: '009' });
    // 渲染虚拟DOM
    return (
      <Form horizontal className='advanced-search-form'>
        <Row>
          <Col sm={12} md={6}>
            <FormItem label='菜单名称：' labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              <Input placeholder='请输入菜单名称' {...getFieldProps('itmName')} />
            </FormItem>
          </Col>
          <Col sm={12} md={6}>
            <FormItem label='所属系统：' labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
              <TdSelect {...sysId} noblank dict={{ dict_value: 'value', dict_text: 'text' }} data={this.state.selectParams.SYS_ID}/>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 12, offset: 12 }} md={{ span: 6, offset: 18 }} style={{ textAlign: 'right' }}>
            <Button type='primary' htmlType='submit' onClick={(e) => {
              e.preventDefault();
              onSubmit(filterObject(this.props.form.getFieldsValue()));
            }}
            >搜索</Button>
            <Button onClick={(e) => {
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

const noop = () => {};
// 定义组件标签的可配置属性
AuthMenuManageForm.defaultProps = {
  onSubmit: noop,
  onReset: noop,
};

AuthMenuManageForm = Form.create()(AuthMenuManageForm);
export default AuthMenuManageForm;
