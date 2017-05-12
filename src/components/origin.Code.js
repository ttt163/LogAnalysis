import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import {ShowDiag,defformat,getMinut,getDateRange,historyLineOpt,towYAxisChartOpt,cookieInfo} from  "../public/js/f.js"
import { Link} from 'react-router';
import { URL ,CODEDEFAULTDEV,SCROLLBOTTOM} from '../config.js';
import {addOriginCodeData} from "../actions/originActions.js"
import {getDevices,getHistoryDevices} from "./origin.Bit.js"
import echarts from 'echarts'
import {loadingShow,loadingHide} from "./Loading.js"
export function historyCodeOpt(query,sendData){
    var timeDate = getDateRange(getMinut(query.starttime, "-"),getMinut(query.endtime, "-"));
    //回源状态码
    //console.log(sendData);
    var historyBitDev=getHistoryDevices("BackStatusCode",sendData);
    var codes=[],codeObj={},total=0;
    for(var [key,item] of Object.entries(historyBitDev)){
        if(key>sendData.starttime&&key<=sendData.endtime){
            for(var [k,v] of Object.entries(item)){
                if (!codeObj[k] || $.isEmptyObject(codeObj[k])) {
                    codeObj={...codeObj,[k]:{[key]:parseInt(v)}};
                } else {
                    var _thisCode = codeObj[k];
                    codeObj = {...codeObj, [k]: {..._thisCode,[key]:parseInt(v)}};
                }
                if (codes.indexOf(k) == -1) {
                    codes.push(k);
                }
                total=total+parseInt(v);
            }

        }
    }
    var timev = timeDate.timev,series=[];
    for(var code=0;code<codes.length;code++){
        var codeSeries={
            name: codes[code],
            type: 'line',
            smooth: true,
            data: []
        },codeSeriesData=[];
        for (var i = 0; i < timev.length; i++) {
            if(!codeObj[codes[code]][timev[i]]){
                codeSeriesData.push(0);
            }else{
                var _thisData=!total?0:((codeObj[codes[code]][timev[i]]/total)*100).toFixed(2);
                codeSeriesData.push(_thisData);
            }
        }
        codeSeries={...codeSeries,data:codeSeriesData};
        series.push(codeSeries);
    }

    var codeYaxis = [
        {
            type: 'value',
            name: "状态码出现次数/总访问次数",
            axisLabel: {
                formatter: '{value}%'
            }
        }
    ];
    var codeOpt = towYAxisChartOpt(timeDate.time_list, codes, ["#5283bb", "#be4e4f", "#9cbb5f", "#7d609e", "#4babc4",'#88a44d', '#d98642'], codeYaxis, series);
    var optLen = codeOpt.legend,grid = {right: '12%', left: "10%"}, le = {
        ...optLen,
        top: 'middle',
        right: '2%',
        orient: "vertical"
    };
    return {"codeOpt":{...codeOpt,"grid": grid, "legend": le}};
    //echarts.init(document.getElementById("onlineChart")).setOption({...opt, "grid": grid, "legend": le});

}
export function initCodeChart(query,index,sendData){
    var _thisHistoryOpt=historyCodeOpt(query,sendData);
    echarts.init($(".code-line").get(index)).setOption(_thisHistoryOpt.codeOpt);
}
class OriginCode extends React.Component {
    constructor(state) {
        super(state);
    }
    componentDidMount() {
        const {dispatch,query,location}=this.props;
        $(".tab-code").addClass("tab-active");
        var thisTime = new Date().getTime() / 1000, dateFormat = defformat(thisTime, "-");
        var bitQuery={
            "vhost":location.query.vhost,
            "starttime": !query.starttime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000) + "" : query.starttime,
            "endtime":!query.endtime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000)+24*60*60-1+ "" : query.endtime,
            "level":!query.level ? "3/3" : query.level,
            "sourceip":""
        };
        loadingShow().then(()=>{
            setTimeout(()=> {
                var deviceData=getDevices("BackStatusCode",bitQuery),
                    devKeys=Object.keys(deviceData),
                    len=(CODEDEFAULTDEV)<devKeys.length?CODEDEFAULTDEV:devKeys.length,showDevNames=devKeys.slice(0,len),
                    showDevData=[];
                for(var i=0;i<showDevNames.length;i++){
                    showDevData.push({"devName":showDevNames[i],"devIp":deviceData[showDevNames[i]]});
                }
                var promise = new Promise(function (resolve) {
                    resolve(dispatch(addOriginCodeData({"bitQuery":bitQuery,"deviceData":deviceData,"showDevData":showDevData})));
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
                        initCodeChart(bitQuery,index,{...sendData,"sourceip":showDevData[index].devIp});
                    }
                    // initCodeChart(bitQuery,0,{...sendData,"sourceip":showDevData[0].devIp});
                });
                loadingHide();
            }, 10);
        });

    }
    initScrollData(e){
        const {originCode,dispatch}=this.props;
        const _this=this;
        var _thisDom=$(e.target),
            _contentHeight=_thisDom[0].scrollHeight,
            _height=_thisDom.height(),
            _scrollTop=_thisDom.scrollTop(),
            _scrollBottom=_contentHeight-_height-_scrollTop;
        var showDevData=originCode.showDevData,
            deviceData=originCode.deviceData,
            deviceDataNames=Object.keys(deviceData),
            bitQuery=originCode.bitQuery;
        if(showDevData.length<deviceDataNames.length){
            var showDevNames=deviceDataNames.slice(showDevData.length,showDevData.length+2);
            var addShowData=[];
            for(var i=0;i<showDevNames.length;i++){
                addShowData.push({"devName":showDevNames[i],"devIp":deviceData[showDevNames[i]]});
            }
            if(_scrollBottom<SCROLLBOTTOM){
                //加载数据
                var promise = new Promise(function (resolve) {
                    resolve(dispatch(addOriginCodeData({"showDevData":[...showDevData,...addShowData]})));
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
                    for(var i=0;i<showDevNames.length;i++){
                        initCodeChart(originCode.bitQuery,showDevData.length+i,{...sendData,"sourceip":deviceData[showDevNames[i]]});
                    }

                });
            }
        }

    }
    render() {
        const {originCode,location}=this.props;
        return (
            <div className="tab-cont" style={{"height": "600px","overflowY": "scroll"}}  onScroll={(e)=>this.initScrollData(e)}>
                <div className="row">
                    {!originCode.showDevData?"":
                        originCode.showDevData.map((item,index)=>
                                <div key={index} className="ip-block col-md-6">
                                    <div>
                                        <i className="iconfont">&#xe639;</i>
                                        <Link to={`/originCont/code/ipInfo?vhost=${!location.query.vhost?"":location.query.vhost}&selecIp=${!item.devIp?"":item.devIp}&selectName=${!item.devName?"":item.devName}`} >{item.devName}</Link>
                                    </div>
                                    <div className="code-line" style={{"height":"350px"}}></div>
                                </div>
                        )}

                    {/*<div className="ip-block col-md-6">
                        <div>
                            <i className="iconfont">&#xe639;</i>
                            <Link to={`/originCont/code/ipInfo?vhost=${!location.query.vhost?"":location.query.vhost}`}>101.71.29.130</Link>
                        </div>
                        <div style={{"height":"350px"}}></div>
                    </div>*/}
                </div>
            </div>
        )


    }
}
function getData(state) {
   // console.log(state);
    return {
        "originCode": state.originReducer.originCode,
        "query": state.originReducer.originList.query
    }
}
export default connect(getData)(OriginCode);
