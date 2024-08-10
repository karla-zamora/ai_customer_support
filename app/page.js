'use client'

import { useEffect, useState, useRef } from "react";
import { Box, Stack, TextField, Button } from '@mui/material'

export default function Home() {

  //messages = user and ai responses to be displayed in bubble chats
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])

  //message = text field value
  const [message, setMessage] = useState('')
  //to disable send button while loading
  const [isLoading, setIsLoading] = useState(false)
  //to scroll down for every new message
  const messagesEndRef = useRef(null)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return; // Empty message check
    setMessage('')  // Clear text field
    setIsLoading(true)
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
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    //response was received
    setIsLoading(false)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  //scroll to bottom of each new message
  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
          <div id="end-of-msg" ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <Button variant="contained"
            onClick={sendMessage} 
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}