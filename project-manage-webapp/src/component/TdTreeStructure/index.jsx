import './index.less';
import React from 'react';
import { Tooltip, Icon } from 'antd';
import EventManager from '../lib/EventManager';

/**
 * <TdTreeStructure data={} />
 * 标签属性：
 * data: 数据对象, 必须有根节点(可选, 默认{key: 'ROOT', text: 'ROOT', children: []})
 * dict: 数据解析用字典(可选, 默认{key: 'key', text: 'text'})
 * style: 容器样式对象(可选, 默认空对象)
 * columns: 详情对象数组(可选, 对象属性: title, dataIndex, render)
 * actions: 菜单对象数组(可选, 对象属性: text, icon, click)
 * Auth: yujun  Time: 2016-05-28
 * Updater: yujun Time: 2016-05-31
 */
class TdTreeStructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curNode: '',
      leafNum: 0,
      width: 'auto',
      menuHeight: 34 * props.actions.length,
      menuX: 0,
      menuY: 0,
    };
  }

  componentDidMount() {
    this.setContainerWidth(() => {
      EventManager.addEvent(document, 'mouseup', this.hideActionMenu);  // 不能bind(this)
    });
  }
  componentWillReceiveProps() {
    this.setState({ leafNum: 0 }, this.setContainerWidth);
  }
  componentWillUnmount() {
    EventManager.removeEvent(document, 'mouseup', this.hideActionMenu);  // 不能bind(this)
  }

  // 修改组件容器宽度
  setContainerWidth(callback) {
    let w = 82 * this.state.leafNum + 20 * (this.state.leafNum - 1);
    if (this.state.leaf === 2) {
      w += 20;
    }
    this.setState({
      width: w,  // 粗略计算宽度
    }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  // 节点鼠标松开事件, 用于展现actions菜单
  handleLinkMouseUp(ev, point, key) {
    this.stopEvent(ev);
    if (ev.button === 2) {
      this.setState({ curNode: key }, () => {
        this.setState({
          menuX: point.x,
          menuY: point.y + this.state.menuHeight > document.body.clientHeight ? point.y - this.state.menuHeight : point.y,
        }, () => {
          const eles = document.querySelectorAll('.td-tree-structure-menu');
          for (let i = 0; i < eles.length; i++) {
            eles[i].style.display = 'inline-block';
          }
        });
      });
    }
  }
  handleMenuClick(ev, item) {
    if (typeof item.click === 'function') {
      item.click(this.state.curNode);
    }
  }
  stopEvent(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  // 隐藏菜单
  hideActionMenu(ev) {
    const target = ev.target || ev.srcElement;
    if (target.className.indexOf('td-tree-structure-node') < 0) {
      const eles = document.querySelectorAll('.td-tree-structure-menu');
      for (let i = 0; i < eles.length; i++) {
        eles[i].style.display = 'none';
      }
    }
  }
  // 构建节点
  buildNodes(nodes) {
    const { dict, columns } = this.props;
    return nodes.map((node, i) => {
      let vdom = null;
      if (node.children && node.children.length > 0) {
        vdom = (
          <li key={node[dict.key] + i}>
            {
              columns.length === 0 ?
                <a href='javascript:void(0);' className='td-tree-structure-node' onContextMenu={this.stopEvent}
                  onMouseUp={(ev) => { this.handleLinkMouseUp(ev, { x: ev.clientX, y: ev.clientY }, node[dict.key], node[dict.text]); } }
                >
                  { node[dict.text] }
                </a> :
                <Tooltip title={ this.buildDetail(node) }>
                  <a href='javascript:void(0);' className='td-tree-structure-node' onContextMenu={this.stopEvent}
                    onMouseUp={(ev) => { this.handleLinkMouseUp(ev, { x: ev.clientX, y: ev.clientY }, node[dict.key], node[dict.text]); } }
                  >
                    { node[dict.text] }
                  </a>
                </Tooltip>
            }
            <ul>
              { this.buildNodes(node.children) }
            </ul>
          </li>
        );
      } else {
        // 此处不能使用setState
        this.state.leafNum++;
        vdom = (
          <li key={node[dict.key]}>
            {
              columns.length === 0 ?
                <a href='javascript:void(0);' className='td-tree-structure-node' onContextMenu={this.stopEvent}
                  onMouseUp={(ev) => { this.handleLinkMouseUp(ev, { x: ev.clientX, y: ev.clientY }, node[dict.key], node[dict.text]); } }
                >
                  { node[dict.text] }
                </a> :
                <Tooltip title={ this.buildDetail(node) }>
                  <a href='javascript:void(0);' className='td-tree-structure-node' onContextMenu={this.stopEvent}
                    onMouseUp={(ev) => { this.handleLinkMouseUp(ev, { x: ev.clientX, y: ev.clientY }, node[dict.key], node[dict.text]); } }
                  >
                    { node[dict.text] }
                  </a>
                </Tooltip>
            }
          </li>
        );
      }
      return vdom;
    });
  }
  // 构建columns详情
  buildDetail(data) {
    const { columns } = this.props;
    return (
      <table>
        <tbody>
          {
            columns.map((item, i) => {
              return (
                <tr key={i}>
                  <td style={{ float: 'right' }}><b>{item.title}:&nbsp;</b></td>
                  <td>{(typeof item.render === 'function') ? item.render(data[item.dataIndex]) : data[item.dataIndex]}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }

  render() {
    const { data, dict, style, columns, actions } = this.props;
    return (
      <div className='td-tree-structure' style={style}>
        {
          actions.length === 0 ? null :
            <div className='td-tree-structure-menu' style={{ top: this.state.menuY, left: this.state.menuX }}>
              <div className='td-tree-structure-menu-aside'></div>
              <dl>
                {
                  actions.map((item, i) => {
                    return (
                      <dt key={i} onClick={(ev) => { this.handleMenuClick(ev, item); } }>
                        {item.icon ? <Icon type={item.icon} /> : null}{(item.icon ? ' ' : '') + item.text}
                      </dt>
                    );
                  })
                }
              </dl>
            </div>
        }
        <ul style={{ paddingTop: 0, width: this.state.width }}>
          <li>
            {
              columns.length === 0 ?
                <a href='javascript:void(0);' className='td-tree-structure-node' onContextMenu={this.stopEvent}
                  onMouseUp={(ev) => { this.handleLinkMouseUp(ev, { x: ev.clientX, y: ev.clientY }, data[dict.key], data[dict.text]); } }
                >
                  { data[dict.text] }
                </a> :
                <Tooltip title={ this.buildDetail(data) }>
                  <a href='javascript:void(0);' className='td-tree-structure-node' onContextMenu={this.stopEvent}
                    onMouseUp={(ev) => { this.handleLinkMouseUp(ev, { x: ev.clientX, y: ev.clientY }, data[dict.key], data[dict.text]); } }
                  >
                    { data[dict.text] }
                  </a>
                </Tooltip>
            }
            {
              data.children && data.children.length > 0 ? <ul>{ this.buildNodes(data.children) }</ul> : null
            }
          </li>
        </ul>
      </div>
    );
  }
}

TdTreeStructure.defaultProps = {
  data: { key: 'ROOT', text: 'ROOT', children: [] },
  dict: { key: 'key', text: 'text' },
  style: {},
  columns: [],
  actions: [],
};

export default TdTreeStructure;
