const QUESTIONS = require('./FF3-trimmed.json')
const QUESTION_KEYS = Object.keys(QUESTIONS)

//states
const SPLASH = 'splash',
      FACE_OFF = 'face-off',
      WAITING_BUZZ = 'waiting-buzz',
      ANSWERING = 'answering',
      STEALING = 'stealing',
      SCOREBOARD = 'scoreboard'

const RESPONSE = 0
const SCORE = 1

const TEAM_TEMPLATE = (i) => ({
  name: 'Team ' + i,
  score: 0,
  players: []
})

class Feud {
  constructor(playerStateUpdate, hostStateUpdate, screenStateUpdate) {
    this.teams = [TEAM_TEMPLATE(1), TEAM_TEMPLATE(2)]
    this.state = SPLASH
    this.sub_state = null
    this.round = 0
    this.strikes = 0
    this.score = 0
    this.turn = null
    this.question = null
    this.responses = []
    this.visibleResponses = {}
    this.questionVisible = false
    this.playerStateUpdate = playerStateUpdate
    this.hostStateUpdate = hostStateUpdate
    this.screenStateUpdate = screenStateUpdate
    console.log('Starting a new game of feud!')
  }

  setTeam(idx, name) {
    this.teams[idx].name = name
    this.updateState()
  }

  addPlayer(name, team, message) {
    const teamObj = this.teams.find((t) => t.name === team)
    teamObj.players.push({
      name,
      message
    });
  }

  startRound() {
    if(this.state != SPLASH) {
      this.round++
    }

    this.questionVisible = false
    this.score = 0
    this.strikes = 0
    this.question = QUESTION_KEYS[Math.floor(Math.random() * QUESTION_KEYS.length)]
    this.responses = QUESTIONS[this.question]
    this.visibleResponses = {}
    this.state = ANSWERING
    this.sub_state = WAITING_BUZZ
    this.turn = null

    this.updateState()
  }

  buzzPlayer(team, name) {
    const teamObj = this.teams.find((t) => t.name === team)
    if(teamObj.players[this.round].name !== name || this.state !== FACE_OFF) {
      throw new Error('Not your turn to buzz!')
    }

    if(this.sub_state === WAITING_BUZZ) {
      // this player won!
      this.sub_state = ANSWERING
      this.turn = teamObj.name
    } else {
      //this player loses :(
    }

    this.updateState()
  }

  revealQuestion() {
    if(this.questionVisible) {
      throw new Error("Can't reveal question that's already visible")
    }
    this.questionVisible = true
    this.updateState()
  }

  swapControl() {
    if(this.turn === this.teams[0].name) {
      this.turn = this.teams[1].name
    } else {
      this.turn = this.teams[0].name
    }
  }

  setTurn(idx) {
    this.turn = this.teams[idx].name
    this.updateState()
  }

  controllingTeam() {
    return this.teams.find((t) => t.name === this.turn)
  }

  strike() {
    if(this.state === FACE_OFF) {
      this.swapControl()
      this.updateState()
      return
    }

    if(this.state === ANSWERING) {
      this.strikes++
      if(this.strikes === 3) {
        this.state = STEALING
        this.swapControl()
      }
      this.updateState()
      return
    }

    if(this.state === STEALING) {
      this.swapControl()
      this.endRound()
    }
  }

  revealAnswer(idx) {
    const response = this.responses[idx]
    this.visibleResponses[idx] = {
      response: response[RESPONSE],
      score: response[SCORE]
    }
    this.score += response[SCORE]
    let roundOver = true;
    for(let i = 0; i < this.responses.length; i++) {
      if(!this.visibleResponses.hasOwnProperty(i)) {
        roundOver = false;
        break;
      }
    }
    if(this.state === STEALING || roundOver) {
      this.endRound()
    } else {
      this.updateState()
    }
  }

  endRound() {
    for(let i = 0; i < this.teams.length; i++) {
      if(this.teams[i].name === this.turn) {
        console.log('new score for ' + this.turn + ' ' + this.score)
        this.teams[i].score = this.teams[i].score + this.score
      }
    }
    console.log(JSON.stringify(this.teams))
    this.visibleResponses = this.responses.reduce((memo, r, idx) => {
      memo[idx] = {response: r[RESPONSE], score: r[SCORE]}
      return memo
    }, {})
    this.state = SCOREBOARD
    this.updateState()
  }

  updateState() {
    const scores = {
      [this.teams[0].name]: this.teams[0].score,
      [this.teams[1].name]: this.teams[1].score
    }

    const commonData = {
      state: this.state,
      sub_state: this.sub_state,
      strikes: this.strikes,
      score: this.score,
      scores,
      response_count: this.responses.length,
      playing_team: ''
    }
    
    if(this.teams[0].players.length > 0 && this.teams[0].players.length > 0 ) {
      const players = [
        this.teams[0].players[this.round],
        this.teams[1].players[this.round]
      ]
      commonData.players = players.map((p) => p.name)
    }

    if(this.turn) {
      commonData.playing_team = this.turn
    }

    const hostData = Object.assign({
      question: this.question,
      question_visible: this.questionVisible,
      responses: this.responses,
      visible_responses: this.visibleResponses
    }, commonData)

    this.hostStateUpdate(hostData)
    //console.log(JSON.stringify(hostData))
    
    const playerVisibleInfo = {
      responses: this.visibleResponses
    }
    if(this.questionVisible) {
      playerVisibleInfo.question = this.question
    }
    this.screenStateUpdate(Object.assign({}, playerVisibleInfo, commonData))

    this.playerStateUpdate(Object.assign({
      buzzing: false
    }, playerVisibleInfo, commonData))

    if(this.state === FACE_OFF && this.sub_state === WAITING_BUZZ) {
      if(this.teams[0].players.length > 0 && this.teams[0].players.length > 0 ) {
        const players = [
          this.teams[0].players[this.round],
          this.teams[1].players[this.round]
        ]
        players.forEach((p) => {
          p.message(Object.assign({buzzing: true}, commonData))
        })
      }
    }
  }
}

module.exports = Feud