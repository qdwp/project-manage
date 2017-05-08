import React from 'react';
import { Link } from 'react-router';
import { notification, Icon, Menu, Tooltip } from 'antd';
import tdnotice from '../component/TdNotice';
import { callAjax, setDictType, getDictByType } from './util';
import { tdpub } from '../config/server';

const SubMenu = Menu.SubMenu;

/**
 * 打开通知提示框,默认3s后关闭
 * 
 * 参数：
 * type: 通知类型(success, info, warning, error)
 * desc: 通知描述
 * title: 通知标题(默认'提示')
 * duration: 通知时间(默认3秒)
 * component: 通知组件(默认'td')
 */
export function openNotice(type = 'info', desc = '', title = '提示', duration = 3, component = '') {
  if (component === 'td') {
    tdnotice.open(type === 'warn' ? 'warning' : type, desc, title, duration);
  } else {
    notification[type]({
      message: title,
      description: desc,
      duration,
    });
  }
}

/**
 * 递归构建菜单
 * 
 * 参数：
 * arr：菜单数据(详见/data/menuData.json)
 * 
 * 说明：
 * <Menu>{buildMenu(arr)}</Menu>
 */
export function buildMenu(arr) {
  return arr.map((item) => {
    if (item.children && item.children.length > 0) {
      return (
        <SubMenu key={item.text} title={item.icon && item.icon !== '' ? (<span><Icon type={item.icon} />{item.text}</span>) : ''}>
          {buildMenu(item.children)}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item.text}>
          <Link to={item.to}>{item.icon && item.icon !== '' ? (<Icon type={item.icon} />) : ''}{item.text}</Link>
        </Menu.Item>
      );
    }
  });
}

/**
 * 构建下拉菜单
 * 参数：
 * type   : 码表类型
 * isSpace: 是否添加默认选项
 * 说明：
 * <Select>{buildSelect('GENDER',false)}</Select>
*/
export function buildSelect(type, isSpace) {
  if (typeof (isSpace) === 'undefined') {
    isSpace = false;
  }

  const param = { 'TYPE': type };
  // 此处发送ajax请求获取数据更新Modal详情
  let opt = {
    url: tdpub.dict.qryDictList,
    type: 'POST',
    dataType: 'json',
    data: param,
    async: false,
  };

  let arrDict = [];
  if (true === isSpace) {
    arrDict[arrDict.length] = { 'value': '', 'text': '--请选择--' };
  }

  //优先从本地查询
  let arrTemp = getDictByType(type);
  if (null === arrTemp || undefined === arrTemp) {
    console.info('local not exists,query from web!');
    callAjax(opt, function (result) {
      arrTemp = result.rspData.DATA;
      //本地不存在，后台查询成功，更新本地存储
      setDictType(type, arrTemp);
    }, function (req, info, opt) {
      console.log(info);
    });
  } else {
    console.info('local is exists,query from local!');
  }

  console.info('arrTemp:', arrTemp);
  for (let i = 0; i < arrTemp.length; i++) {
    let oTemp = arrTemp[i];
    arrDict[arrDict.length] = { 'value': oTemp.attrMap.DICT_VALUE, 'text': oTemp.attrMap.DICT_NAME };
  }

  return arrDict.map((item) => {
    return (
      <Option value={item.value}>{item.text}</Option>
    )
  });
}
/***
 * 表格列内容过长添加tooltip提示
 * 参数：
 * text：表格实际内容
 * w：宽度
 * 说明：render:(text) => buildTableTip(text)
 */
export function buildTableTip(text, w) {
  if (text) {
    const style = w ? { width: parseInt(w) - 8 } : {};
    return (
      <Tooltip placement="topLeft" title={text}>
        <div className="overflow-text" style={style}>{text}</div>
      </Tooltip>
    );
  } else {
    return text;
  }
} 