'use client'

import { useState } from "react";
import { Box, Stack, TextField, Button } from '@mui/material'

export default function Home() {

  const prompt = "Print a random sentence"
  //state variable for the user prompt
  const [input, setInput] = useState('Print hello in french!')
  //state variable for the ai response output
  const [output, setOutput] = useState('This is not a quote')

  //messages = user and ai responses to be displayed in bubble chats
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])

  //message = text field value
  const [message, setMessage] = useState('') 
  
  const sendMessage = async () => {
    setMessage('')  // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },  // Add the user's message to the chat
    ])

    //function to send prompt to model
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({ body: message })
        })

        const data = await response.json()
        if (response.ok) {
          setMessages((messages) => [
            ...messages, 
            { role: 'assistant', content: data.output },  
          ])
        } else {
          setMessages(data.error)
        }

      } catch (error) {
        console.log("Post request error: %s", error)
      }
  }



  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}