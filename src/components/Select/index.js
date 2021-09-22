import React from 'react';

const Select = (props) => {

    return (
        <select onChange = {(e) => props.changeHandler(e)}>
            {
                props.items && props.items.map( item => {
                    return <option key = {item} value={item}>{item}</option>
                })
            }
        </select>
    )
}

export default Select;