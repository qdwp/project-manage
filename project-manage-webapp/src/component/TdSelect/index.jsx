import React from 'react';
import { Icon, Select } from 'antd';
import { callAjax } from '../../common/util';
import { openNotice } from "../../common/antdUtil";

/**
 * <TdSelect data=[] />
 * 
 * 标签属性：
 * data: 数据数组, 默认[](可选, 默认格式[{value: x, text: y}])
 * dict: 数据数组元素数据字典 (可选, 默认{dict_value: "value", dict_text: "text"}, 即data应为[{value: x, text: y}])
 * url: 远程加载数据地址(可选)
 * param: 远程加载数据参数(url存在时必选)
 * renderOptions: 远程相应数据渲染下拉框选项方法, 必须返回数组(url存在时必选)
 * 其他属性: 同antd的Select组件
 * blankText:默认下拉框text，value为""。
 * 
 * Auth: zhengqiang  Time: 2016-05-16
 * Updater: yujun    Time: 2016-05-20
 */
class TdSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dict, url, param, renderOptions } = this.props;
    if (url !== "") {
      callAjax({ url: url, data: param }, (result) => {
        //this.buildOptionData(renderOptions(result), dict);
      }, () => {
        openNotice("error", "请求数据失败", "错误");
      });
    }
  }

  buildOptionData(data, dict) {
    const Option = Select.Option, noblank = this.props.noblank;
    const _value = dict.dict_value, _text = dict.dict_text, _icon = dict.dict_icon;
    const children = [];

    if (Object.prototype.toString.call(data) == '[object Array]') {
      if (data.length === 0) {
        children.push((<Option key="notFoundContent" value="">暂无数据</Option>));
      }
      if (data.length > 0 && data[0].value !== "" && noblank === false) {
        children.push((<Option key="_blank" value="">{this.props.blankText}</Option>));
      }
      for (let i = 0; i < data.length; i++) {
        if (_icon) {
          children.push((<Option key={i} value={data[i][_value]}><Icon type={data[i][_icon]} />{data[i][_text]}</Option>));
        } else {
          children.push((<Option key={i} value={data[i][_value]}>{data[i][_text]}</Option>));
        }
      }
    } else {
      if (noblank === false) {
        children.push((<Option key="_blank" value="">{this.props.blankText}</Option>));
      }
    }
    return children;
  }

  render() {
    const {dict, data, ...restProps } = this.props;
    return (
      <Select {...restProps}>
        {this.buildOptionData(data, dict)}
      </Select>
    );
  }
}

//定义组件标签的可配置属性
TdSelect.defaultProps = {
  url: "",
  param: {},
  data: [],
  dict: { dict_value: "value", dict_text: "text" },
  renderOptions: () => { return [] },
  blankText: "",
  noblank: false
};

export default TdSelect;