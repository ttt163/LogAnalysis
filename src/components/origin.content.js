import React ,{PropTypes}from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import echarts from 'echarts'
import  'echarts/map/js/china'
import {ShowDiag,mapOpt,defformat,getMinut,randomData,historyLineOpt} from  "../public/js/f.js"
import { Link} from 'react-router';
import { URL } from '../config.js';
import {addChannelData} from "../actions/channelActions.js"
class OriginContent extends React.Component {
    constructor(state) {
        super(state);
    }
    componentWillUnmount() {
       // var path=this.props.route.path;
        //if(path.indexOf("/channel")==-1){
            $(".f-origin").removeClass("f-curr");
        //}
    }
    componentWillMount() {
        const {location,dispatch}=this.props;
        var vhost=location.query.vhost;
        dispatch(addChannelData({"select_vhost":vhost}));
    }

    componentDidMount() {
        $(".f-origin").addClass("f-curr");
    }
    render() {
        const {channelList,location}=this.props;
        return (
            <div>
                <div className="b-header mb30">
                    <div className="row">
                        <div className="col-xs-11"><h4>{!location.query.vhost?"":location.query.vhost}</h4></div>
                        <div className="iconfont"><i className="back" title="返回"
                                                     onClick={()=> this.context.router.push("/originInfo")}>&#xe62a;</i>
                        </div>
                    </div>
                </div>
                <div className="tab-box">
                    <div className="tab clearfix">
                        <Link to={`/originCont/bit?vhost=${!location.query.vhost?"":location.query.vhost}`} style={{"width": "162px"}} className="br0 tab-bit" activeClassName="tab-active">带宽/回源时间/慢速</Link>
                        <Link to={`/originCont/code?vhost=${!location.query.vhost?"":location.query.vhost}`} style={{"width": "162px"}} className="tab-code" activeClassName="tab-active">状态码</Link>
                    </div>
                    {this.props.children}
                </div>
            </div>
        )


    }
}
function getData(state) {
    //console.log(state);
    return {
        "channelList":state.channelReducer.channelList
    }
}
export default connect(getData)(OriginContent);
OriginContent.contextTypes={
    router: PropTypes.object
}