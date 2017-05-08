import './Home.less';
import React from 'react';
import { Row, Col } from 'antd';
import TdCodeBox from '../../component/TdCodeBox';
import TdCard from '../../component/TdCard';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div>
        <h2>首页&nbsp; -&nbsp; 基于React前端的项目管理系统</h2><br />
        <Row gutter={16}>
          <Col sm={24} md={24}>
            <Row>
              <Col span="24">
                <TdCard hideHead="true" shadow="true" style={{ height: 400 }}>
                  <h3>系统说明</h3><br />
                  <TdCodeBox title="Describe" desc="">
                    棠棣支付运营管理权限系统，将权限管理与运营管理分开，权责清晰，负责整个系统的机构、角色、人员管理，并提供日志查看、调度控制及分布式框架DUBBO服务的监控。详细功能参阅左侧菜单。
                                    </TdCodeBox>
                </TdCard>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
