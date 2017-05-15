import React from 'react';
import { Pagination, Icon, Row, Col, Input, Select, DatePicker, Button } from 'antd';
import { getLoginInfo, callAjax, filterObject } from '../../common/util';
import { url } from '../../config/server';
import { rspInfo } from '../../common/authConstant';
import TdCard from '../../component/TdCard';
import TdSelect from '../../component/TdSelect';
import { openNotice } from '../../common/antdUtil';

class BugRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      total: 0,
      pageSize: 10,
    };
  }

  componentDidMount() {
    this.loadRateData();
  }

  loadRateData(page = 1) {
    const opt = {
      url: url.bug.record,
      type: 'POST',
      data: {
        pageNum: page,
        pageSize: this.state.pageSize,
      },
    };
    callAjax(opt, (result) => {
      if (result.rspCode === rspInfo.RSP_SUCCESS) {
        this.setState({
          records: result.rspData.list,
          total: result.rspData.total,
        });
      } else {
        openNotice('error', result.rspInfo);
      }
    }, (rep, info, opt) => {
      openNotice('error', rspInfo.RSP_NETWORK_ERROR);
    });
  }

  showTotal(total) {
    return `共 ${total} 条记录`;
  }

  handleChangePagination(page) {
    this.loadRateData(page);
  }

  render() {
    const obj = this;

    return (
      <div>
        <TdCard hideHead='true' shadow='true'>
          <h2>调试公告</h2>
          <hr />

          {
            obj.state.records.map((item, i) => {
              return (
                <div key={i}>
                  <div>
                    <Icon type="pushpin-o" />&nbsp;&nbsp;&nbsp;{item.HANDLE_TIME}&nbsp;&nbsp;
                    <font color="#1E90FF">{item.HANDLE_BY}</font>&nbsp;&nbsp;{item.BUG_STATUS}&nbsp;&nbsp;
                    <font color="#1E90FF">{item.BUG_TITLE}</font>
                    <font color="#2B2B2B">&nbsp;&nbsp;[{item.BUG_LEVEL}]</font>
                    <span>&nbsp;&nbsp;[{item.PRO_NAME}&nbsp;-&nbsp;{item.MODULE_NAME}]</span>
                    <font color="#1E90FF">&nbsp;&nbsp;Description: </font>({item.BUG_DES})
                  </div>
                  <br />
                </div>
              );
            })
          }

          <hr />
          <Col sm={24} md={12}>
            <p></p>
          </Col>
          <Col sm={24} md={12}>
            <Pagination size="small" total={this.state.total}
              showTotal={obj.showTotal}
              onChange={ obj.handleChangePagination.bind(obj) }
            />
          </Col>
        </TdCard>
      </div>
    );
  }
}

export default BugRecord;
