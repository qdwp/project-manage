import './index.less';
import React from 'react';
import { Icon, Transfer } from 'antd';
import JsHelper from '../lib/JsHelper';

class TdTransfer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      curTargetKeys: props.targetKeys,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.targetKeys.toString() !== nextProps.targetKeys.toString()) {
      this.setState({
        curTargetKeys: nextProps.targetKeys,
      });
    }
  }

  handleUpClick(ev, key) {
    ev.preventDefault();
    ev.stopPropagation();
    const idx = JsHelper.getArrayItemIndex(this.state.curTargetKeys, key);
    if (idx > 0) {
      const arr = JsHelper.swapArrayItems(this.state.curTargetKeys, idx, idx - 1);
      this.setState({
        curTargetKeys: arr.concat(),
      });
    }
  }
  handleDownClick(ev, key) {
    ev.preventDefault();
    ev.stopPropagation();
    const idx = JsHelper.getArrayItemIndex(this.state.curTargetKeys, key);
    if (idx < this.state.curTargetKeys.length - 1) {
      const arr = JsHelper.swapArrayItems(this.state.curTargetKeys, idx + 1, idx);
      this.setState({
        curTargetKeys: arr.concat(),
      });
    }
  }
  handleChange(targetKeys, direction, moveKeys) {
    this.setState({
      curTargetKeys: targetKeys,
    }, () => {
      this.props.onChange(targetKeys, direction, moveKeys);
    });
  }

  renderList(item) {
    const { key } = this.props;
    const isRight = this.state.curTargetKeys.includes(item.key);
    const label = (
      <span>{item[key]}
        {
          !isRight ? null :
          [
            <Icon key={`${item.key}-up`} type='arrow-up' onClick={ (ev) => {
              this.handleUpClick(ev, item.key);
            } }
            />,
            <Icon key={`${item.key}-down`} type='arrow-down' onClick={ (ev) => {
              this.handleDownClick(ev, item.key);
            } }
            />,
          ]
        }
      </span>
    );
    return {
      label,
      value: item[key],
    };
  }

  render() {
    const { dataSource, listStyle, ...restProps } = this.props;
    return (
      <div className='td-transfer'>
        <Transfer {...restProps} listStyle={listStyle} dataSource={dataSource} targetKeys={this.state.curTargetKeys} render={this.renderList.bind(this)} onChange={this.handleChange.bind(this)} />
      </div>
    );
  }
}

// 定义组件标签的可配置属性
TdTransfer.defaultProps = {
  key: 'title',
  upDown: true,
  curTargetKeys: [],
  dataSource: [],
  onChange: () => {},
  listStyle: {
    width: 200,
    height: 240,
  },
};

export default TdTransfer;
