import React, { useState } from 'react';
import './SideBar.css'

const SideBar = (props) => {
    const toggleSettings = props.toggleSettings
    // console.log(props.banner)

    const handleToggleSettings = () => {
        toggleSettings()

    };

    return (
        <nav className='side-bar-container'>
            <button type='button' id='' className='round-button'></button>
            <button type='button' id='upload-csv' className='square-button'></button>
            <button type='button' id='' className='square-button'></button>
            <button type='button' id='settings' className='round-button' onClick={handleToggleSettings}></button>
        </nav>
    );
};

export default SideBar;