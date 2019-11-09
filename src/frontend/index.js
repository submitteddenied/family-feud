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
  ReactDOM.render(<Component state={{connecting: true}} />, wrapper)

  const socket = new WebSocket('ws://' + document.location.host + '/api/ws/' + wrapper.getAttribute('class'))

  socket.onmessage = function(event) {
    const data = JSON.parse(event)
    ReactDOM.render(<Component state={data} channel={socket} />, wrapper)
  }  
} else {
  console.log('Base element not found sad panda')
}