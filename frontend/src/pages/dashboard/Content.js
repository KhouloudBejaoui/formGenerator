import React from 'react'
import "../../assets/css/style.css"

const Content=() =>{
  
  return (
<main>
      <div className="page-header">
        <h1>Dashboard</h1>
        <small>Home / Dashboard</small>
      </div>
      <div className="page-content">
        <div className="analytics">
          <div className="card">
            <div className="card-head">
              <h2>107,200</h2>
              <span className="las la-user-friends" />
            </div>
            <div className="card-progress">
              <small>User activity this month</small>
              <div className="card-indicator">
                <div className="indicator one" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <h2>340,230</h2>
              <span className="las la-eye" />
            </div>
            <div className="card-progress">
              <small>Page views</small>
              <div className="card-indicator">
                <div className="indicator two" style={{ width: "80%" }} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <h2>$653,200</h2>
              <span className="las la-shopping-cart" />
            </div>
            <div className="card-progress">
              <small>Monthly revenue growth</small>
              <div className="card-indicator">
                <div className="indicator three" style={{ width: "65%" }} />
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head">
              <h2>47,500</h2>
              <span className="las la-envelope" />
            </div>
            <div className="card-progress">
              <small>New E-mails received</small>
              <div className="card-indicator">
                <div className="indicator four" style={{ width: "90%" }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

export default Content
