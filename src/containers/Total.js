import React ,{PropTypes}from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import echarts from 'echarts'
import  'echarts/map/js/china'
import {ShowDiag,mapOpt,defformat,getMinut,historyLineOpt,cookieInfo,getDateRange} from  "../public/js/f.js"
import { Link} from 'react-router';
import { URL ,OPERATORS,PROVICES,TYPE,DEFMINUTER,DEFSENCOD,DEFOPERATORS,DEFOPERATORSOBJ} from '../config.js';
import { Select } from 'antd';
const Option = Select.Option, typeOpt = [], ispOpt = [];
import {addChannelTotalData,addTotalQueryData} from "../actions/channelActions.js"
import {loadingShow,loadingHide} from "../components/Loading.js"
//协议opt
for (var [k,v] of Object.entries(TYPE)) {
    typeOpt.push(<Option key={k}>{v}</Option>);
}
//运营商
for (var [isp,ispIndex] of Object.entries(OPERATORS)) {
    ispOpt.push(<Option key={isp}>{ispIndex}</Option>);
}
class Total extends React.Component {
    constructor(state) {
        super(state);
    }

    componentDidMount() {
        const {dispatch,query}=this.props;
        const _this = this;
        //初始化数据
        var thisTime = new Date().getTime() / 1000, dateFormat = defformat(thisTime, "-"), dateTime = getMinut(thisTime, "-"), timestamp = parseInt(new Date(dateTime).getTime() / 1000) - DEFMINUTER * 60 + DEFSENCOD;
        var searchData = {
            "timestamp": !query.timestamp ? timestamp : query.timestamp,
            "protocol": !query.protocol ? "" : query.protocol,
            "level": !query.level ? "3/3" : query.level,
            "operators": !query.operators ? "" : query.operators,
            "province": !query.province ? "" : query.province,
            "starttime": !query.starttime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000) + "" : query.starttime,
            "endtime": !query.endtime ? parseInt(thisTime) + "" : query.endtime
        };
        dispatch(addTotalQueryData({
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
            dispatch(addTotalQueryData({
                [name]: parseInt(ev.date.valueOf() / 1000) + "",
                ["v_" + name]: ev.target.value
            }));
            if (name == "endtime") {
                var timestamp = parseInt(ev.date.valueOf() / 1000) - DEFMINUTER * 60 + DEFSENCOD;
                dispatch(addTotalQueryData({"timestamp": timestamp}));
            }

        });
        loadingShow().then(()=> {
            setTimeout(()=> {
                //初始化图表
                this.initChart({
                    ...searchData,
                    "v_starttime": !query.v_starttime ? `${dateFormat} 00:00` : query.v_starttime,
                    "v_endtime": !query.v_endtime ? dateTime : query.v_endtime
                });
                loadingHide();
            }, 10);
        });

    }

    getTotalData(_obj) {
        const {query,dispatch}=this.props;
        var thisTime = new Date().getTime() / 1000;
        var cookie = cookieInfo(thisTime), _query = {...query, ..._obj};
        var sendData = {
            "timestamp": _query.timestamp,
            "protocol": _query.protocol,
            "level": _query.level,
            "operators": _query.operators,
            "province": _query.province,
            "starttime": _query.starttime,
            "endtime": _query.endtime
        };
        /*var sendData = {
         "timestamp": "1489028159",
         "protocol": "hls",
         "level": "3/3",
         "operators": "",
         "province": "",
         "starttime": "1488988800",
         "endtime": "1489028318"
         };*/
        var retData = {};
        $.ajax({
            url: `${URL}/vhost/getVhostTotalByte`,
            type: 'post',
            data: {...sendData, ...cookie},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
                return {"mapData": {}, "lineData": {}};
            },
            success: function (res) {
                retData = {"mapData": res.single, "lineData": res.list};
            }
        });
        return retData;
    }

    lineChartOpt(query, lineData, startTime, endTime) {
        // const {query,dispatch}=this.props;;
        var series = {
            name: '带宽',
            type: 'line',
            smooth: true,
            data: []
        };
        var timeDate = getDateRange(startTime, endTime);
        var bitTimeData = [], timev = timeDate.timev;
        for (var i = 0; i < timev.length; i++) {
            if (!lineData || !lineData[timev[i]]) {
                bitTimeData.push(0);
            } else {
                bitTimeData.push((lineData[timev[i]] / 1000 / 1000 / 60).toFixed(2));
            }
        }
        series = {...series, "data": bitTimeData};
        var opt = historyLineOpt("带宽数据（Mbps）", timeDate.time_list, [], series);
        //dispatch(addChannelBitData({"time_list":timeDate.time_list,"historyBitData":bitTimeData,"historyTimestamp":timev}));
        return {...opt}

    }

    mapChartOpt(mapData) {
        var max = 1;
        var seriesObj = {
            name: "带宽",
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
        var seriesData = [];
        if (!$.isEmptyObject(mapData)) {
            for (var [k,v] of Object.entries(mapData)) {
                var value = (Number(v) / 60 / 1000 / 1000).toFixed(2);
                if (value > 0) {
                    var _obj = {"name": !PROVICES[k] ? k : PROVICES[k], "value": value};
                    seriesData.push(_obj);
                    if (parseInt(max) < parseInt(value)) {
                        max = value;
                    }
                }
            }
        }
        seriesObj = {...seriesObj, "data": seriesData};
        var option = mapOpt("客户端流量", [], [seriesObj], 2, ["#c33530"], max);
        return option
    }

    initChart(query) {
        const {dispatch}=this.props;
        const _this = this;
        var totalData = this.getTotalData({...query});
        var mapOpt = this.mapChartOpt(totalData.mapData);
        var chnbitChart = echarts.init(document.getElementById("bit-map"));
        chnbitChart.setOption(mapOpt);
        chnbitChart.on('click', function (params) {
            // console.log(params);
            var name = params.name, selectPrv = "";
            for (var [k,v] of Object.entries(PROVICES)) {
                if (v == name) {
                    selectPrv = k;
                }
            }
            dispatch(addChannelTotalData({"selectIsp": query.operators, "selectPrv": selectPrv}));
            dispatch(addTotalQueryData({
                "modalStartTime": query.starttime,
                "modalEndTime": query.endtime,
                "v_modalStartTime": query.v_starttime,
                "v_modalEndTime": query.v_endtime
            }));
            $("#bitLine_modal").modal();
            $("#bitLine_modal").off("shown.bs.modal");
            $("#bitLine_modal").on("shown.bs.modal", function () {
                _this.historySearch({
                    "starttime": query.starttime,
                    "endtime": query.endtime,
                    "province": selectPrv
                }, query.v_starttime, query.v_endtime);
            });
        });
        //历史带宽
        var lineOpt = this.lineChartOpt(query, totalData.lineData, query.v_starttime, query.v_endtime);
        var bitChart = echarts.init(document.getElementById("bit-chart"));
        bitChart.setOption(lineOpt);
    }

    //查询
    searchBit(e) {
        e.preventDefault();
        (!function (e) {
            function t(a) {
                if (i[a])return i[a].exports;
                var n = i[a] = {exports: {}, id: a, loaded: !1};
                return e[a].call(n.exports, n, n.exports, t), n.loaded = !0, n.exports
            }

            var i = {};
            return t.m = e, t.c = i, t.p = "", t(0)
        })([function (e, t) {
            "use strict";
            Object.defineProperty(t, "__esModule", {value: !0});
            var i = window;
            t["default"] = i.flex = function (e, t) {
                var a = e || 100, n = t || 1, r = i.document, o = navigator.userAgent, d = o.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i), l = o.match(/U3\/((\d+|\.){5,})/i), c = l && parseInt(l[1].split(".").join(""), 10) >= 80, p = navigator.appVersion.match(/(iphone|ipad|ipod)/gi), s = i.devicePixelRatio || 1;
                p || d && d[1] > 534 || c || (s = 1);
                var u = 1 / s, m = r.querySelector('meta[name="viewport"]');
                m || (m = r.createElement("meta"), m.setAttribute("name", "viewport"), r.head.appendChild(m)), m.setAttribute("content", "width=device-width,user-scalable=no,initial-scale=" + u + ",maximum-scale=" + u + ",minimum-scale=" + u), r.documentElement.style.fontSize = a / 2 * s * n + "px"
            }, e.exports = t["default"]
        }]);

        flex(100, 1);
        const {query,dispatch}=this.props;
        loadingShow().then(()=> {
            setTimeout(()=> {
                this.initChart(query);
                loadingHide();
            }, 10);
        });
    }

;
    //modal 查询
    historySearch(obj, start, end) {
        //历史带宽
        const {dispatch,query}=this.props;
        var totalData = this.getTotalData({...obj});
        var lineOpt = this.lineChartOpt(query, totalData.lineData, start, end);
        var bitChart = echarts.init(document.getElementById("modalChart"));
        bitChart.setOption(lineOpt);
    }

    render() {
        const {query,dispatch,channelTotal}=this.props;
        return (
            <div className="tab-cont">
                <form className="form-horizontal mb30">
                    <div className="row">
                        <div className="col-md-11">
                            <div className="form-group">
                                <div className="col-md-6">
                                    <label className="col-xs-3 text-right control-label">查询类型：</label>

                                    <div className="col-xs-9">
                                        <Select value={query.protocol}
                                                onChange={(val)=>{dispatch(addTotalQueryData({"protocol":val}));}}>
                                            <Option value="">全部</Option>
                                            {typeOpt}
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="col-xs-3 text-right control-label">运营商：</label>

                                    <div className="col-xs-9">
                                        <Select value={query.operators}
                                                onChange={(val)=>{dispatch(addTotalQueryData({"operators":val}));}}>
                                            <Option value="">请选择</Option>
                                            {ispOpt}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-6">
                                    <label className="col-xs-3 text-right control-label">起始时间：</label>

                                    <div className="col-xs-9">
                                        <input type="text" className="form-control date-time" name="starttime"
                                               value={query.v_starttime}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
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
                    <div id="bit-map" style={{"height":"500px"}}></div>
                    <div id="bit-chart" style={{"height":"350px","marginTop":"30px"}}></div>
                </div>
                {/*modal*/}
                <div className="modal fade" id="bitLine_modal" role="dialog" aria-labelledby="myModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <div className="m-close"></div>
                                </button>
                                <h4 className="modal-title">{!channelTotal.selectIsp ? "" : !OPERATORS[channelTotal.selectIsp] ? channelTotal.selectIsp : OPERATORS[channelTotal.selectIsp]}&nbsp;&nbsp;&nbsp;&nbsp;
                                    {!channelTotal.selectPrv ? "" : !PROVICES[channelTotal.selectPrv] ? channelTotal.selectPrv : PROVICES[channelTotal.selectPrv]}</h4>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal check f-formSet1">
                                    <div className="form-group">
                                        <div className="col-md-5">
                                            <div className="row">
                                                <label className="col-xs-3 control-label"><span className="red">*</span>
                                                    起始时间:</label>

                                                <div className="col-xs-9">
                                                    <input type="text" className="form-control date-time"
                                                           name="modalStartTime"
                                                           value={query.v_modalStartTime}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="row">
                                                <label className="col-xs-3 control-label"><span className="red">*</span>
                                                    结束时间:</label>

                                                <div className="col-xs-9">
                                                    <input type="text" className="form-control date-time"
                                                           name="modalEndTime"
                                                           value={query.v_modalEndTime}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <input type="submit" className="btn btn-primary" value="查询"
                                                   onClick={(e)=>{e.preventDefault();this.historySearch({"starttime":query.modalStartTime,"endtime":query.modalEndTime,"province":channelTotal.selectPrv},query.v_modalStartTime,query.v_modalEndTime)}}
                                                />
                                        </div>
                                    </div>
                                </form>
                                <div id="modalChart" style={{"height":"350px"}}></div>

                            </div>
                        </div>
                    </div>
                </div>
                { /*---*/}
            </div>
        )


    }
}
function getData(state) {
    // console.log(state);
    return {
        "channelTotal": state.channelReducer.channelTotal,
        "query": state.channelReducer.channelTotal.query
    }
}
export default connect(getData)(Total);
Total.contextTypes = {
    router: PropTypes.object
}
