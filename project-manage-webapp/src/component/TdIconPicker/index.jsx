import './index.less';
import React from 'react';
import { Tabs, Input, Icon } from 'antd';
import Icons from './index.json';

/**
 * <TdIconPicker>组件
 * 用于选择图标
 * 目前无法通过Form统一取值，需通过设置onPick事件获取
 * 标签属性：
 * onPick: 选中图标事件
 * 其他属性同Input
 * Auth: yujun  Time: 2016-08-08
 * Update: yujun  Time: 2016-08-09
 */
class TdIconPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curType: 0,
      curIcons: Icons[0].icons,
      pickerVisible: false,
      value: props.initialValue || props.defaultValue || props.value || '',
    };
  }

  handleInputClick(ev) {
    ev.preventDefault();
    this.setState({ pickerVisible: !this.state.pickerVisible });
  }
  handleBtnClick(ev, type) {
    ev.preventDefault();
    this.setState({
      curType: type,
      curIcons: Icons[type].icons,
    });
  }
  handleIconClick(ev) {
    ev.preventDefault();
    const obj = (ev.srcElement || ev.target);
    const icon = obj.childNodes.length > 0 ? obj.childNodes[0] : obj;
    setTimeout(() => {
      const val = icon.className.replace('anticon anticon-', '');
      this.setState({
        value: val,
        pickerVisible: false,
      }, () => {
        this.props.onPick(val);
      });
    }, 100);
  }

  buildIcons(icons) {
    return (
      <table className='td-icon-picker-table'>
        <tbody>
          {
            icons.map((row, i) => {
              return (
                <tr key={`row-${i}`}>
                  {
                    row.map((cell, j) => {
                      return (
                        <td key={`cell-${j}`} onClick={(ev) => { this.handleIconClick(ev); }}>
                          <Icon type={cell} />
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }

  render() {
    const { ...restProps } = this.props;
    const TabPane = Tabs.TabPane;
    return (
      <div className='td-icon-picker'>
        <Input {...restProps} type="text" value={this.state.value} onClick={(ev) => { this.handleInputClick(ev); }} />
        <div className={ this.state.pickerVisible ? 'td-icon-picker-content' : 'td-icon-picker-content td-icon-picker-content-hidden'}>
          <Tabs defaultActiveKey="0">
            {
              Icons.map((item, i) => {
                return (
                  <TabPane tab={item.name} key={i}>
                    { this.buildIcons(item.icons) }
                  </TabPane>
                );
              })
            }
          </Tabs>
        </div>
      </div>
    );
  }
}

// 定义组件标签的可配置属性
TdIconPicker.defaultProps = {
  onPick: () => {},
};

export default TdIconPicker;
