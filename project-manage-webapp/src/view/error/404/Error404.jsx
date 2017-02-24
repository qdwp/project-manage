import React from 'react';
import { Icon } from 'antd'
import TdCard from '../../../component/TdCard';

class Error404 extends React.Component {
  render() {
    const linkStyle = { color: "#666", fontWeight: "bold", fontStyle: "italic", textDecoration: "underline" };
    return (
      <TdCard hideHead shadow contentStyle={{ textAlign: "center" }}>
        <h2>ERROR&nbsp; 404</h2>
        <p className="br" />
        <h2>
          <Icon type="frown-circle" style={{ fontSize: 28 }}/>
          &nbsp; 抱歉，您访问的页面不存在
        </h2>
        <p className="br" />
        <a href="javascript:void(0)" style={linkStyle} onClick={ () => {
          history.go(-1);
        } }>返回上一页</a>
      </TdCard>
    )
  }
}

export default Error404;