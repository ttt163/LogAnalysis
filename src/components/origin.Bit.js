import React ,{PropTypes}from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import echarts from 'echarts'
//import  'echarts/map/js/china'
import {towYAxisChartOpt ,defformat,getMinut,historyLineOpt,cookieInfo,getDateRange} from  "../public/js/f.js"
import { Link} from 'react-router';
import { URL ,BITDEFAULTDEV,SCROLLBOTTOM} from '../config.js';
import {addOriginBitData} from "../actions/originActions.js"
import {loadingShow,loadingHide} from "./Loading.js"
export function getDevices(type,sendData) {
    var retData = [];
    var thisTime = parseInt(new Date().getTime() / 1000);
    var cookieData = cookieInfo(thisTime);
    $.ajax({
        url: `${URL}/vhost/getBackVhostInfoList/${type}`,
        type: 'post',
        data: {...sendData,...cookieData},
        async: false,  //默认为true 异步
        dataType: "json",
        error: function (error) {
            return retData;
        },
        success: function (res) {
            retData = res;
        }
    });
    return retData;
}
export function getHistoryDevices(type,sendData) {
    var retData = [];
    var thisTime = parseInt(new Date().getTime() / 1000);
    var cookieData = cookieInfo(thisTime);
    $.ajax({
        url: `${URL}/vhost/getBackVhostValue/${type}`,
        type: 'post',
        data: {...sendData,...cookieData},
        async: false,  //默认为true 异步
        dataType: "json",
        error: function (error) {
            return retData;
        },
        success: function (res) {
            retData = res;
        }
    });
    return retData;
}
export function historyOpt(query,sendData){
    var timeDate = getDateRange(getMinut(query.starttime, "-"),getMinut(query.endtime, "-"));
    //回原带宽信息
    var historyBitDev=getHistoryDevices("BackSendByte",sendData);
    //回原时间信息
    var historyTimeDev=getHistoryDevices("BackSendTime",sendData);
    //回原慢速
    var historySlowDev=getHistoryDevices("BackSendSlow",sendData);
    var bitDevData = [],
        timeDevData = [],
        slowDevData = [],
        slowNumDevData = [],
        totalDevData = [],
        timev = timeDate.timev;
    for (var i = 0; i < timev.length; i++) {
        if (!historyBitDev[timev[i]]) {
            bitDevData.push(0);
        } else {
            bitDevData.push((historyBitDev[timev[i]] / 1000 / 1000 / 60).toFixed(2));
        }

        if (!historyTimeDev[timev[i]]) {
            timeDevData.push(0);
        } else {
            timeDevData.push(!historyTimeDev[timev[i]].num?0:(historyTimeDev[timev[i]].total/historyTimeDev[timev[i]].num).toFixed(2));
        }

        if (!historySlowDev[timev[i]]) {
            slowDevData.push(0);
            totalDevData.push(0);
            slowNumDevData.push(0);
        } else {
            totalDevData.push(parseInt(historySlowDev[timev[i]].total));
            slowNumDevData.push(parseInt(historySlowDev[timev[i]].error));
            slowDevData.push(!historySlowDev[timev[i]].total?0:((parseInt(historySlowDev[timev[i]].error)/parseInt(historySlowDev[timev[i]].total))*100).toFixed(2));
        }
    }
    var bitSeries= [{
        name: '带宽',
        type: 'line',
        smooth: true,
        data: bitDevData
    }, {
        name: '平均回源时间',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: timeDevData
    }];
    var bitYaxis = [
        {
            type: 'value',
            name: "带宽(Mbps)",
            axisLabel: {
                formatter: '{value}'
            }
        },
        {
            type: 'value',
            name: "回源平均时长（s）",
            axisLabel: {
                formatter: function (value) {
                    return value+'s'
                }
            }
        }
    ];
    var bitOpt = towYAxisChartOpt(timeDate.time_list, ['带宽', '平均回源时间'], ['#88a44d', '#d98642'], bitYaxis, bitSeries);
    //慢速
    var slowSeries= [{
        name: '慢速比',
        type: 'line',
        smooth: true,
        data: slowDevData
    }, {
        name: '总访问次数',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: totalDevData
    },{
        name: '慢速的次数',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: slowNumDevData
    }];
    var slowYaxis = [
        {
            type: 'value',
            name: "慢速比（%）",
            axisLabel: {
                formatter: '{value}%'
            }
        },
        {
            type: 'value',
            name: "访问次数",
            axisLabel: {
                formatter: function (value) {
                    return value
                }
            }
        }
    ];
    var slowOpt = towYAxisChartOpt(timeDate.time_list, ['慢速比', '总访问次数','慢速的次数'], ['#88a44d', '#d98642',"#4672a3"], slowYaxis, slowSeries);
    /*var optLen = opt.legend, optYAxis = opt.yAxis, grid = {right: '10%', left: "5%"}, le = {
     ...optLen,
     top: '40%',
     right: '20px',
     orient: "vertical"
     };*/
    return {"bitOpt":bitOpt,"slowOpt":slowOpt};
    //echarts.init(document.getElementById("onlineChart")).setOption({...opt, "grid": grid, "legend": le});

}
export function initDevChart(query,index,sendData){
    var _thisHistoryOpt=historyOpt(query,sendData);
    echarts.init($(".bit-line").get(index)).setOption(_thisHistoryOpt.bitOpt);
    echarts.init($(".slow-line").get(index)).setOption(_thisHistoryOpt.slowOpt);
}
class OriginBit extends React.Component {
    constructor(state) {
        super(state);
    }

    componentDidMount() {
        const {dispatch,query,location,originBit}=this.props;
        const _this=this;
     //$(".f-origin ").addClass("f-curr");
     $(".tab-bit").addClass("tab-active");
        var thisTime = new Date().getTime() / 1000, dateFormat = defformat(thisTime, "-");
        var bitQuery={
            "vhost":location.query.vhost,
            "starttime": !query.starttime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000) + "" : query.starttime,
            "endtime":!query.endtime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000)+24*60*60-1+ "" : query.endtime,
            "level":!query.level ? "3/3" : query.level,
            /*"protocol": !query.protocol ? "hls" : query.protocol,*/
            "sourceip":""
        };
        loadingShow().then(()=>{
            setTimeout(()=> {
                var deviceData=getDevices("BackSendByte",bitQuery),devKeys=Object.keys(deviceData),
                    len=(BITDEFAULTDEV)<devKeys.length?BITDEFAULTDEV:devKeys.length,showDevNames=devKeys.slice(0,len),showDevData=[];
                for(var i=0;i<showDevNames.length;i++){
                    showDevData.push({"devName":showDevNames[i],"devIp":deviceData[showDevNames[i]]});
                }
                var promise = new Promise(function (resolve) {
                    resolve(dispatch(addOriginBitData({"bitQuery":bitQuery,"deviceData":deviceData,"showDevData":showDevData})));
                });
                // console.log(deviceData);
                //初始化图表
                var sendData={
                    "vhost":bitQuery.vhost,
                    "starttime":bitQuery.starttime,
                    "endtime":bitQuery.endtime,
                    "level":bitQuery.level,
                    "sourceip":"",
                    "devname":""
                };
                promise.then(function (value) {
                    for(var index=0;index<showDevData.length;index++){
                        initDevChart(bitQuery,index,{...sendData,"sourceip":showDevData[index].devIp});
                    }
                });
                loadingHide();
            }, 10);
        });

    }

    initScrollData(e){
        const {originBit,dispatch}=this.props;
        const _this=this;
        var _thisDom=$(e.target),
            _contentHeight=_thisDom[0].scrollHeight,
            _height=_thisDom.height(),
            _scrollTop=_thisDom.scrollTop(),
            _scrollBottom=_contentHeight-_height-_scrollTop;
        var showDevData=originBit.showDevData,
            deviceData=originBit.deviceData,
            deviceDataNames=Object.keys(deviceData),
            bitQuery=originBit.bitQuery;
        if(showDevData.length<deviceDataNames.length){
            var showDevNames=deviceDataNames.slice(showDevData.length,showDevData.length+1);
            if(_scrollBottom<SCROLLBOTTOM){
                //加载数据
                var promise = new Promise(function (resolve) {
                    resolve(dispatch(addOriginBitData({"showDevData":[...showDevData,{"devName":showDevNames[0],"devIp":deviceData[showDevNames[0]]}]})));
                });
                // console.log(deviceData);
                //初始化图表
                var sendData={
                    "vhost":bitQuery.vhost,
                    "starttime":bitQuery.starttime,
                    "endtime":bitQuery.endtime,
                    "level":bitQuery.level,
                    "sourceip":"",
                    "devname":""
                };
                promise.then(function (value) {
                    initDevChart(originBit.bitQuery,showDevData.length,{...sendData,"sourceip":deviceData[showDevNames[0]]});
                });
            }
        }

    }
    render() {
        const {originBit,location}=this.props;
        return (
            <div className="tab-cont" style={{"height": "600px","overflowY": "scroll"}}  onScroll={(e)=>this.initScrollData(e)}>
                {!originBit.showDevData?"":
                    originBit.showDevData.map((item,index)=>
                            <div key={index} className="ip-block mb30">
                                <div>
                                    <i className="iconfont">&#xe639;</i>
                                    <Link to={`/originCont/bit/ipInfo?vhost=${!location.query.vhost?"":location.query.vhost}&selecIp=${!item.devIp?"":item.devIp}&selectName=${!item.devName?"":item.devName}`}>
                                    {item.devName}
                                    </Link>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 bit-line" style={{"height":"350px"}}></div>
                                    <div className="col-md-6 slow-line" style={{"height":"350px"}}></div>
                                </div>
                            </div>
                    )
                }

                {/* <div className="ip-block">
                    <div>
                        <i className="iconfont">&#xe639;</i>
                        <Link to={`/originCont/bit/ipInfo?vhost=${!location.query.vhost?"":location.query.vhost}`}>101.71.29.130</Link>
                    </div>
                    <div className="row">
                        <div className="col-md-6 bit-line"  style={{"height":"350px"}}></div>
                        <div className="col-md-6 slow-line" style={{"height":"350px"}}></div>
                    </div>
                </div>*/}
            </div>
        )


    }
}
function getData(state) {
   // console.log(state);
    return {
        "originBit": state.originReducer.originBit,
        "query": state.originReducer.originList.query
    }
}
export default connect(getData)(OriginBit);
OriginBit.contextTypes = {
    router: PropTypes.object
}
