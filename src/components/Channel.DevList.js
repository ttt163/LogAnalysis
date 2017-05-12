import React ,{PropTypes}from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import {ShowDiag,mapOpt,defformat,getMinut,randomData,towYAxisChartOpt,cookieInfo } from  "../public/js/f.js"
import echarts from 'echarts'
import { Link} from 'react-router';
import { URL ,OPERATORS,PROVICES} from '../config.js';
import {addBitQueryData,addChannelBitData,editDevList} from "../actions/channelActions.js"
import {loadingShow,loadingHide} from "./Loading.js"
class ChannelDevList extends React.Component {
    constructor(state) {
        super(state);
    }

    componentWillUnmount() {
        // var path=this.props.route.path;
        // console.log(this.props);
        /* if(path.indexOf("/channel/bit")==-1){
         $(".tab-bit").removeClass("tab-active");
         }*/
        $(".tab-bit").removeClass("tab-active");
    }

    componentWillMount() {
        const {channelBit,channelList,dispatch}=this.props;
        if (!channelBit.selectIsp || !channelBit.selectPrv) {
            this.context.router.push(`/channelCont/bit?vhost=${!channelList.select_vhost ? "" : channelList.select_vhost}`);
        }
        if (!channelBit.deviceData || !channelBit.deviceData[channelBit.selectIsp] || !channelBit.deviceData[channelBit.selectIsp][channelBit.selectPrv]) {
            return;
        }
       /* var devArr = channelBit.deviceData[channelBit.selectIsp][channelBit.selectPrv], devList = [];
        console.log("111");
        console.log(devArr);
        if(!devArr.length){
            devList = [];
        }else{
            for (var i = 0; i < devArr.length; i++) {
                devList.push({"devName": devArr[0], "isShow": false});
            }
        }
        dispatch(addChannelBitData({"devList": devList}));*/
    }

    componentDidMount() {
        const {channelBit,channelList,query,dispatch}=this.props;
        $(".tab-bit").addClass("tab-active");
        var devArr = !channelBit.deviceData||!channelBit.deviceData[channelBit.selectIsp]||!channelBit.deviceData[channelBit.selectIsp][channelBit.selectPrv]?[]:channelBit.deviceData[channelBit.selectIsp][channelBit.selectPrv],
            devList = [];
        if(!devArr.length){
            devList = [];
        }else{
            for (var i = 0; i < devArr.length; i++) {
                devList.push({"devName": devArr[i], "isShow": false});
            }
        }
        dispatch(addChannelBitData({"devList": devList}));
        //总量/分发时间
        var historySendData = {
            "vhost": query.vhost,
            "level": query.level,
            "operators": channelBit.selectIsp,
            "province": channelBit.selectPrv,
            "starttime": query.starttime,
            "endtime": query.endtime,
            "protocol": query.protocol
        };
        loadingShow().then(()=>{
            setTimeout(()=> {
                this.initBitAndTimeChart(historySendData,channelBit.time_list,channelBit.historyTimestamp);
                loadingHide();
            }, 10);
        });
      //  this.initBitAndTimeChart(historySendData,channelBit.time_list,channelBit.historyTimestamp);
        /* var series=[{
         name:'总量',
         type:'line',
         data:rData3
         },{
         name:'分发时间',
         type:'line',
         yAxisIndex: 1,
         data:rData4
         }];
         var yAxis=[
         {
         type : 'value',
         name:"带宽（Mbps）",
         axisLabel : {
         formatter: '{value}'
         }
         },
         {
         type : 'value',
         name:"分发时间(s)",
         axisLabel : {
         formatter: '{value}'
         }
         }
         ];
         var opt=towYAxisChartOpt(timeData,['总量','分发时间'],['#a74843','#4672a3'],yAxis,series);
         var optLen=opt.legend,optYAxis=opt.yAxis,grid={right:'10%',left:"5%"},le={...optLen,top:'40%',right:'20px',orient:"vertical"};
         echarts.init(document.getElementById("sendTimeChart")).setOption({...opt,"legend":le,"grid":grid});*/
    }

    //历史分发时间
    getHistorySendTime(sendData) {
        // const {query,dispatch}=this.props;
        var thisTime = new Date().getTime() / 1000;
        var jsonData = cookieInfo(thisTime);
        var sendTimeData = [];
        $.ajax({
            url: `${URL}/vhost/getVhostTime`,
            type: 'post',
            data: {...sendData, ...jsonData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
            },
            success: function (res) {
                sendTimeData=res;
                /*for (var i = 0; i < timev.length; i++) {
                    if (!res[timev[i]]) {
                        sendTimeData.push(0);
                    } else {
                        sendTimeData.push((!res[timev[i]].num?0:res[timev[i]].total / res[timev[i]].num).toFixed(2));
                    }
                }*/
            }
        });
        return sendTimeData;
    }
    //历史带宽时间
    getHistoryBit(sendData) {
        // const {query,dispatch}=this.props;
        var thisTime = new Date().getTime() / 1000;
        var jsonData = cookieInfo(thisTime);
        var sendTimeData = [];
        $.ajax({
            url: `${URL}/vhost/getVhostBit`,
            type: 'post',
            data: {...sendData, ...jsonData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
            },
            success: function (res) {
               /* for (var i = 0; i < timev.length; i++) {
                    if (!res[timev[i]]) {
                        sendTimeData.push(0);
                    } else {
                        sendTimeData.push((!res[timev[i]].num?0:res[timev[i]].total / res[timev[i]].num).toFixed(2));
                    }
                }*/
                sendTimeData=res;
            }
        });
        return sendTimeData;
    }

    //带宽，分发时间
    initBitAndTimeChart(sendData,timeList,timestamp) {
        var sendTimeData = this.getHistorySendTime(sendData);
        var bitData=this.getHistoryBit(sendData);
        var historyTime=[],historyBit=[];
        for (var i = 0; i < timestamp.length; i++) {
            if (!sendTimeData[timestamp[i]]) {
                historyTime.push(0);
            } else {
                historyTime.push(!sendTimeData[timestamp[i]].num?0:(sendTimeData[timestamp[i]].total / sendTimeData[timestamp[i]].num).toFixed(2));
            }
            if (!bitData[timestamp[i]]) {
                historyBit.push(0);
            } else {
               // historyBit.push((!bitData[timeList[i]].num?0:bitData[timeList[i]].total / bitData[timeList[i]].num).toFixed(2));
                historyBit.push((bitData[timestamp[i]] / 1000 / 1000 / 60).toFixed(2));
            }
        }

        //总量/分发时间
        var series = [{
            name: '总量',
            type: 'line',
            smooth:true,
            data: historyBit
        }, {
            name: '分发时间',
            type: 'line',
            yAxisIndex: 1,
            smooth:true,
            data: historyTime
        }];
        var yAxis = [
            {
                type: 'value',
                name: "带宽（Mbps）",
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: "分发时间(s)",
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ];
        var opt = towYAxisChartOpt(timeList, ['总量', '分发时间'], ['#a74843', '#4672a3'], yAxis, series);
        var optLen = opt.legend, optYAxis = opt.yAxis, grid = {right: '10%', left: "5%"}, le = {
            ...optLen,
            top: '40%',
            right: '20px',
            orient: "vertical"
        };
        var sendTimeChart = echarts.init(document.getElementById("sendTimeChart"));
        sendTimeChart.setOption({...opt, "legend": le, "grid": grid});
    }

    //设备带宽
    getDevBitData(sendData) {
        var thisTime = new Date().getTime() / 1000;
        var jsonData = cookieInfo(thisTime);
        var sendTimeData = [];
        $.ajax({
            url: `${URL}/devinfo/getVhostByte`,
            type: 'post',
            data: {...sendData, ...jsonData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
            },
            success: function (res) {
                sendTimeData = res;
            }
        });
        return sendTimeData;
    }

    //设备在线人数
    getDevOnlineData(sendData) {
        var thisTime = new Date().getTime() / 1000;
        var jsonData = cookieInfo(thisTime);
        var sendTimeData = [];
        $.ajax({
            url: `${URL}/devinfo/getVhostOnline`,
            type: 'post',
            data: {...sendData, ...jsonData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
            },
            success: function (res) {
                sendTimeData = res;
            }
        });
        return sendTimeData;
    }

    //设备分发时间
    getDevSendTime(sendData) {
        var thisTime = new Date().getTime() / 1000;
        var jsonData = cookieInfo(thisTime);
        var sendTimeData = [];
        $.ajax({
            url: `${URL}/devinfo/getVhostTime`,
            type: 'post',
            data: {...sendData, ...jsonData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
            },
            success: function (res) {
                sendTimeData = res;
            }
        });
        return sendTimeData;
    }

    //设备慢速比
    getDevSlow(sendData) {
        var thisTime = new Date().getTime() / 1000;
        var jsonData = cookieInfo(thisTime);
        var sendTimeData = [];
        $.ajax({
            url: `${URL}/devinfo/getVhostSlow`,
            type: 'post',
            data: {...sendData, ...jsonData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
            },
            success: function (res) {
                sendTimeData = res;
            }
        });
        return sendTimeData;
    }

    initDevChart(index, devname) {
        const {channelBit,query}=this.props;
        var timeData = channelBit.time_list, timestamp = channelBit.historyTimestamp;
        var sendData = {
            "vhost": query.vhost,
            "protocol": query.protocol,
            "starttime": parseInt(query.starttime),
            "endtime": parseInt(query.endtime),
            "level": query.level,
            "operators": channelBit.selectIsp,
            "province": channelBit.selectPrv,
            "devname": devname
        };
        var devBitData = this.getDevBitData(sendData),
            devOnlineData = this.getDevOnlineData(sendData),
            devSendTime = this.getDevSendTime(sendData),
            devSlowData = this.getDevSlow(sendData);
        var bitSeriesData = [], onlineSeriesData = [], timeSeriesData = [], slowSeriesData = [], totalSeriesData = [], maxSeriesData = [],
            slowNumSeriesData = [],slowTotalSeriesData = [];
        for (var i = 0; i < timestamp.length; i++) {
            //总量
            totalSeriesData.push(0);
            //阈值
            maxSeriesData.push(100);
            //带宽
            if (!devBitData[timestamp[i]]) {
                bitSeriesData.push(0);
            } else {
                bitSeriesData.push((devBitData[timestamp[i]] / 1000 / 1000 / 60).toFixed(2));
            }
            //在线人数
            if (!devOnlineData[timestamp[i]]) {
                onlineSeriesData.push(0);
            } else {
                onlineSeriesData.push(devOnlineData[timestamp[i]]);
            }
            //分发时间
            if (!devSendTime[timestamp[i]]) {
                timeSeriesData.push(0);
            } else {
                timeSeriesData.push(!devSendTime[timestamp[i]].num?0:(devSendTime[timestamp[i]].total / devSendTime[timestamp[i]].num).toFixed(2));
            }
            //慢速比
            if (!devSlowData[timestamp[i]]) {
                slowSeriesData.push(0);
                slowNumSeriesData.push(0);
                slowTotalSeriesData.push(0);

            } else {
                slowSeriesData.push(!devSlowData[timestamp[i]].total?0:((devSlowData[timestamp[i]].error / devSlowData[timestamp[i]].total) * 100).toFixed(2));
                slowNumSeriesData.push(!devSlowData[timestamp[i]].error?0:devSlowData[timestamp[i]].error);
                slowTotalSeriesData.push(!devSlowData[timestamp[i]].total?0:devSlowData[timestamp[i]].total);

            }
        }
        //带宽/在线人数
        var series = [{
            name: '阈值',
            type: 'line',
            smooth:true,
            data: maxSeriesData
        }, {
            name: '总量',
            type: 'line',
            smooth:true,
            data: totalSeriesData
        }, {
            name: OPERATORS[channelBit.selectIsp],
            type: 'line',
            smooth:true,
            data: bitSeriesData
        }, {
            name: '在线人数',
            type: 'line',
            smooth:true,
            yAxisIndex: 1,
            data: onlineSeriesData
        }];
        var yAxis = [
            {
                type: 'value',
                name: "带宽(mbps)",
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: "在线人数",
                axisLabel: {
                    formatter: function (value) {
                        return value
                    }
                }
            }
        ];
        var opt = towYAxisChartOpt(timeData, {selected:{'阈值':false,'总量':false},data:['阈值', '总量', OPERATORS[channelBit.selectIsp], '在线人数']}, ['#a74843', '#8ba152', '#6a5784', '#de833c'], yAxis, series);
        var optLen = opt.legend, optYAxis = opt.yAxis, grid = {right: '10%', left: "5%"}, le = {
            ...optLen,
            top: '40%',
            right: '20px',
            orient: "vertical"
        };
        echarts.init($(".bit-chart").get(index)).setOption({...opt, "grid": grid, "legend": le});
        //慢速比/分发时间
        var series = [{
            name: '分发时间',
            smooth:true,
            type: 'line',
            data: timeSeriesData
        }, {
            name: '慢速比',
            type: 'line',
            smooth:true,
            yAxisIndex: 1,
            data: slowSeriesData
        }];
        var yAxis = [
            {
                type: 'value',
                name: "分发时间(s)",
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: "慢速比",
                axisLabel: {
                    formatter: function (value) {
                        return value + '%'
                    }
                }
            }
        ];
        var opt = towYAxisChartOpt(timeData, ['分发时间', '慢速比'], ['#b6a2de', '#46ccce'], yAxis, series);
        var optLen = opt.legend, optYAxis = opt.yAxis, grid = {right: '10%', left: "5%"}, le = {
            ...optLen,
            top: '40%',
            right: '20px',
            orient: "vertical"
        };
        echarts.init($(".slow-chart").get(index)).setOption({...opt, "legend": le, "grid": grid});
        //慢速次数和总次数
        var series = [{
            name: '总访问次数',
            type: 'line',
            smooth:true,
            data: slowTotalSeriesData
        }, {
            name: '慢速的次数',
            type: 'line',
            smooth:true,
            data: slowNumSeriesData
        }];
        var yAxis = [
            {
                type: 'value',
                name: "慢速次数",
                axisLabel: {
                    formatter: '{value}'
                }
            }];
        var opt = towYAxisChartOpt(timeData, ['总访问次数', '慢速的次数'], ['#b6a2de', '#46ccce'], yAxis, series);
        var optLen = opt.legend, optYAxis = opt.yAxis, grid = {right: '10%', left: "5%"}, le = {
            ...optLen,
            top: '40%',
            right: '20px',
            orient: "vertical"
        };
        echarts.init($(".total-line").get(index)).setOption({...opt, "legend": le, "grid": grid});

    }

    showChart(devName, index, isShow) {
        const {channelList,channelBit,query,dispatch}=this.props;
        const _this = this;
        var promise = new Promise(function (resolve) {
            resolve(dispatch(editDevList({"isShow": !isShow}, index)));
        });
        if (!isShow) {
            promise.then(function (value) {
                _this.initDevChart(index, devName);
            });
        }

    }

    render() {
        const {channelList,channelBit,query,dispatch}=this.props;
        return (
            <div className="tab-cont">
                <div style={{"borderBottom": "1px solid #e5e5e5"}}>
                    <i style={{"fontSize": "26px","verticalAlign": "middle","color": "#0099cb", "cursor": "pointer"}}
                       className="iconfont"
                       onClick={()=> this.context.router.push(`/channelCont/bit?vhost=${!channelList.select_vhost?"":channelList.select_vhost}`)}>&#xe605;</i>
                    <h4 className="mr10"
                        style={{"display": "inline"}}>{!channelBit.selectIsp ? "" : !OPERATORS[channelBit.selectIsp] ? channelBit.selectIsp : OPERATORS[channelBit.selectIsp]}</h4>
                    <h4 className="mr10"
                        style={{"display": "inline"}}>{!channelBit.selectPrv ? "" : !PROVICES[channelBit.selectPrv] ? channelBit.selectPrv : PROVICES[channelBit.selectPrv]}</h4>
                    <span>{query.v_starttime} ~ {query.v_endtime}</span>
                </div>
                <div id="sendTimeChart" style={{"height": "350px","border": "1px solid #e5e5e5"}}></div>
                <ul className="dev-list">
                    {!channelBit.devList || !channelBit.devList.length ? "" :
                        channelBit.devList.map((item, index)=>
                                <li key={index}>
                                    <div>
                                        {item.devName}<i onClick={()=>{ this.showChart(item.devName,index,item.isShow)}}
                                                         className={!item.isShow?"iconfont icon-down":"iconfont icon-up"}></i>
                                    </div>
                                    <div className="mb30" className="bit-chart"
                                         style={{"display":!item.isShow?"none":"block","height": "350px","border": "1px solid #e5e5e5"}}>
                                    </div>
                                    <div className="slow-chart"
                                         style={{"display":!item.isShow?"none":"block","height": "350px","border": "1px solid #e5e5e5"}}>
                                    </div>
                                    <div className="total-line"
                                         style={{"display":!item.isShow?"none":"block","height": "350px","border": "1px solid #e5e5e5"}}>
                                    </div>
                                </li>
                        )
                    }
                </ul>
            </div>
        )


    }
}
function getData(state) {
   // console.log(state);
    return {
        "channelList": state.channelReducer.channelList,
        "channelBit": state.channelReducer.channelBit,
        "query": state.channelReducer.channelBit.query
    }
}
export default connect(getData)(ChannelDevList);
ChannelDevList.contextTypes = {
    router: PropTypes.object
}
