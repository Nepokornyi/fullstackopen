import React from 'react'
import Header from '../Header'
import Content from './Content'
import Total from './Total'

function Course({course}) {
  return (
    <>
      {
        course.map((content) => {
          return(
            <div key={content.id}>
              <Header name={content.name} />  
              <Content props={content.parts} />
              <Total props={content.parts} />
            </div>
          )

        })
      }

    </>
  )
}

export default Course