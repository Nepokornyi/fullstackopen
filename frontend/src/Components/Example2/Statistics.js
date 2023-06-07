import React from 'react'
import Header from '../Header'

function Statistics({good, neutral, bad}) {
  const review = good || neutral || bad
  return (
    <div>
      {review ? 
        (<>
          <Header name='Statistic' />
          <p>good: {good}</p>
          <p>neutral: {neutral}</p>
          <p>bad: {bad}</p>
          <p>all: {good + neutral + bad}</p>
          <p>average: {(good - bad) / 9}</p>
          <p>positive: {good / (good + neutral + bad) * 100}%</p>
        </>)
        :
        (<>
          <p>No feedback given.</p>
        </>)
      }

    </div>
  )
}

export default Statistics