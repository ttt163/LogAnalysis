import React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import {ShowDiag,defformat,getMinut,randomData,historyLineOpt,cookieInfo} from  "../public/js/f.js"
import { Link} from 'react-router';
import { URL ,OPERATORS,PROVICES,LEVEL } from '../config.js';
import echarts from 'echarts'
import {addChannelCodeData,addCodeQueryData,eidtIspIsShow} from "../actions/channelActions.js"
import {getIpsDevice} from "./Channel.Bit.js"
import { Select } from 'antd';
import {loadingShow,loadingHide} from "./Loading.js"
const Option = Select.Option, levelOpt = [];
var ipsOpt = [], prvOpt = [];
//数据层级opt
for (var [k,v] of Object.entries(LEVEL)) {
    levelOpt.push(<Option key={k}>{v}</Option>);
}
class ChannelCode extends React.Component {
    constructor(state) {
        super(state);
    }

    componentDidMount() {
        const {dispatch,query,channelList}=this.props;
        const _this = this;
        //初始化数据
        var thisTime = new Date().getTime() / 1000, dateFormat = defformat(thisTime, "-"), dateTime = getMinut(thisTime, "-");
        var searchData = {
            "vhost": !query.vhost ? channelList.select_vhost : query.vhost,
            "level": !query.level ? "3/3" : query.level,
            "operators": !query.operators ? "" : query.operators,
            "province": !query.province ? "" : query.province,
            "starttime": !query.starttime ? parseInt(new Date(`${dateFormat} 00:00`).getTime() / 1000) + "" : query.starttime,
            "endtime": !query.endtime ? parseInt(thisTime) + "" : query.endtime
        };
        dispatch(addCodeQueryData({
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
            dispatch(addCodeQueryData({
                [name]: parseInt(ev.date.valueOf() / 1000) + "",
                ["v_" + name]: ev.target.value
            }));
            var deviceData = _this.upDateIps({[name]: parseInt(ev.date.valueOf() / 1000) + ""});
            dispatch(addChannelCodeData({"deviceData": deviceData}));
        });
        loadingShow().then(()=>{
            setTimeout(()=> {
                // this.initBitChart(query, channelBit.deviceData);
                //初始化运营商
                var deviceData = this.upDateIps({...searchData});
                dispatch(addChannelCodeData({"deviceData": deviceData}));

                //初始化图表
                this.initChar({ ...searchData,
                    "v_starttime": !query.v_starttime ? `${dateFormat} 00:00` : query.v_starttime,
                    "v_endtime": !query.v_endtime ? dateTime : query.v_endtime},deviceData);
                loadingHide()
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
            "protocol": "hls"
        };
        var deviceData = getIpsDevice({...devSendData, ...jsonData, ...obj});
        ipsOpt = [], prvOpt = [];
        for (var [k,v] of Object.entries(deviceData)) {
            ipsOpt.push(<Option key={k}>{!OPERATORS[k] ? k : OPERATORS[k]}</Option>);
        }
        // dispatch(addChannelBitData({"deviceData": deviceData}));
        //dispatch(addBitQueryData({"province": "", "operators": "", ...obj}));
        return deviceData;
    }

    //运营商省份联动
    getProviceByIps(deviceData, val) {
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

    //pieOpt
    codePieOpt(legendData, color, total, seriesData) {
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: '状态码: {b}<br />个数: {c}<br />总数:' + total + '<br />占比: {d}%'
            },
            color: color,
            legend: {
                orient: 'vertical',
                right: '10%',
                top: 'middle',
                data: legendData
            },
            series: [
                {
                    type: 'pie',
                    radius: '70%',
                    center: ['50%', '55%'],
                    data: seriesData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        return option;
    }

    searchCode(e) {
        e.preventDefault();
        const {query,channelCode}=this.props;
        loadingShow().then(()=>{
            setTimeout(()=> {
                this.initChar(query,channelCode.deviceData);
                loadingHide()
            }, 10);
        });
       // this.initChar(query,channelCode.deviceData);
        // var searchData=this.getCodeData(query);
        //var data={}
    }

    initChar(query,deviceData) {
        const {dispatch}=this.props;
        var searchData = this.getCodeData(query,deviceData), pieData = searchData.pieData, timeData = searchData.timeData, codeList = searchData.codeList;
        //渲染图表
       // console.log(timeData);
        var time_list = [], timev = [], series = [];
        var startTime = parseInt(new Date(query.v_starttime).getTime() / 1000), endTime = parseInt(new Date(query.v_endtime).getTime() / 1000), timeDef = endTime - startTime;
        for (var c = 0; c < codeList.length; c++) {
            var _thisCode = codeList[c], _thisSeries = {"name": _thisCode, "type": 'line', "data": []}, _data = [];
            for (var i = 0; i <= timeDef / 60; i++) {
                time_list.push(getMinut(startTime + i * 60, "-"));
                var tmpTime = startTime + i * 60 + 59 + "";
                timev.push(tmpTime);
               // console.log(_thisCode);
                //console.log(timeData[_thisCode]);
                if (!timeData[_thisCode]||!timeData[_thisCode][tmpTime]) {
                    _data.push(0);
                } else {
                    _data.push(timeData[_thisCode][tmpTime]);
                }
            }
            _thisSeries = {..._thisSeries, "data": _data};
            series.push(_thisSeries);
        }
        var opt = historyLineOpt("", time_list, codeList, series, ["#5283bb", "#be4e4f", "#9cbb5f", "#7d609e", "#4babc4"]);
        var optLen = opt.legend, optYAxis = opt.yAxis, grid = {right: '10%', left: "5%"}, le = {
            ...optLen,
            top: 'middle',
            right: '2%',
            orient: "vertical"
        };
        echarts.init(document.getElementById("codeLine")).setOption({...opt, "legend": le, "grid": grid});
        //饼图
        var legendData = codeList, color = ["#5283bb", "#be4e4f", "#9cbb5f", "#7d609e", "#4babc4"], total = pieData.total, seriesData = [];
        for (var i = 0; i < codeList.length; i++) {
            seriesData.push({value: pieData[codeList[i]], name: codeList[i]});
        }
        var pieOpt = this.codePieOpt(legendData, color, total, seriesData);
        var codePie = echarts.init(document.getElementById("codePie"));
        codePie.setOption(pieOpt);
        dispatch(addChannelCodeData({"tableData": searchData.tableData, "codeList": codeList,"pieData":pieData}));
    }

    getCodeData(query,deviceData) {
        var thisTime = new Date().getTime() / 1000;
        var jsonData = cookieInfo(thisTime);
       // var _thisIsp = query.operators;
        var sendData = {
            "vhost": query.vhost,
            "starttime": parseInt(query.starttime),
            "endtime": parseInt(query.endtime),
            "level": query.level,
            "protocol": "hls",
            "operators": !query.operators?Object.keys(deviceData).join():query.operators,
            "province": query.province
        };
        var codeList = [], tableData = {}, pieData = {}, timeData = [];
        $.ajax({
            url: `${URL}/vhost/getVhostStatusCode`,
            type: 'post',
            data: {...sendData, ...jsonData},
            async: false,  //默认为true 异步
            dataType: "json",
            error: function (error) {
            },
            success: function (res) {
                //console.log(res);
                //运营商
                for (var [k,v] of Object.entries(res)) {
                    var prvObj = {};
                    //省份
                    for (var [k1,v1] of Object.entries(v)) {
                        if (k1 != "Statuslist") {
                            var _thisprvCode = {}, total = 0;
                            //时间戳
                            for (var [k2,v2] of Object.entries(v1)) {
                                if(k2>query.starttime&&k2<query.endtime+60){
                                    //状态码
                                    for (var [k3,v3] of Object.entries(v2)) {
                                        if (!_thisprvCode[k3]) {
                                            _thisprvCode = {..._thisprvCode, [k3]: Number(v3)};
                                        } else {
                                            _thisprvCode = {..._thisprvCode, [k3]: _thisprvCode[k3] + Number(v3)};
                                        }
                                        total = total + Number(v3);
                                        var pieTotal = !pieData.total ? 0 : pieData.total;
                                        if (!pieData[k3]) {
                                            pieData = {...pieData, [k3]: Number(v3), "total": pieTotal + Number(v3)};
                                        } else {
                                            pieData = {
                                                ...pieData,
                                                [k3]: pieData[k3] + Number(v3),
                                                "total": pieTotal + Number(v3)
                                            };
                                        }
                                        if (codeList.indexOf(k3) == -1) {
                                            codeList.push(k3);
                                        }
                                        //timeData
                                        if (!timeData[k3] || $.isEmptyObject(timeData[k3])) {
                                            timeData = {...timeData, [k3]: {[k2]: Number(v3)}};
                                        } else {
                                            var _thisCode = timeData[k3], _timeObj = {
                                                ..._thisCode,
                                                [k2]: !_thisCode[k2] ? Number(v3) : _thisCode[k2] + Number(v3)
                                            };
                                            timeData = {...timeData, [k3]: _timeObj};
                                        }
                                    }
                                }

                            }
                            _thisprvCode = {..._thisprvCode, "total": total};
                            prvObj = {...prvObj, [k1]: _thisprvCode};
                        } else {
                            for (var code of Object.keys(v1)) {
                                if (codeList.indexOf(code) == -1) {
                                    codeList.push(code);
                                }
                            }
                        }
                    }
                    tableData = {...tableData, [k]: prvObj};
                }
                /*console.log(tableData);
                console.log(codeList);
                console.log(pieData);
                console.log(timeData);*/
            }
        });
        return {"tableData": tableData, "codeList": codeList, "pieData": pieData, "timeData": timeData}
    }

    initThead(codeList, level) {
        var _thStr = "";
        for (var i = 0; i < codeList.length; i++) {
            _thStr += "<th>个数</th><th>占比</th>";
        }
        var str = <thead>
        <tr>
            {level == "3/3" ? <th rowSpan="2" style={{"verticalAlign": "middle"}}>城市</th> : ""}
            <th rowSpan="2" style={{"verticalAlign": "middle"}}>访问总个数</th>
            {codeList.map((item, index)=><th key={index} colSpan="2">{item}</th>)}
        </tr>
        <tr dangerouslySetInnerHTML={{__html:_thStr}}></tr>
        </thead>;
        return str;
    }

    initr(prv,item,codeList, level) {
        var _td=level == "3/3" ? `<td>${!PROVICES[prv] ? prv : PROVICES[prv]}</td>` : "";
        var _thStr = `<tr>${_td}<td>${item.total}</td>`;
        for (var i = 0; i < codeList.length; i++) {
            _thStr += "<td>"+(!item[codeList[i]]?0:item[codeList[i]])+"</td><td>"+(!item.total||!item[codeList[i]]?0:item[codeList[i]]/item.total).toFixed(2)+"</td>";
        }
        _thStr +=`</tr>`;
        return _thStr;
    }

    render() {
        const {query,dispatch,channelCode}=this.props;
        return (
            <div className="tab-cont">
                <form className="form-horizontal mb30">
                    <div className="row">
                        <div className="col-md-11">
                            <div className="form-group">
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">运营商：</label>

                                    <div className="col-xs-9">
                                        <Select value={query.operators}
                                                onChange={(val)=>{this.getProviceByIps(!channelCode.deviceData?{}:channelCode.deviceData,val);dispatch(addCodeQueryData({"operators":val,"province":""}));}}>
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
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">数据层级：</label>

                                    <div className="col-xs-9">
                                        <Select value={query.level}
                                                onChange={(val)=>{dispatch(addChannelCodeData({"deviceData":this.upDateIps({"level":val})}));dispatch(addCodeQueryData({"level":val}))}}>
                                            {levelOpt}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">省份：</label>

                                    <div className="col-xs-9">
                                        <Select value={query.province}
                                                onChange={(val)=>dispatch(addCodeQueryData({"province":val}))}>
                                            <Option value="">请选择</Option>
                                            {prvOpt}
                                        </Select>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label className="col-xs-3 text-right control-label">结束时间：</label>

                                    <div className="col-xs-9">
                                        <input type="text" className="form-control  date-time" name="endtime"
                                               value={query.v_endtime}/>
                                    </div>
                                </div>

                            </div>
                            <div className="form-group">
                                <div className="col-md-offset-4 col-md-4 text-center">
                                    <input type="submit" className="btn btn-primary" value="查询"
                                           onClick={(e)=>this.searchCode(e)}/>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
                <div id="codeLine" style={{"height": "350px","border": "1px solid #e5e5e5"}}></div>
                <div className="row">
                <div className="col-md-7">
                    <div id="codePie" style={{"height": "450px"}}></div>
                </div>
                    <div className="col-md-4">
                        <div className="table-responsive" style={{"marginTop":"25px"}}>
                            <table className="table table-striped table-bordered table-hover">
                                <thead>
                                <tr>
                                    <th>状态码</th>
                                    <th>个数</th>
                                    <th>占比</th>
                                </tr>
                                </thead>
                                <tbody>
                                {!channelCode||!channelCode.codeList||!channelCode.pieData|| !channelCode.codeList.length ?
                                    <tr><td colSpan="3">暂无数据！</td></tr>
                                    :
                                    channelCode.codeList.map((item,index)=>
                                            <tr key={index}>
                                                <td>{item}</td>
                                                <td>{channelCode.pieData[item]}</td>
                                                <td>{((channelCode.pieData[item]/channelCode.pieData.total)*100).toFixed(2)}%</td>
                                            </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div id="tableContent" >
                    {!channelCode.tableData || !channelCode.codeList|| !channelCode.codeList.length ? "" :
                        Object.keys(channelCode.tableData).map((item, index)=>
                                <div key={index} className="row">
                                    <div className="col-xs-12">
                                        <div className="f-gradient">
                                            <h4 style={{"paddingLeft": "20px"}}>{item == "total" ? "全部" : !OPERATORS[item] ? item : OPERATORS[item]}<i
                                                style={{"verticalAlign": "middle","marginLeft": "20px","cursor": "pointer"}}
                                                className={!channelCode.tableData[item].isShow?"glyphicon glyphicon-chevron-up":"glyphicon glyphicon-chevron-down"}
                                                onClick={()=>dispatch(eidtIspIsShow(item,{"isShow":!channelCode.tableData[item].isShow}))}
                                                ></i></h4>
                                        </div>
                                        <div className="table-responsive" style={{"display":!channelCode.tableData[item].isShow?"none":"block"}}>
                                            <table className="table table-striped table-bordered table-hover">
                                                {this.initThead(channelCode.codeList, query.level)}
                                                <tbody>
                                                {Object.keys(channelCode.tableData[item]).map((prv, prvIndex)=>
                                                    prv=="isShow"?<tr key={prvIndex}></tr>:
                                                        <tr key={prvIndex} dangerouslySetInnerHTML={{__html:this.initr(prv,channelCode.tableData[item][prv],channelCode.codeList, query.level)}}></tr>

                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                        )
                    }
                </div>
            </div>
        )


    }
}
function getData(state) {
   // console.log(state);
    return {
        "channelList": state.channelReducer.channelList,
        "channelCode": state.channelReducer.channelCode,
        "query": state.channelReducer.channelCode.query
    }
}
export default connect(getData)(ChannelCode);
