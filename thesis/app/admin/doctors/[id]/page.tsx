import React from 'react'

const SingleDoctor = ({ params }: { params: { id: string } }) => {
  return (
    <div>
        <h1>      My Post: {params.id}</h1>
    </div>
  )
}

export default SingleDoctor