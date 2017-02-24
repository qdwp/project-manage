const JsHelper = {
  /**
   * 生成UUID
   * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
   * 参数：
   * prifix：UUID前缀
   * 返回：
   * String
   */
  uuid(prefix) {
    const p = prefix || 'uuid';
    return String(Math.random() + Math.random()).replace(/\d\.\d{4}/, p);
  },
  /**
   * 驼峰式转换
   * background-color => backgroundColor
   * 参数：
   * str：待转换字符
   * 返回：
   * String
   */
  camelize(str) {
    return str.replace(/\-(\w)/g, (all, letter) => {
      return letter.toUpperCase();
    });
  },
  /**
   * 交换数组元素
   * 参数：
   * arr：待操作的数组
   * index1：带交换的元素下标1
   * index2：带交换的元素下标2
   */
  swapArrayItems(arr, index1, index2) {
    const nArr = arr;
    nArr[index1] = nArr.splice(index2, 1, nArr[index1])[0];
    return nArr;
  },
  /**
   * 获取简单数组元素下标
   * 参数：
   * arr：数组
   * value：数组元素
   */
  getArrayItemIndex(arr, value) {
    const str = arr.toString();
    const index = str.indexOf(value.toString());
    let idx = -1;
    if (index >= 0) {
      // 存在返回索引
      const reg1 = new RegExp(`((^|,)${value}(,|$))`, 'gi');
      idx = str.replace(reg1, '$2@$3').replace(/[^,@]/g, '').indexOf('@');
    }
    return idx;
  },
};

export default JsHelper;
