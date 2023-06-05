import React from 'react'

function Total({props}) {
    const totalExercises = props.reduce((sum, item) => sum + item.exercise, 0)
  return (
    <p><strong>Total of {totalExercises} exercises</strong></p>
  )
}

export default Total