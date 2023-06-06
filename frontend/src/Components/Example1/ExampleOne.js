import React from 'react'
import Course from './Course'

function ExampleOne() {

    const course = [
        {
          name: 'Half Stack application development',
          id: 1,
          parts: [
            {part: 'Fundamentals of React', exercise: 10, id: 1},
            {part: 'Using props to pass data', exercise: 7, id: 2},
            {part: 'State of a component', exercise: 14, id: 3},
            {part: 'Redux', exercise: 11, id: 4},
          ]
        },
        {
          name: 'Node.js',
          id: 2,
          parts: [
            {part: 'Routing', exercise: 3, id: 1},
            {part: 'Middlewares', exercise: 7, id: 2},
          ]
        }
    ]

  return (
    <div>
        <Course course={course} />
    </div>
  )
}

export default ExampleOne