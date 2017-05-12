
import React,{PropTypes,Component} from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
export default class TestSub extends Component {
    constructor(state) {
        super(state);
    }

    render() {
        return (
            <div>
               子组件：{this.context.name}
            </div>

        );
    }

}
TestSub.contextTypes={
    name: React.PropTypes.string.isRequired
}
/*function sel(state) {
    console.log(state);
    return {user:state.isLogin}
}
export default connect(sel)(Test)*/


