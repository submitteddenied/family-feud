import React from "react"
import ReactDOM from "react-dom"
import PlayerComponent from "./components/PlayerComponent"
import HostComponent from "./components/HostComponent"
import ScreenComponent from "./components/ScreenComponent"

import './style.css'

const wrapper = document.getElementById('base')
if(wrapper) {
  if(wrapper.getAttribute('class') === 'player') {
    ReactDOM.render(<PlayerComponent />, wrapper)
  }
  if(wrapper.getAttribute('class') === 'host') {
    ReactDOM.render(<HostComponent />, wrapper)
  }
  if(wrapper.getAttribute('class') === 'screen') {
    ReactDOM.render(<ScreenComponent />, wrapper)
  }
} else {
  console.log('Base element not found sad panda')
}