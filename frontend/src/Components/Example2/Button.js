import React from 'react'

function Button({text, rating, addToReview}) {

    const handleReview = () => {
        addToReview(rating + 1)
    }

  return (
    <button onClick={handleReview}>{text}</button>
  )
}

export default Button