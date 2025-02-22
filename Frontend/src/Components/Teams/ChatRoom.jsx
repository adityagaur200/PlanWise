import { Avatar, Box, Stack, Typography, TextField, Button } from '@mui/material'
import React, { useState } from 'react'
import { IoCallOutline,IoVideocamOutline } from "react-icons/io5";
import { VscSend } from "react-icons/vsc";

const ChatRoom = () => {
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])

    const handleChange = (e) => {
        setMessage(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (message.trim()) {
            setMessages([...messages, message])
            setMessage("")
        }
    }
    
  return (
    <>
    <div style={{display:"flex",flexDirection:"column", border:"1px solid #e0e0e0",borderRadius:"1vh"}}> 
        <div style={{width:"100%" ,height:"8vh", borderBottom:"1px solid #e0e0e0" ,display:"flex" ,justifyContent:"space-between" ,alignItems:"center",padding:"0.5vh"}}>
            <Box display={"flex"} gap={2} alignItems={"center"} marginLeft={"1vh"}>
                <Avatar sx={{width:40,height:40}}/>
                <Typography fontSize={20} fontWeight={600}>John Doe</Typography>
            </Box>
            <Box display={"flex"} gap={2} marginRight={"1vh"}>
                <IoCallOutline  size={30}/>
                <IoVideocamOutline size={30}/>
            </Box>
        </div>
        <div style={{width:"100%" ,height:"75vh",display:"flex",flexDirection:"row"}}>
            <div style={{width:"50%" ,height:"100%",display:"flex",flexDirection:"column"}}>
                {messages.map((msg, index) => (
                    <div key={index} style={{border:"1px solid #e0e0e0",padding:"1vh",borderRadius:"1vh",maxWidth:"80%",alignSelf:"flex-start",marginLeft:"1.5vh",marginTop:"1vh",marginBottom:"1vh"}}>
                        <Typography>{msg}</Typography>
                    </div>
                ))} 
            </div>
            <div style={{width:"50%" ,height:"100%",display:"flex",flexDirection:"column"}}>
                {messages.map((msg, index) => (
                    <div key={index} style={{border:"1px solid #e0e0e0",padding:"1vh",borderRadius:"1vh",maxWidth:"80%",alignSelf:"flex-end",marginRight:"1.5vh",marginTop:"1vh",marginBottom:"1vh"}}>
                        <Typography>{msg}</Typography>
                    </div>
                ))}
            </div>
        </div>
    </div>
        <div style={{width:"100%" ,height:"10vh",display:"flex",flexDirection:"row",marginTop:"1vh",gap:"1vh"}}>
            <TextField  sx={{height:"10vh",width:"100%"}} value={message} onChange={handleChange} onSubmit={handleSubmit} />
            <VscSend size={40} onClick={handleSubmit} style={{alignSelf:"center"}}/>

        </div> 
    
    </>
  )
}

export default ChatRoom
