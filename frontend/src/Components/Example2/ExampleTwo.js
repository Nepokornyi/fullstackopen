import React, { useState } from 'react'
import Header from '../Header'
import Button from './Button'
import Statistics from './Statistics'

function ExampleTwo() {

    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

  return (
    <div>
        <Header name='Give Feedback' />
        <Button rating={good} text='good' addToReview={setGood} />
        <Button rating={neutral} text='neutral' addToReview={setNeutral} />
        <Button rating={bad} text='bad' addToReview={setBad} />
        <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default ExampleTwo