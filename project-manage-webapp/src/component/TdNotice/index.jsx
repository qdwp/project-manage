import "./index.less";
import HtmlHelper from "../lib/HtmlHelper";
/**
 * tdnotice.open("warning", "xxx", 3)
 * 组件依赖jQuery
 */
const TdNotice = {
    open(type = "info", desc = "", title = "提示", duration = 3) {
        const overX = document.body.style.overflowX, overY = document.body.style.overflowY;
        const $div = $(initNotice(type, desc, title, overX, overY));
        $div.find(".anticon-cross").click(() => { 
            closeEl($div); 
        });
        let to = null;
        $div.mouseenter(() => { 
            clearTimeout(to);
        });
        $div.mouseleave(() => {
            to = setClose($div, 1, overX, overY);
        });
        $div.stop().animate({ bottom: "0px" }, () => {
            setTimeout(() => {
                to = setClose($div, duration, overX, overY);
            }, 100);
        });
    }
};

//初始化notice元素
function initNotice(type, desc, title, x, y) {
    const div = document.createElement("div");
    let cls = "", icon = "";
    switch (type) {
        case "success":
            cls = "td-notice td-notice-success";
            icon = "<i class=' anticon anticon-check-circle' is='null' ></i>";
            break;
        case "warning":
            cls = "td-notice td-notice-warning";
            icon = "<i class=' anticon anticon-exclamation-circle' is='null' ></i>";
            break;
        case "error":
            cls = "td-notice td-notice-error";
            icon = "<i class=' anticon anticon-cross-circle' is='null' ></i>"
            break;
        default:
            cls = "td-notice td-notice-info";
            icon = "<i class=' anticon anticon-info-circle' is='null'></i>";
    }
    div.className = cls;
    div.innerHTML = `${icon}&nbsp;&nbsp;<b>${title}</b>&nbsp;&nbsp;<span title="${desc}">${desc}</span><i class=' anticon anticon-cross' is='null'></i>`;
    fixBody(x, y);
    document.body.appendChild(div);
    return div;
}
//固定body滚动条状态
function fixBody(x, y) {
    const scroll = HtmlHelper.isScroll();
    if (x === "scroll" || scroll.scrollX === true) {}else {
        document.body.style.overflowX = "hidden";
    }
    if (y === "scroll" || scroll.scrollY === true) {}else {
        document.body.style.overflowY = "hidden";
    }
}
//恢复body滚动条状态
function resetBody(x, y) {
    if(x) {
        document.body.style.overflowX = x;
    }
    if(y) {
        document.body.style.overflowY = y;
    }
}
//设置关闭
function setClose(el, duration, auto, x, y) {
    resetBody(x, y);
    const to = setTimeout(() => {
        closeEl(el);
    }, 1000 * duration);
    return to;
}
//关闭div
function closeEl(el) {
    el.stop().animate({ bottom: "-48px" }, () => { 
        el.remove(); 
    });
}

export default TdNotice;