import { ADD_DEV,ADD_ISP,DEL_ISP,EDIT_DEV,EDIT_IPS} from '../actions/actions'
export default function devices(state = {}, action) {
    switch (action.type) {
        case ADD_DEV:
            var _data=action.data;
            return {...state,..._data}
        case ADD_ISP:
            var _data=action.data;
            state.ips=[...state.ips,_data]
            return {...state}
        case DEL_ISP:
            var ips=state.ips;
            state.ips=[...ips.slice(0,action.index),...ips.slice(action.index+1)]
            return {...state}
        case EDIT_DEV:
            var _data=action.data;
            return {...state,..._data}
        case EDIT_IPS:
            var ips=state.ips, thisIps=ips[action.index],_data=action.data;
            state.ips[action.index]={...thisIps,..._data};
            return {...state}
        default:
            return state
    }
}