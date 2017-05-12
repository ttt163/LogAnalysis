import React ,{PropTypes}from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import {ShowDiag,defformat,getMinut,randomData,towYAxisChartOpt,cookieInfo } from  "../public/js/f.js"
import echarts from 'echarts'
import { Link} from 'react-router';
import { URL ,BITDEFAULTDEV,SCROLLBOTTOM} from '../config.js';
import {addSubBitData} from "../actions/originActions.js"
import {getDevices,getHistoryDevices,historyOpt,initDevChart} from "./origin.Bit.js"
import {loadingShow,loadingHide} from "./Loading.js"
class IpBit extends React.Component {
    constructor(state) {
        super(state);
    }
    componentDidMount() {
        const {dispatch,originBit,location}=this.props;
        const _this=this;
        var query=originBit.bitQuery;
        $(".tab-bit").addClass("tab-active");
        var thisTime = new Date().getTime() / 1000, dateFormat = defformat(thisTime, "-");
        var bitQuery={
            "vhost":location.query.vhost,
            "starttime": !query||!query.starttime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000) + "" : query.starttime,
            "endtime":!query||!query.endtime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000)+24*60*60-1+ "" : query.endtime,
            "level":!query||!query.level ? "3/3" : query.level,
            "sourceip":location.query.selecIp
        };
        loadingShow().then(()=>{
            setTimeout(()=> {
                var deviceData=getDevices("BackSendByte",bitQuery),len=(BITDEFAULTDEV+1)<deviceData.length?BITDEFAULTDEV+1:deviceData.length,showDevData=deviceData.slice(0,len);
                var promise = new Promise(function (resolve) {
                    resolve(dispatch(addSubBitData({"bitQuery":bitQuery,"deviceData":deviceData,"showDevData":showDevData})));
                });
                // console.log(deviceData);
                //初始化图表
                var sendData={
                    "vhost":bitQuery.vhost,
                    "starttime":bitQuery.starttime,
                    "endtime":bitQuery.endtime,
                    "level":bitQuery.level,
                    "sourceip":bitQuery.sourceip,
                    "devname":""
                };
                promise.then(function (value) {
                    for(var index=0;index<showDevData.length;index++){
                        initDevChart(bitQuery,index,{...sendData,"devname":showDevData[index]});
                    }
                });
                loadingHide();
            }, 10);
        });

    }
    componentWillUnmount() {
        $(".tab-bit").removeClass("tab-active");
    }
    initScrollData(e){
        const {subBit,dispatch}=this.props;
        const _this=this;
        var _thisDom=$(e.target),
            _contentHeight=_thisDom[0].scrollHeight,
            _height=_thisDom.height(),
            _scrollTop=_thisDom.scrollTop(),
            _scrollBottom=_contentHeight-_height-_scrollTop;
        var showDevData=subBit.showDevData,
            deviceData=subBit.deviceData,
            bitQuery=subBit.bitQuery;
        if(showDevData.length<deviceData.length){
            var showDevName=deviceData.slice(showDevData.length,showDevData.length+1);
            if(_scrollBottom<SCROLLBOTTOM){
                //加载数据
                var promise = new Promise(function (resolve) {
                    resolve(dispatch(addSubBitData({"showDevData":showDevData.push(showDevName)})));
                });
                // console.log(deviceData);
                //初始化图表
                var sendData={
                    "vhost":bitQuery.vhost,
                    "starttime":bitQuery.starttime,
                    "endtime":bitQuery.endtime,
                    "level":bitQuery.level,
                    "sourceip":bitQuery.sourceip,
                    "devname":showDevName[0]
                };
                promise.then(function (value) {
                    initDevChart(subBit.bitQuery,showDevData.length,sendData);
                });
            }
        }

    }
    render() {
        const {subBit,location}=this.props;
        return (
            <div className="tab-cont">
                <div style={{"borderBottom": "1px solid #e5e5e5"}}>
                    <i style={{"fontSize": "26px","verticalAlign": "middle","color": "#0099cb", "cursor": "pointer"}}
                       className="iconfont"
                       onClick={()=> this.context.router.push(`/originCont/bit?vhost=${location.query.vhost}`)}>&#xe605;</i>
                    <h4 className="mr10" style={{"display": "inline"}}>{location.query.selectName}</h4>
                </div>
                <div style={{"height": "520px","overflowY": "scroll","overflowX": "hidden"}}  onScroll={(e)=>this.initScrollData(e)}>
                    {!subBit.showDevData?"":
                        subBit.showDevData.map((item,index)=>
                                <div key={index} className="ip-block mt30">
                                    <div>
                                        <i className="iconfont">&#xe639;</i>{item}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 bit-line" style={{"height":"350px"}}></div>
                                        <div className="col-md-6 slow-line" style={{"height":"350px"}}></div>
                                    </div>
                                </div>
                        )}

                    {/*<div className="ip-block mt30">
                        <div>
                            <i className="iconfont">&#xe639;</i>101.71.29.130
                        </div>
                        <div className="row">
                            <div className="col-md-6 bit-line" style={{"height":"350px"}}></div>
                            <div className="col-md-6 slow-line" style={{"height":"350px"}}></div>
                        </div>
                    </div>*/}
                </div>
            </div>
        )


    }
}
function getData(state) {
   // console.log(state);
    return {
        "subBit": state.originReducer.originSubBit,
        "originBit": state.originReducer.originBit
    }
}
export default connect(getData)(IpBit);
IpBit.contextTypes = {
    router: PropTypes.object
};
