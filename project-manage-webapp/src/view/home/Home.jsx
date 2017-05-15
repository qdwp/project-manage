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
        <h2>首页&nbsp; -&nbsp; 基于React前端的项目开发管理系统</h2><br />
        <Row gutter={16}>
          <Col sm={24} md={24}>
            <Row>
              <Col span="24">
                <TdCard hideHead="true" shadow="true" style={{ height: 400 }}>
                  <h3>系统说明</h3><br />
                  <TdCodeBox title="Describe" desc="">
                    <p>项目开发管理系统, 是一款致力于提升项目开发团队工作效率的管理系统. </p>
                    <br />
                    <p>本系统分为项目组长和项目成员两种主要角色, 项目小组内成员由组长添加. 组长负责创建一个新项目, 并未每个小组内成员分配任务, 小组成员能看到自己所属项目以及负责的任务模块. 并能随时更新任务进度. </p>
                    <br />
                    <p>同时, 小组内的所有成员均有权利和义务检测项目内BUG, 创建并提交项目测试BUG, 并认领修改, 调试公告栏能看到所有项目成员对项目的更新信息. </p>
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
