import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import io from 'socket.io-client';
import styled from "styled-components";
import './ChatBox.css'

const Page = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  align-items: center;
  justify-content:center;
  background-color: black;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 650px;
  max-height: 700px;
  overflow: auto;
  width: 700px;
  border: 1px solid lightgray;
  border-radius: 10px;
  padding-bottom: 10px;
  margin-top: 25px;
`;

const TextArea = styled.textarea`
  width: 98%;
  height: 150px;
  border-radius: 10px;
  margin-top: 10px;
  padding-left: 10px;
  padding-top: 10px;
  font-size: 17px;
  background-color: transparent;
  border: 1px solid lightgray;
  outline: none;
  color: lightgray;
  letter-spacing: 1px;
  line-height: 20px;
  ::placeholder {
    color: lightgray;
  }
`;

const Button = styled.button`
  background-color: lightgray;
  width: 100%;
  border: none;
  height: 70px;
  margin-bottom: 30px;
  border-radius: 10px;
  color: black;
  font-size: 20px;
  cursor:pointer;
  :hover {
    border: 1px solid white;
    background-color: black;
    color: white;
  }
`;

const Form = styled.form`
  width: 700px;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 1px;
`;

const MyMessage = styled.div`
  min-width: 45%;
  background-color: lightgray;
  color: #46516e;
  padding: 10px;
  margin-right: 10px;
  text-align: center;
  border-radius: 8px;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  min-width: 45%;
  background-color: transparent;
  color: lightgray;
  border: 1px solid lightgray;
  padding: 10px;
  margin-left: 10px;
  text-align: center;
  border-radius: 8px;
`;


const ChatBox1 = () => {

    const [IDone, setIDone] = useState();
    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState(''); 
    
    const socketRef = useRef();
    
    const ENDPOINT = 'https://bettercompany.herokuapp.com/'

    useEffect(() => {
      var connectionOptions =  {
        "force new connection" : true,
        "reconnectionAttempts": "Infinity", 
        "timeout" : 10000,                  
        "transports" : ["websocket"]
    };

      socketRef.current = io.connect(ENDPOINT,connectionOptions);
  
      socketRef.current.on('id', id => {
        setIDone(id);
      })

      socketRef.current.on('prev-messages', data =>{
        data.forEach(mg => {
          setMessages(messages => [...messages,mg.msg])
        })
      })
  
      socketRef.current.on('message', (message) => {
        console.log(message)
        recieveMessage(message);
      })
    },[])

    const recieveMessage = (message) => {
      setMessages(messages => [...messages,message])
    }
  
    const sendMessage = (e) => {
      e.preventDefault();
      const messageObject = {
        body:message,
        id:IDone,
        user: 'user1'
      };
      setMessage('');
      socketRef.current.emit('send message', messageObject);
    }
  
    const handleChange = (e) => {
      setMessage(e.target.value)
    }

    return (
        <Page>
        {console.log('jcjds',messages)}
          <h1 style={{color:'white',marginTop:'20px',marginBottom:'0'}}>User 1</h1>
            <Container>
            {messages.map((message, index) => {
                if (message.user === 'user1' && message.body !== "") {
                return (
                    <MyRow key={index}>
                    <MyMessage>
                        {message.body}
                    </MyMessage>
                    </MyRow>
                )
                }
                if (message.body !== ""){
                    return (
                    <PartnerRow key={index}>
                        <PartnerMessage>
                        {message.body}
                        </PartnerMessage>
                    </PartnerRow>
                    )
                }
            })}
            </Container>
              <Form onSubmit={sendMessage}>
                  <TextArea value={message} onChange={handleChange} placeholder="Type here" />
                  <Button>Send</Button>
              </Form>
      </Page>
    )
}

export default ChatBox1;
