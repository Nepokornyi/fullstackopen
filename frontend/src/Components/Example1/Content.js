import React from 'react'
import Part from './Part'

function Content({props}) {
  return (
    <div>
        {props.map( (part) => <Part key={part.id} part={part.part} exercise={part.exercise} />)}
    </div>
  )
}

export default Content