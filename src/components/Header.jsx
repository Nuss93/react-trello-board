import React from 'react'

export default function Header() {
  return (
    <div className='header'>
        <h1 className="mb-0">Trello Dupe</h1>
        <div>Workspace</div>
        <div>Recent</div>
        <div>Starred</div>
        <div>Plus</div>
        <div className='right'>
            <div>search</div>
            <div>bell</div>
            <div>profile pic</div>
        </div>
    </div>
  )
}
