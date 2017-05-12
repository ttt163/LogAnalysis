
import React from 'react'
import { render } from 'react-dom'
export default class DeviceInfo extends React.Component {
    constructor(state) {
        super(state);
    }

    render() {
        return (
            <div>
                <iframe frameBorder="0" style={{"width":"100%","minHeight":"699px"}} src="test/devchecklist.html"></iframe>
            </div>
        )


    }
}

