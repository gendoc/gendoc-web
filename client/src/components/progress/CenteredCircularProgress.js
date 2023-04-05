import React from 'react';
import {CircularProgress} from "@mui/material";


const CenteredCircularProgress = (props) => {
    const style = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // optional: use a high z-index to ensure the component is displayed above other elements
    };

    return (
        <div style={style}>
            <CircularProgress {...props} />
        </div>
    );
};

export default CenteredCircularProgress;
