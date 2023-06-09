import React from 'react'

function Notification({type, message}) {
    if(type === null){
        return null;
    }
    return (
    <>
        <div className={type}>{message}</div>
    </>

  )
}

export default Notification