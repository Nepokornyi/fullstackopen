import React from 'react'

function Filter({filter, setFilter}) {
  return (

    <div>
        filter: <input type="text" value={filter} onChange={(e) => {setFilter(e.target.value)}} />
    </div>
  )
}

export default Filter