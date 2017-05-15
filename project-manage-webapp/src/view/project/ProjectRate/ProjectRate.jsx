import React from 'react';
import { Button, Progress, Col } from 'antd';
import TdCard from '../../../component/TdCard';
import { openNotice } from '../../../common/antdUtil';
import { url } from '../../../config/server';
import { rspInfo } from '../../../common/authConstant';
import { callAjax, getLoginInfo } from '../../../common/util';
const ButtonGroup = Button.Group;

class ProjectRate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      reset: [],
    };
  }

  // 页面组件加载完成时执行代码
  componentDidMount() {
    this.loadRateData();
  }

  loadRateData() {
    const opt = {
      url: url.rate.query,
      type: 'POST',
      data: {},
    };
    callAjax(opt, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        this.setState({
          data: result.rspData,
          reset: JSON.parse(JSON.stringify(result.rspData)),
        });
      } else {
        openNotice('error', result.rspInfo);
      }
    }, (rep, info, opt) => {
      openNotice('error', rspInfo.RSP_NETWORK_ERROR);
    });
  }

  handleDecline(item, i) {
    const data = this.state.data;
    let rate = data[i].TASK_RATE - 5;
    if (rate < 0) {
      rate = 0;
    }
    data[i].TASK_RATE = rate;
    this.setState({ data });
  }

  handleIncrease(item, i) {
    const data = this.state.data;
    let rate = data[i].TASK_RATE + 5;
    if (rate > 100) {
      rate = 100;
    }
    data[i].TASK_RATE = rate;
    this.setState({ data });
  }

  handleUpdateRate() {
    if (this.state.data.length === 0) {
      return;
    }
    const opt = {
      url: url.rate.update,
      type: 'POST',
      data: { data: JSON.stringify(this.state.data) },
    };
    callAjax(opt, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        openNotice('success', result.rspInfo);
        this.setState({
          reset: JSON.parse(JSON.stringify(this.state.data)),
        });
        this.loadRateData();
      } else {
        openNotice('error', result.rspInfo);
      }
    }, (rep, info, opt) => {
      openNotice('error', rspInfo.RSP_NETWORK_ERROR);
    });
  }

  handleResetRate() {
    this.setState({ data: JSON.parse(JSON.stringify(this.state.reset)) });
  }


  render() {
    // 定义变量和参数
    const obj = this;
    // 渲染虚拟DOM
    return (
      <div>
        <TdCard hideHead="true" shadow="true">
          <h3>更新进度</h3>
          <hr />
          <div>
          {
            obj.state.data.map((item, i) => {
              return (
                <div key={i}>
                  <div>
                    <font size="4" color="#63B8FF">{item.PRO_NAME}</font> - <font size="4" color="#63B8FF">{item.MODULE_NAME}</font>
                    <br />
                    <Col sm={24} md={12}>
                      <span>起止时间: {item.MODULE_START} ~ {item.MODULE_END}</span>
                    </Col>
                    <Col sm={24} md={12}>
                      <span>最后更新时间: {item.UPDATE_TIME}</span>
                    </Col>
                  </div>
                  <div>
                    <span>完成进度: </span>
                    <Progress style={{ width: '80%' }} percent={item.TASK_RATE} />
                    <ButtonGroup style={{ marginLeft: '20px' }}>
                      <Button id={i} type="ghost" onClick={() => {obj.handleDecline(item, i);}} icon="minus" />
                      <Button id={i} type="ghost" onClick={() => {obj.handleIncrease(item, i);}} icon="plus" />
                    </ButtonGroup>
                  </div>
                </div>
              );
            })
          }
            <hr />
            <Col sm={24} md={24} style={{ textAlign: 'right' }} >
            <div hidden={this.state.data.length === 0}>
              <Button style={{ marginRight: '10px' }} type="primary" icon="export"
                onClick={obj.handleUpdateRate.bind(obj)}
              >确认更新</Button>
              <Button style={{ marginRight: '40px' }} type="ghost" icon="reload"
                onClick={obj.handleResetRate.bind(obj)}
              >重置进度</Button>
              </div>
            </Col>
          </div>
        </TdCard>
      </div>
    );
  }
}

export default ProjectRate;
