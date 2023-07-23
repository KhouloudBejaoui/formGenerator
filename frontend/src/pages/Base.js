import React from 'react'
import Sidebar from '../components/Sidebar'
import "../assets/css/style.css"
import Navbar from '../components/Navbar'

const Base = (props) => {
    return (
        <>
            <Sidebar />
            <div className="main-content">
                <Navbar />
                {props.children}
            </div>
        </>
    )
}

export default Base
