import React ,{PropTypes}from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import echarts from 'echarts'
import  'echarts/map/js/china'
import {ShowDiag,mapOpt,defformat,getMinut,historyLineOpt,cookieInfo,getDateRange} from  "../public/js/f.js"
import { Link} from 'react-router';
import { URL ,OPERATORS,PROVICES,LEVEL,TYPE,DEFMINUTER,DEFSENCOD,DEFOPERATORS,DEFOPERATORSOBJ} from '../config.js';
import { Select } from 'antd';
const Option = Select.Option, leveOpt = [], typeOpt = [];
var ipsOpt = [], prvOpt = [];
import {addBitQueryData,addChannelBitData} from "../actions/channelActions.js"
import {loadingShow,loadingHide} from "./Loading.js"
export function getIpsDevice(_data) {
    var retData = [];
    $.ajax({
        url: `${URL}/vhost/getDevName`,
        type: 'post',
        data: _data,
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
class ChannelBit extends React.Component {
    constructor(state) {
        super(state);
    }

    componentDidMount() {
        $(".f-channel").addClass("f-curr");
        const {dispatch,query,channelList,location}=this.props;
        const _this = this;
        $(".tab-bit").addClass("tab-active");
        //数据层级opt
        for (var [k,v] of Object.entries(LEVEL)) {
            leveOpt.push(<Option key={k}>{v}</Option>);
        }
        for (var [k,v] of Object.entries(TYPE)) {
            typeOpt.push(<Option key={k}>{v}</Option>);
        }
        //初始化数据
        var thisTime = new Date().getTime() / 1000, dateFormat = defformat(thisTime, "-"), dateTime = getMinut(thisTime, "-"), timestamp = parseInt(new Date(dateTime).getTime() / 1000) - DEFMINUTER * 60 + DEFSENCOD;
        var searchData = {
            "vhost": location.query.vhost,
            "timestamp": !query.timestamp ? timestamp : query.timestamp,
            "protocol": !query.protocol ? "hls" : query.protocol,
            "level": !query.level ? "3/3" : query.level,
            "operators": !query.operators ? "" : query.operators,
            "province": !query.province ? "" : query.province,
            "starttime": !query.starttime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000) + "" : query.starttime,
            "endtime": !query.endtime ? parseInt(thisTime) + "" : query.endtime
        };
        dispatch(addBitQueryData({
            ...searchData,
            "v_starttime": !query.v_starttime ? `${dateFormat} 00:00` : query.v_starttime,
            "v_endtime": !query.v_endtime ? dateTime : query.v_endtime
        }));

        //时间插件
        $('.date-time').datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayBtn: true,
            minView: 0,
            pickerPosition: "bottom-left"
        }).on("changeDate", function (ev) {
            var name = ev.target.name;
            dispatch(addBitQueryData({
                [name]: parseInt(ev.date.valueOf() / 1000) + "",
                ["v_" + name]: ev.target.value
            }));
            _this.upDateIps({[name]: parseInt(ev.date.valueOf() / 1000) + ""});
            if (name == "endtime") {
                var timestamp = parseInt(ev.date.valueOf() / 1000) - DEFMINUTER * 60 + DEFSENCOD;
                dispatch(addBitQueryData({"timestamp": timestamp}));
            }

        });
        loadingShow().then(()=>{
            setTimeout(()=> {
               // this.initBitChart(query, channelBit.deviceData);
                //加载运营商省份
                var deviceData = this.upDateIps({...searchData});
                //初始化图表
                this.initBitChart({
                    ...searchData,
                    "v_starttime": !query.v_starttime ? `${dateFormat} 00:00` : query.v_starttime,
                    "v_endtime": !query.v_endtime ? dateTime : query.v_endtime
                }, deviceData);
                loadingHide();
            }, 10);
        });


    }

    //更新运营商
    upDateIps(obj) {
        var thisTime = new Date().getTime() / 1000;
        const {dispatch,query}=this.props;
        var jsonData = cookieInfo(thisTime);
        var devSendData = {
            "vhost": query.vhost,
            "level": query.level,
            "starttime": query.starttime,
            "endtime": query.endtime,
            "protocol": query.protocol
        };
        var deviceData = getIpsDevice({...devSendData, ...jsonData, ...obj});
        ipsOpt = [], prvOpt = [];
        for (var [k,v] of Object.entries(deviceData)) {
            ipsOpt.push(<Option key={k}>{!OPERATORS[k] ? k : OPERATORS[k]}</Option>);
        }
        dispatch(addChannelBitData({"deviceData": deviceData}));
        dispatch(addBitQueryData({"province": "", "operators": "", ...obj}));
        return deviceData;
    }

    //运营商省份联动
    getProviceByIps(val) {
        const {dispatch,channelBit,query}=this.props;
        var deviceData = channelBit.deviceData;
        prvOpt = [];
        if (!deviceData || !deviceData[val]) {
            prvOpt = [];
        } else {
            var prvObj = deviceData[val];
            for (var [k,v] of Object.entries(prvObj)) {
                prvOpt.push(<Option key={k}>{!PROVICES[k] ? k : PROVICES[k]}</Option>);
            }
        }
    }

    bitChartOpt(query, deviceData) {
        const {dispatch}=this.props;
        var sendData = {
            "vhost": query.vhost,
            "level": query.level,
            "operators": !query.operators ? Object.keys(deviceData).join() : query.operators,
            "province": query.province,
            "starttime": query.starttime,
            "endtime": query.endtime,
            "protocol": query.protocol
        };
        var thisTime = new Date().getTime() / 1000;
        var jsonData = cookieInfo(thisTime);
        var option = {}, bitData = {};
        var series = {
            name: '带宽',
            type: 'line',
            data: []
        };
        $.ajax({
            url: `${URL}/vhost/getVhostBit`,
            type: 'post',
            data: {...sendData, ...jsonData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
            },
            success: function (res) {
                bitData = res;
            }
        });
        var timeDate = getDateRange(query.v_starttime, query.v_endtime);
        var bitTimeData = [], timev = timeDate.timev;
        for (var i = 0; i < timev.length; i++) {
            if (!bitData[timev[i]]) {
                bitTimeData.push(0);
            } else {
                bitTimeData.push((bitData[timev[i]] / 1000 / 1000 / 60).toFixed(2));
            }
        }
        series = {...series, "data": bitTimeData};
        var opt = historyLineOpt("带宽数据（Mbps）", timeDate.time_list, ["带宽"], series);
        //var optLen=opt.legend,grid={y2:"35%"},le={...optLen, y: 265};
        //return {...opt,"legend":le,"grid":grid};
        dispatch(addChannelBitData({
            "time_list": timeDate.time_list,
            "historyBitData": bitTimeData,
            "historyTimestamp": timev
        }));
        return {...opt}

    }

    bitMapOpt(sendData) {
        var thisTime = new Date().getTime() / 1000;
        var jsonData = cookieInfo(thisTime);
        var thisIsp = sendData.operators;
        var series = [], option = {}, max = 1;
        var seriesObj = {
            name: !OPERATORS[thisIsp] ? thisIsp : OPERATORS[thisIsp],
            type: 'map',
            mapType: 'china',
            roam: false,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            data: []
        };
        $.ajax({
            url: `${URL}/vhost/getInstantaneousByte`,
            type: 'post',
            data: {...sendData, ...jsonData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
            },
            success: function (res) {
                //console.log(res);
                var seriesData = [];
                if (!$.isEmptyObject(res)) {
                    for (var [k,v] of Object.entries(res[thisIsp])) {
                        if (!$.isEmptyObject(v)) {
                            for (var val of Object.values(v)) {
                                var _thisVal = (Number(val) / 1000 / 1000 / 60).toFixed(2);
                                if (_thisVal > 0) {
                                    var obj = {"name": !PROVICES[k] ? k : PROVICES[k], "value": _thisVal};
                                    if (parseInt(_thisVal) > parseInt(max)) {
                                        max = _thisVal;
                                    }
                                    seriesData.push(obj);
                                }

                            }
                        }
                        /*if ($.isEmptyObject(v)) {
                         obj = {...obj, "value": 0}
                         } else {
                         for (var val of Object.values(v)) {
                         var _thisVal=(Number(val) / 1000 / 1000 / 60).toFixed(2);
                         obj = {...obj, "value": _thisVal};
                         if(parseInt(_thisVal)>parseInt(max)){
                         max=_thisVal;
                         }
                         }
                         }*/

                    }
                }
                seriesObj = {...seriesObj, "data": seriesData}
            }
        });
        var color = ["red"];
        //if(thisIsp=="UNI"){color=['rgba(255, 51, 51, 1)']}else if(thisIsp=="CHN"){color=['rgba(0, 51, 51, 1)']}else if(thisIsp=="CMN"){color=['rgba(0, 153, 255, 1)']}
        series.push(seriesObj);
        option = mapOpt(!OPERATORS[thisIsp] ? thisIsp : OPERATORS[thisIsp] + "客户端流量", [{
            name: !OPERATORS[thisIsp] ? thisIsp : OPERATORS[thisIsp],
            icon: 'circle'
        }], series, 2, ["#c33530"], max);
        return option
    }

    timeMapOpt(sendData) {
        var thisTime = new Date().getTime() / 1000;
        var jsonData = cookieInfo(thisTime);
        var thisIsp = sendData.operators;
        var series = [], option = {}, max = 1;
        var seriesObj = {
            name: !OPERATORS[thisIsp] ? thisIsp : OPERATORS[thisIsp],
            type: 'map',
            mapType: 'china',
            roam: false,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            data: []
        };
        $.ajax({
            url: `${URL}/vhost/getInstantaneousTime`,
            type: 'post',
            data: {...sendData, ...jsonData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
            },
            success: function (res) {
                var seriesData = [];
                if (!$.isEmptyObject(res)) {
                    for (var [k,v] of Object.entries(res[thisIsp])) {
                        if (!$.isEmptyObject(v)) {
                            for (var [key,val] of Object.entries(v)) {
                                var _thisVal = (val.total / val.num).toFixed(2);
                                if (_thisVal > 0) {
                                    // obj = {...obj, "value":_thisVal };
                                    var obj = {"name": !PROVICES[k] ? k : PROVICES[k], "value": _thisVal};
                                    seriesData.push(obj);
                                    if (Math.round(_thisVal) > max) {
                                        max = Math.round(_thisVal);
                                    }
                                }

                            }
                        }
                        /*if ($.isEmptyObject(v)) {
                         obj = {...obj, "value": 0}
                         } else {
                         for (var [key,val] of Object.entries(v)) {
                         var _thisVal=(val.total / val.num).toFixed(2);
                         obj = {...obj, "value":_thisVal };
                         if(Math.round(_thisVal)>max){
                         max=Math.round(_thisVal);
                         }
                         }
                         }*/
                        //seriesData.push(obj);
                    }
                }
                seriesObj = {...seriesObj, "data": seriesData};
            }
        });
        var color = ["red"];
        //if(thisIsp=="UNI"){color=['rgba(255, 51, 51, 1)']}else if(thisIsp=="CHN"){color=['rgba(0, 51, 51, 1)']}else if(thisIsp=="CMN"){color=['rgba(0, 153, 255, 1)']}
        series.push(seriesObj);
        option = mapOpt(!OPERATORS[thisIsp] ? thisIsp : OPERATORS[thisIsp] + "客户端平均时长", [{
            "name": !OPERATORS[thisIsp] ? thisIsp : OPERATORS[thisIsp],
            icon: 'circle'
        }], series, 1, ["#c33530"], max);
        return option
    }

    initBitChart(query, deviceData) {
        const {dispatch,channelList,channelBit}=this.props;
        const _this = this;
        var thisIsp = query.operators;
        if (thisIsp == "") {
            for (var i = 0; i < DEFOPERATORS.length; i++) {
                //流量
                var prv = !deviceData[DEFOPERATORS[i]] ? "" : Object.keys(deviceData[DEFOPERATORS[i]]).join();
                var sendData = {
                    "vhost": query.vhost,
                    "level": query.level,
                    "timestamp": query.timestamp,
                    //"timestamp":1487269859,
                    "operators": DEFOPERATORS[i],
                    "province": query.province == "" ? prv : query.province,
                    "protocol": query.protocol
                };
                var chnbitChart = echarts.init(document.getElementById(DEFOPERATORS[i] + "-bit"));
                chnbitChart.setOption(this.bitMapOpt(sendData));
                chnbitChart.on('click', function (params) {
                    // console.log(params);
                    var name = params.name, selectPrv = "";
                    for (var [k,v] of Object.entries(PROVICES)) {
                        if (v == name) {
                            selectPrv = k;
                        }
                    }
                    dispatch(addChannelBitData({
                        "selectIsp": DEFOPERATORSOBJ[params.seriesName],
                        "selectPrv": selectPrv
                    }));
                    var path = `/channelCont/bit/devList?vhost=${!channelList.select_vhost ? "" : channelList.select_vhost}`;
                    _this.context.router.push(path);
                    //location.href="devList.html";
                });
                //分发时间
                var chnTimeChart = echarts.init(document.getElementById(DEFOPERATORS[i] + "-time"));
                chnTimeChart.setOption(this.timeMapOpt(sendData));
            }
        }
        else {
            //流量
            var prv = !thisIsp ? "" : Object.keys(deviceData[thisIsp]).join();
            var sendData = {
                "vhost": query.vhost,
                "level": query.level,
                "timestamp": query.timestamp,
                //"timestamp":1487269859,
                "operators": thisIsp,
                "province": query.province == "" ? prv : query.province,
                "protocol": query.protocol
            };
            var chnbitChart = echarts.init(document.getElementById(thisIsp + "-bit"));
            chnbitChart.setOption(this.bitMapOpt(sendData));
            chnbitChart.on('click', function (params) {
                //console.log(params);
                var name = params.name, selectPrv = "";
                for (var [k,v] of Object.entries(PROVICES)) {
                    if (v == name) {
                        selectPrv = k;
                    }
                }
                dispatch(addChannelBitData({"selectIsp": thisIsp, "selectPrv": selectPrv}));
                var path = `/channelCont/bit/devList?vhost=${!channelList.select_vhost ? "" : channelList.select_vhost}`;
                _this.context.router.push(path);
                //location.href="devList.html";
            });
            //分发时间
            var chnTimeChart = echarts.init(document.getElementById(thisIsp + "-time"));
            chnTimeChart.setOption(this.timeMapOpt(sendData));
        }
        //历史带宽

        var chatOpt = this.bitChartOpt(query, deviceData);
        var bitChart = echarts.init(document.getElementById("bit-chart"));
        bitChart.setOption(chatOpt);
    }



    //查询
    searchBit(e) {
        e.preventDefault();
        const {query,dispatch,channelBit}=this.props;
        loadingShow().then(()=>{
            setTimeout(()=> {
                this.initBitChart(query, channelBit.deviceData);
                //$(".loading").css({"display": "none"});
                loadingHide();
            }, 10);
        });
        // $(".loading").css({"display":"block"});
        //this.initBitChart(query, channelBit.deviceData);
        /*var prom = new Promise(function (resolve) {
         console.log("kkk");
         // $(".loading").css({"display":"block"});
         resolve();
         //loadingShow()
         $(".loading").css({"display":"block"});
         console.log("jjj");

         });
         prom.then(()=>{
         this.initBitChart(query, channelBit.deviceData);
         });*/
       /* $(".loading").css({"display": "block"});
        setTimeout(()=> {
            this.initBitChart(query, channelBit.deviceData);
            $(".loading").css({"display": "none"});
        }, 10);*/
        /* var defer = $.Deferred();
         defer.resolve(this.initBitChart(query, channelBit.deviceData));*/

    }

    render() {
        const {query,dispatch,channelBit}=this.props;
        return (
            <div className="tab-cont">
                <form className="form-horizontal mb30">
                    <div className="row">
                        <div className="col-md-11">
                            <div className="form-group">
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">查询类型：</label>

                                    <div className="col-xs-9">
                                        <Select value={query.protocol}
                                                onChange={(val)=>{this.upDateIps({"protocol":val})}}>
                                            {typeOpt}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">运营商：</label>

                                    <div className="col-xs-9">
                                        <Select value={query.operators}
                                                onChange={(val)=>{this.getProviceByIps(val);dispatch(addBitQueryData({"operators":val}));}}>
                                            <Option value="">请选择</Option>
                                            {ipsOpt}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">起始时间：</label>

                                    <div className="col-xs-9">
                                        <input type="text" className="form-control date-time" name="starttime"
                                               value={query.v_starttime}/>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">数据层级：</label>

                                    <div className="col-xs-9">
                                        <Select value={query.level} onChange={(val)=>{this.upDateIps({"level":val})}}>
                                            {leveOpt}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">省份：</label>

                                    <div className="col-xs-9">
                                        <Select value={query.province}
                                                onChange={(val)=>dispatch(addBitQueryData({"province":val}))}>
                                            <Option value="">请选择</Option>
                                            {prvOpt}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">结束时间：</label>

                                    <div className="col-xs-9">
                                        <input type="text" className="form-control date-time" name="endtime"
                                               value={query.v_endtime}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-1">
                            <input type="submit" className="btn btn-primary mt30" value="查询"
                                   onClick={(e)=>this.searchBit(e)}/>
                        </div>
                    </div>
                </form>
                <div>
                    <div className="bit-map">
                        {!query.operators || query.operators == "" ?
                            DEFOPERATORS.map((item, index)=>
                                    <div key={index} className="row mb30">
                                        <div id={`${item}-bit`} className="box col-md-6" style={{"height":"500px"}}>
                                        </div>
                                        <div id={`${item}-time`} className="box col-md-6" style={{"height":"500px"}}>
                                        </div>
                                    </div>
                            )
                            :
                            <div className="row mb30">
                                <div id={`${query.operators}-bit`} className="box col-md-6" style={{"height":"500px"}}>
                                </div>
                                <div id={`${query.operators}-time`} className="box col-md-6" style={{"height":"500px"}}>
                                </div>
                            </div>
                        }
                    </div>
                    <div id="bit-chart" style={{"height":"350px","marginTop":"30px"}}></div>
                </div>

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
export default connect(getData)(ChannelBit);
ChannelBit.contextTypes = {
    router: PropTypes.object
}
