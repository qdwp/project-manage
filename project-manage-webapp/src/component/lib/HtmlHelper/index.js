const HtmlHelper = {
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
   * 判断指定元素是否有滚动条
   * 参数：
   * el: html元素(可选 不传入时为body)
   * 返回：
   * { scrollX: boolean, scrollY: boolean }
   */
  isScroll(el) {
    // test targets
    const elems = el ? [el] : [document.documentElement, document.body];
    const scrollX = false;
    const scrollY = false;
    for (let i = 0; i < elems.length; i++) {
      const o = elems[i];
      // test horizontal
      const sl = o.scrollLeft;
      o.scrollLeft += (sl > 0) ? -1 : 1;
      // o.scrollLeft !== sl && (scrollX = scrollX || true);
      o.scrollLeft = sl;
      // test vertical
      const st = o.scrollTop;
      o.scrollTop += (st > 0) ? -1 : 1;
      // o.scrollTop !== st && (scrollY = scrollY || true);
      o.scrollTop = st;
    }
    // ret
    return {
      scrollX, scrollY,
    };
  },
  /**
   * 异步加载js
   * 参数：
   * url：js文件地址
   * callback：加载完成后的回调方法
   */
  loadScript(url, charset, callback) {
    let isCallback = false;
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.charset = charset;
    s.async = true;
    s.src = url;
    const x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
    s.onload = s.onreadystatechange = () => {
      if ((!this.readyState) || this.readyState === 'complete' || this.readyState === 'loaded') {
        if (!isCallback) {
          isCallback = true;
          if (typeof callback === 'function') {
            callback();
          }
        }
      }
    };
  },
};

export default HtmlHelper;
