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

const TEAM_TEMPLATE = () => ({
  name: '',
  score: 0,
  players: []
})

class Feud {
  constructor(playerStateUpdate, hostStateUpdate, screenStateUpdate) {
    this.teams = [TEAM_TEMPLATE(), TEAM_TEMPLATE()]
    this.state = SPLASH
    this.sub_state = null
    this.round = 0
    this.strikes = 0
    this.points = 0
    this.turn = null
    this.question = null
    this.responses = []
    this.visibleResponses = {}
    this.question_visible = false
    this.playerStateUpdate = playerStateUpdate
    this.hostStateUpdate = hostStateUpdate
    this.screenStateUpdate = screenStateUpdate
  }

  getTeams() {
    return Object.keys(this.teams)
  }

  setTeam(idx, name) {
    this.teams[idx].name = name
  }

  addPlayer(name, team, message) {
    const teamObj = this.teams.find((t) => t.name === team)
    teamObj.players.push({
      name,
      message
    });
  }

  startRound() {
    if([SPLASH, SCOREBOARD].indexOf(this.state) == -1) {
      throw new Error("Can't start a new round until this round is over")
    }

    if(this.state != SPLASH) {
      this.round++
      if(this.round > Math.min(this.teams[this.teamNames[0]].players, this.teams[this.teamNames[1]].players)) {
        this.round = 0
      }
    }

    this.question_visible = false
    this.points = 0
    this.question = QUESTION_KEYS[Math.floor(Math.random() * QUESTION_KEYS.length)]
    this.responses = QUESTIONS[this.question]
    this.visibleResponses = {}
    this.state = FACE_OFF
    this.sub_state = WAITING_BUZZ

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
    if(this.question_visible) {
      throw new Error("Can't reveal question that's already visible")
    }
    this.question_visible = true
    this.updateState()
  }

  swapControl() {
    if(this.turn === this.teams[0].name) {
      this.turn = this.teams[1].name
    } else {
      this.turn = this.teams[0].name
    }
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

        this.updateState()
      }
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
    this.updateState()
  }

  endRound() {
    const team = this.controllingTeam()
    team.points += this.points
    this.visibleResponses = this.responses.reduce((memo, r, idx) => {
      memo[idx] = {response: r[RESPONSE], score: r[SCORE]}
      return memo
    }, {})
    this.state = SCOREBOARD
    this.updateState()
  }

  updateState() {
    const players = [
      this.teams[0].players[this.round], 
      this.teams[1].players[this.round]
    ]

    const scores = {
      [this.teams[0].name]: this.teams[0].score,
      [this.teams[1].name]: this.teams[1].score
    }

    const commonData = {
      players: players.map((p) => p.name),
      state: this.state,
      sub_state: this.sub_state,
      score,
      scores,
      response_count: this.responses.length,
      playing_team: ''
    }

    if(this.turn) {
      commonData.playing_team = this.turn
    }

    this.hostStateUpdate(Object.assign({
      question: this.question,
      responses: this.responses
    }, commonData))

    const playerVisibleInfo = {}
    if(this.question_visible) {
      playerVisibleInfo.question = this.question
      playerVisibleInfo.responses = this.visibleResponses
    }
    this.screenStateUpdate(Object.assign({}, commonData))

    this.playerStateUpdate(Object.assign({
      buzzing: false
    }, commonData))

    if(this.state === FACE_OFF && this.sub_state === WAITING_BUZZ) {
      players.forEach((p) => {
        p.message(Object.assign({buzzing: true}, commonData))
      })
    }
  }
}

module.exports = Feud