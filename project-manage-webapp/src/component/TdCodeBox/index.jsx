import './index.less';
import React from 'react';
import { Icon } from 'antd';

/**
 * <TdCodeBox>其他标签或组件，如：<div>yyy</div></TdCodeBox>
 * 
 * 标签属性：
 * title: 标题(默认Title)
 * desc: 描述(默认空格,支持HTML)
 * 
 * Auth: yujun  Time: 2016-04-21
 */
class TdCodeBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //使用标签定义的属性
        const { title, desc } = this.props;
        return (
            <div className="td-code-box">
                <div className="td-code-box-demo">
                    {this.props.children}
                </div>
                <div className="td-code-box-meta td-code-box-markdown">
                    <div className="td-code-box-title">
                        <Icon type="tag" />&nbsp;{title}
                    </div>
                    <p dangerouslySetInnerHTML={{__html: desc}}></p>
                </div>
            </div>
        );
    }
}

//定义组件标签的可配置属性
TdCodeBox.defaultProps = {
  title: "Title",
  desc: "&nbsp;"
};

export default TdCodeBox;