import "./index.less";
import React from "react";

/**
 * <TdCard>其他标签或组件，如：<div>yyy</div></TdCard>
 * 
 * 标签属性：
 * title: 卡片标题(默认空字符串)
 * hideHead: 隐藏标题区域(默认false)
 * visible: 是否可见(默认true)
 * shadow: 是否带阴影(默认false)
 * imageUrl: 图片地址(分辨率68x68最佳, 可为本地地址或http地址)
 * style: 卡片根节点样式对象(默认空对象)
 * contentStyle: 卡片内容区域样式对象(默认空对象)
 * buttons: 卡片按钮列表(默认空数组, 元素对象{name:"xx", click:fun})
 * 
 * Auth: yujun  Time: 2016-04-22
 * 
 * Update: yujun  Time: 2016-05-03
 */
class TdCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //使用标签定义的属性
        const { title, hideHead, visible, shadow, imageUrl, minHeight, buttons, style, contentStyle, onClick } = this.props;
        const btnWidth = 100 / buttons.length + "%";
        const cardClass = "td-card " + ((shadow === true || shadow === "true") ? "td-card-shadow" : "");
        const noop = () => { };
        style.display = (visible === true || visible === "true") ? "block" : "none";
        return (
            <div className={cardClass} onClick={onClick} style={style}>
                <div className="td-card-container" style={{ minHeight: minHeight }}>
                    {
                        (hideHead === true || hideHead === "true") ? null :
                            <div className="td-card-head">
                                <div className="td-card-avatar" style={{ display: imageUrl === "" ? "none" : "block", backgroundImage: "url(" + imageUrl + ")" }}></div>
                            </div>
                    }
                    <div className="td-card-content" style={contentStyle}>
                        {title === "" ? null : [<h3 key="td-card-key-title" dangerouslySetInnerHTML={{ __html: title }}></h3>, <hr key="td-card-key-hr"/>]}
                        {this.props.children}
                    </div>
                </div>
                {
                    buttons.length === 0 ? null : (
                        <div className="td-card-footer">
                            {
                                buttons.map((btn) => {
                                    return (
                                        <div className="td-card-button" key={btn.name} onClick={(typeof btn.click === "function") ? btn.click : noop} style={{ width: btnWidth }}><span>{btn.name}</span></div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        );
    }
}

//定义组件标签的可配置属性
TdCard.defaultProps = {
    title: "",
    imageUrl: "",
    minHeight: 120,
    hideHead: false,
    visible: true,
    shadow: false,
    buttons: [],
    style: {},
    contentStyle: {},
    onClick: () => { }
};

export default TdCard;