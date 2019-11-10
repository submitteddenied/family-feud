import React from "react"
import ReactDOM from "react-dom"
import PlayerComponent from "./components/PlayerComponent"
import HostComponent from "./components/HostComponent"
import ScreenComponent from "./components/ScreenComponent"

import './style.css'

const wrapper = document.getElementById('base')

if(wrapper) {
  let Component = PlayerComponent
  if(wrapper.getAttribute('class') === 'host') {
    Component = HostComponent
  }
  if(wrapper.getAttribute('class') === 'screen') {
    Component = ScreenComponent
  }
  ReactDOM.render(<Component status={'connecting'} />, wrapper)

  const socket = new WebSocket('ws://localhost:80/api/ws/' + wrapper.getAttribute('class'))

  const sendMessage = (data) => {
    socket.send(JSON.stringify(data))
  }
  socket.onmessage = function(event) {
    const data = JSON.parse(event.data)
    if(data.success) {
      console.log(data)
    } else {
      console.log('Updated Game state!')
      ReactDOM.render(<Component game={data} channel={sendMessage} status={'connected'} />, wrapper)
    }
  }  
} else {
  console.log('Base element not found sad panda')
}