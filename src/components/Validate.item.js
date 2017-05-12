import React, {
    Component,
    PropTypes
    } from 'react'
export default class ValidateItem extends Component {
    render() {
       // console.log(this.props);
        //console.log(this.props.index);
        const {validator,thisForm,field,index,children,itemType,formType,formIndex}=this.props;

        return (
            <div>
                {formType=="arr"?
                    itemType!="1" ?
                    <div
                        className={!validator || !validator[thisForm]||!validator[thisForm][formIndex] || !validator[thisForm][formIndex].valideMsg || !validator[thisForm][formIndex].valideMsg[field] || validator[thisForm][formIndex].valideMsg[field].isValider?"":"has-error"}>
                        {children}
                        <div
                            style={{"textAlign":"left"}}>{!validator || !validator[thisForm]||!validator[thisForm][formIndex] || !validator[thisForm][formIndex].valideMsg || !validator[thisForm][formIndex].valideMsg[field] || validator[thisForm][formIndex].valideMsg[field].isValider ? "" : validator[thisForm][formIndex].valideMsg[field].error}</div>
                    </div>
                        :
                        <div
                            className={!validator || !validator[thisForm]||!validator[thisForm][formIndex] || !validator[thisForm][formIndex].valideMsg || !validator[thisForm][formIndex].valideMsg[field] || !validator[thisForm][formIndex].valideMsg[field][index]||validator[thisForm][formIndex].valideMsg[field][index].isValider?"":"has-error"}>
                            {children}
                            <div
                                style={{"textAlign":"left"}}>{!validator || !validator[thisForm]||!validator[thisForm][formIndex] || !validator[thisForm][formIndex].valideMsg || !validator[thisForm][formIndex].valideMsg[field]||!validator[thisForm][formIndex].valideMsg[field][index] || validator[thisForm][formIndex].valideMsg[field][index].isValider ? "" : validator[thisForm][formIndex].valideMsg[field][index].error}</div>
                        </div>
                    :
                    itemType!="1" ?
                    <div
                        className={!validator||!validator[thisForm]||!validator[thisForm].valideMsg||!validator[thisForm].valideMsg[field]||validator[thisForm].valideMsg[field].isValider?"":"has-error"}>
                        {children}
                        <div
                            style={{"textAlign":"left"}}>{!validator || !validator[thisForm] || !validator[thisForm].valideMsg || !validator[thisForm].valideMsg[field] || validator[thisForm].valideMsg[field].isValider ? "" : validator[thisForm].valideMsg[field].error}</div>
                    </div>
                    :
                    <div
                        className={!validator||!validator[thisForm]||!validator[thisForm].valideMsg||!validator[thisForm].valideMsg[field]||!validator[thisForm].valideMsg[field][index]||validator[thisForm].valideMsg[field][index].isValider?"":"has-error"}>
                        {children}

                        <div
                            style={{"textAlign":"left"}}>{!validator || !validator[thisForm] || !validator[thisForm].valideMsg || !validator[thisForm].valideMsg[field] || !validator[thisForm].valideMsg[field][index] || validator[thisForm].valideMsg[field][index].isValider ? "" : validator[thisForm].valideMsg[field][index].error}</div>
                    </div>
                }
            </div>
        )
    }
}