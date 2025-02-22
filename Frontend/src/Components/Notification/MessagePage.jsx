import React from 'react';
import { Typography } from '@mui/material';
import { CgClose } from "react-icons/cg";

const MessagePage = ({ onClose }) => {
    return (
        <div style={{ border: "1px solid #e0e0e0", minHeight: "80vh", width: "100%", borderRadius: "3vh", display: "flex", flexDirection: "column", backgroundColor: "#f9f8f0", zIndex: "1000" }}>
            <div style={{ marginLeft: "2vh", marginTop: "2vh", cursor: "pointer" }} onClick={onClose}>
                <CgClose />
            </div>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginLeft: "2vh", marginRight: "2vh", marginTop: "2vh", borderBottom: "1px solid #e0e0e0" }}>
                <Typography fontSize={"18"} fontWeight={900} color={"black"}>adityagaur@gmail.com</Typography>
            </div>
            <p>
                wnjn gndo nb fnoi gorjt grtgjio opg jrt lkngio ndrtgopigndropgi no.
            </p>
        </div>
    );
};

export default MessagePage;
