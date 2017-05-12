import React ,{PropTypes}from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import echarts from 'echarts'
import  'echarts/map/js/china'
import {ShowDiag,mapOpt,defformat,getMinut,randomData,historyLineOpt} from  "../public/js/f.js"
import { Link} from 'react-router';
import { URL } from '../config.js';
import {addChannelData} from "../actions/channelActions.js"
class ChannelContent extends React.Component {
    constructor(state) {
        super(state);
    }
    componentWillUnmount() {
       // var path=this.props.route.path;
        //if(path.indexOf("/channel")==-1){
            $(".f-channel").removeClass("f-curr");
        //}
    }
    componentWillMount() {
        const {location,dispatch}=this.props;
        var vhost=location.query.vhost;
        dispatch(addChannelData({"select_vhost":vhost}));
    }

    componentDidMount() {
        $(".f-channel").addClass("f-curr");
    }
    render() {
        const {channelList,location}=this.props;
        return (
            <div>
                <div className="b-header mb30">
                    <div className="row">
                        <div className="col-xs-11"><h4>{!location.query.vhost?"":location.query.vhost}</h4></div>
                        <div className="iconfont"><i className="back" title="返回"
                                                     onClick={()=> this.context.router.push("/channel")}>&#xe62a;</i>
                        </div>
                    </div>
                </div>
                <div className="tab-box">
                    <div className="tab clearfix">
                        <Link to={`/channelCont/bit?vhost=${!location.query.vhost?"":location.query.vhost}`} className="br0 tab-bit" activeClassName="tab-active">带宽</Link>
                        <Link to={`/channelCont/code?vhost=${!location.query.vhost?"":location.query.vhost}`} activeClassName="tab-active">状态码</Link>
                    </div>
                    {this.props.children}
                </div>
            </div>
        )


    }
}
function getData(state) {
  //  console.log(state);
    return {
        "channelList":state.channelReducer.channelList
    }
}
export default connect(getData)(ChannelContent);
ChannelContent.contextTypes={
    router: PropTypes.object
}