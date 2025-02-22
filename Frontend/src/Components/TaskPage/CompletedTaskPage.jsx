import React from 'react'
import CompletedTask from './CompletedTask'

const CompletedTaskPage = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div style={{display: 'flex', flexDirection: 'column', width: '100%',gap:"0.5vh"}}>
        <CompletedTask />
        <CompletedTask />
        <CompletedTask />
        <CompletedTask />
      </div>
      
    </div>
  )
}

export default CompletedTaskPage
