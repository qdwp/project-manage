import './index.less';
import React from 'react';
import { Icon, Button, Table } from 'antd';
import { callAjax } from '../../common/util';
import { openNotice } from '../../common/antdUtil';
/**
 * Antd中Table组件(http://ant.design/#/components/table)的二次封装, 用于单表头分页表格远程加载数据
 * <TdPageTable url='...' columns={[...]} loadParam={{...}} reload={...} renderResult={function} />
 * 标签属性：
 * url: 远程加载数据地址(必选)
 * columns: 表头定义(同Antd Table组件的columns 必选)
 * renderResult: 请求结果渲染, 若设置了reload属性为true, 建议在return前将reload重设为false(必选)
 *   (result) => {
 *     //参数result为实际后台返回的json
 *     //返回组件指定格式的对象
 *     return {
 *       list: [...],   //行对象数组
 *       total: xx,     //总记录数
 *       count: {...}   //统计信息数组
 *     }
 *   }
 * toolbar: 工具条，默认空数组(可选 [{icon: 'plus', text: '新增', click: () => {}}])
 * reload: 是否重新请求数据, 可通过父组件状态动态设置, 默认否(可选)
 * bordered: 是否带边框, 默认带(可选)
 * checkbox: 是否带复选框, 默认带(可选)
 * autoLoad: 是否自动请求属性，默认是(可选)
 * pagination: 是否分页(可选, 默认true)
 * simplePage: 是否简单分页(可选，默认false)
 * pageSize: 页大小，默认10(可选)
 * loadParam: 请求参数对象, 可通过父组件的状态动态设置(可选)
 * scroll: 滚动设置(同Antd Table组件的scroll 可选)
 * renderCount: 统计信息渲染(可选)
 *   (curData, countData) => {
 *     //参数curData为当前表格中的全部行数据
 *     //参数countData为renderResult属性方法返回对象的count属性值
 *     //返回统计信息vdom
 *     return (...)
 *   }
 * rowSelectCallback: checkbox选中行时的回调, checkbox为true时有效(可选)
 *   (keys, rows) => {
 *     //参数keys为选中行key数组, 参数row为选中行对象数组
 *   }
 * rowClickCallback: 点击行时的回调(可选)
 *   (record, index) => {
 *     //参数record为行对象, 参数index为行索引
 *   }
 * rowKey: 选中某行记录时使用该方法返回的key值作为该行唯一标识
 *   (record)=>{
 *      //返回记录中的唯一值
 *   }
 * Auth: yujun  Time: 2016-05-10
 */
class TdPageTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTimeout: null,
      endTimeout: null,
      tableLoading: false,
      tableReload: false,
      tableData: [],
      tableCountData: {},
      tableSelectedRowKeys: [],
      tableSelectedRows: [],
      tablePagination: {
        total: 0,
        pageSize: props.pageSize,
        size: 'small',
        showSizeChanger: !props.simplePage,
        showQuickJumper: !props.simplePage,
        showTotal(total) {
          return `共 ${total} 条记录`;
        },
      },
    };
  }

  componentDidMount() {
    if (this.props.autoLoad === true) {
      this.loadTableData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reload === true && this.state.tableReload === false) {
      this.setState({ tableReload: true }, () => {
        this.loadTableData();
      });
    } else if (nextProps.reload === false && this.state.tableReload === true) {
      this.setState({ tableReload: false });
    }
  }

  // componentWillUnmount() {
  //   if (this.state.startTimeout !== null) {
  //     clearTimeout(this.state.startTimeout);
  //     this.state.startTimeout = null;
  //   }
  //   if (this.state.endTimeout !== null) {
  //     clearTimeout(this.state.endTimeout);
  //     this.state.endTimeout = null;
  //   }
  // }

  // 表格分页、排序、筛选变化时触发时触发事件
  handleTableChange(pagination, filters, sorter) {
    // 设置分页条状态为当前点击页数
    const pager = this.state.tablePagination;
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    // 查询点击的页数的记录
    this.loadTableData(pagination.current, filters, sorter);
  }

  // 读取指定页数的记录
  loadTableData(pageNum = 1) {
    const { url, loadParam, renderResult } = this.props;
    if (url.indexOf('json:') === 0) {
      this.setState({
        tableLoading: true,
        tableData: [],
        tableCountData: null,
      }, () => {
        const jsonData = require(`../../data/${url.split(':')[1]}`);
        const pager = this.state.tablePagination;
        pager.total = parseInt(jsonData.total, 10);  // 设置总记录数
        const data = jsonData.list;  // 设置当前查询记录
        const countData = jsonData.count;
        // 更新状态
        this.setState({
          tableLoading: false,
          tableSelectedRowKeys: [],
          tableSelectedRows: [],
          tablePagination: pager,
          tableData: data,
          tableCountData: countData,
        });
      });
    } else if (url !== '') {
      // 合并查询条件
      const param = Object.assign({}, loadParam, { pageNum, pageSize: this.state.tablePagination.pageSize });
      const ajaxOpt = { url, data: param };
      console.log('Load params => ', param);
      // 先将表格置为loading状态, 再清空当前表格数据
      this.setState({ tableLoading: true }, () => {
        // if (this.state.startTimeout !== null) {
        //   clearTimeout(this.state.startTimeout);
        //   this.state.startTimeout = null;
        // }
        // this.state.startTimeout = setTimeout(() => {
        // this.setState({ tableData: [], tableCountData: {} }, () => {
        callAjax(ajaxOpt, (result) => {
          const dat = renderResult(result);
          const pager = this.state.tablePagination;
          pager.total = parseInt(dat.total, 10);  // 设置总记录数
          pager.current = pageNum;
          this.setState({ tableReload: false }, () => {
            this.setState({
              tableSelectedRowKeys: [],
              tableSelectedRows: [],
              tablePagination: pager,
              tableData: dat.list,
              tableCountData: dat.count,
            }, () => {
              // if (this.state.endTimeout !== null) {
              //   clearTimeout(this.state.endTimeout);
              //   this.state.endTimeout = null;
              // }
              // this.state.endTimeout = setTimeout(() => {
              this.setState({ tableLoading: false });
              // }, 300);
            });
          });
        }, () => {
          openNotice('error', '请求数据失败', '错误');
          this.setState({
            tableReload: false,
            tableLoading: false,
            tableSelectedRowKeys: [],
            tableSelectedRows: [],
            tableData: [],
            tableCountData: {},
          });
        });
        //   });
        // }, 300);
      });
    }
  }

  render() {
    const obj = this;
    const baseWidth = 200;
    const { bordered, checkbox, pagination, columns, toolbar, scroll, renderCount, rowSelectCallback, rowClickCallback, rowKey } = this.props;
    // count table width
    let tblWidth = 0;
    for (let i = columns.length - 1; i >= 0; i --) {
      if (!columns[i].width) {
        columns[i].width = baseWidth;
      }
      tblWidth += parseInt(columns[i].width, 10) + 1; // 1 is border width
    }
    scroll.x = tblWidth;
    // reset column width which before fixed right column
    for (let i = columns.length - 1; i >= 0; i --) {
      if (i === columns.length - 1 && columns[i].fixed !== 'right') {
        columns[i].width = null;
        break;
      } else {
        if (i - 1 >= 0) {
          if (columns[i - 1].fixed === 'right') {
            continue;
          } else {
            columns[i - 1].width = null;
            break;
          }
        } else {
          break;
        }
      }
    }
    // scroll.y = 430; // (10+14*1.5+10+2) * 10 即：(上下内补丁10+字体12*1.5+边框2)*10
    const tableRowSelection = (checkbox === true ? {
      selectedRowKeys: this.state.tableSelectedRowKeys,
      onChange(selectedRowKeys, selectedRows) {
        obj.setState({
          tableSelectedRowKeys: selectedRowKeys,
          tableSelectedRows: selectedRows,
        }, () => {
          rowSelectCallback(selectedRowKeys, selectedRows);
        });
      },
    } : null);
    const footer = (renderCount === null ? null : (curDat) => {
      return renderCount(curDat, this.state.tableCountData);
    });
    const rowKeyHelp = { rowKey };
    let tableCls = toolbar.length === 0 ? 'td-page-table' : 'td-page-table td-page-table-noradius';
    tableCls = bordered === true ? `${tableCls} td-page-table-bordered` : tableCls;
    tableCls = pagination === false ? `${tableCls} td-page-table-nopage` : tableCls;
    return (
      <div className={tableCls}>
        {
          toolbar.length === 0 ? '' : (
            <div className='td-page-table-toolbar'>
              {
                toolbar.map((item, i) => {
                  const arr = i === 0 ? [<Button key={`${i}btn`} onClick={item.click}>{item.icon ? <Icon type={item.icon} /> : ''}{item.text}</Button>] :
                    [<span key={`${i}span`} className='ant-divider'></span>, <Button key={`${i}btn`} onClick={item.click}>{item.icon ? <Icon type={item.icon} /> : ''}{item.text}</Button>];
                  return arr;
                })
              }
            </div>
          )
        }
        <Table bordered={bordered} size='middle' rowSelection={tableRowSelection} pagination={pagination === true ? this.state.tablePagination : false}
          dataSource={this.state.tableData} loading={this.state.tableLoading} onChange={this.handleTableChange.bind(this) }
          columns={columns} scroll={scroll} onRowClick={rowClickCallback.bind(this) } footer={footer}
          {...(this.props.rowKey === null ? {} : rowKeyHelp) }
        />
      </div>
    );
  }
}

const noop = () => { };
// 定义组件标签的可配置属性
TdPageTable.defaultProps = {
  bordered: true,
  checkbox: true,
  autoLoad: true,
  reload: false,
  pagination: true,
  simplePage: false,
  url: '',
  pageSize: 10,
  columns: [],
  toolbar: [],
  loadParam: {},
  scroll: { x: true },
  renderResult: noop,  // 必须返回指定格式对象{list: [...], total: xx, count: {...}}
  renderCount: null,   // 接收指定参数curData, countData, 返回vdom
  rowSelectCallback: noop,
  rowClickCallback: noop,
  rowKey: null,
};

export default TdPageTable;
