import './index.less';
import React from 'react';
import { Input, Button } from 'antd';

/**
 * <TdIconInput position='...' icon='...' />
 * 标签属性：
 * position：图标位置(默认'right')
 * size：尺寸(默认'large' Form下的input的size无效, bug)
 * icon：图标(默认'')
 * 其他属性同antd的Input组件
 * Auth: yujun  Time: 2016-05-16
 */
class TdIconInput extends React.Component {
  render() {
    const { style, size, position, icon, ...restProps } = this.props;
    const btnStyle = position === 'left' ? {
      borderWidth: '0 1px 0 0',
      borderRadius: '6px 0 0 6px',
      left: 1,
    } : {
      borderWidth: '0 0 0 1px',
      borderRadius: '0 6px 6px 0',
      right: 1,
    };
    const inputStyle = position === 'left' ? {
      paddingLeft: '37px',
    } : {};

    let antdSize = size;
    if (size === 'xlarge') {
      antdSize = 'large';
      inputStyle.height = '40px';
      btnStyle.padding = '8px';
      btnStyle.fontSize = '14px';
    }

    return (
      <div className='td-icon-input' style={style}>
        <Button className='td-icon-button' tabIndex='-1' style={btnStyle} icon={icon} size={antdSize} />
        <Input {...restProps} style={inputStyle} size={antdSize} />
      </div>
    );
  }
}

// 定义组件标签的可配置属性
TdIconInput.defaultProps = {
  style: {},
  position: 'right',
  size: 'large',
  icon: '',
};

export default TdIconInput;
