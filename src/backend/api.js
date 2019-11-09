const express = require('express')
const router = express.Router()

const sockets = {
  player: [],
  screen: [],
  host: []
}

const game = new require('./feud.js')(messageRole('player'), messageRole('host'), messageRole('screen'))

const rolesToActions = {
  player: ['addPlayer'],
  host: ['setTeam', 'addPlayer', 'startRound', 'revealAnswer', 'strike', 'endRound']
}

const messageRole = (role) => {
  return (data) => {
    sockets[role].forEach((ws) => {
      messageWs(ws)(data)
    })
  }
}

const messageWs = (ws) => {
  return (data) => {
    ws.send(JSON.stringify(data))
  }
}

const handleMessage = (message, role, ws) => {
  if(rolesToActions[role].indexOf(message.action) === -1) {
    return false;
  }

  if(message.action === "addPlayer") {
    return game.addPlayer(message.playerName, message.team, messageWs(ws))
  }
  
  if(message.action === "revealAnswer") {
    return game.revealAnswer(message.answerIndex)
  }

  if(message.action === "setTeam") {
    return game.setTeam(message.name)
  }

  game[message.action]()
}

router.ws('/ws/:role', (ws, req) => {
  const role = req.params.role
  sockets[role] = ws
  ws.on('close', () => {
    sockets[role] = sockets[role].filter((i) => i !== ws)
    //TODO: notify hosts that player disconnected
  })
  ws.on('message', (data) => {
    const body = JSON.parse(data)
    if(!handleMessage(body, role)) {
      ws.send(JSON.stringify({success: false, response: "You're not allowed to do that!"}))
    } else {
      ws.send(JSON.stringify({success: true, response: 'OK'}))
    }
  })
})

module.exports = router