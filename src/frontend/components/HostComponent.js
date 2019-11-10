import React, {Component} from 'react'
import ScoreComponent from './ScoreComponent'
import TeamComponent from './TeamComponent'
import ResponseComponent from './ResponseComponent'

class HostComponent extends Component {
  constructor() {
    super()
  }

  setTeam(idx, name) {
    this.props.channel({
      action: 'setTeam',
      teamIdx: idx,
      name: name
    })
  }

  startRound() {
    this.props.channel({
      action: 'startRound'
    })
  }

  revealQuestion() {
    this.props.channel({
      action: 'revealQuestion'
    })
  }

  revealAnswer(i) {
    this.props.channel({
      action: 'revealAnswer',
      answerIndex: i
    })
  }

  setTurn(idx) {
    this.props.channel({
      action: 'setTurn',
      teamIdx: idx
    })
  }

  strike() {
    this.props.channel({
      action: 'strike'
    })
  }

  renderTeams(state) {
    const teamNames = Object.keys(state.scores)
    return teamNames.map((name, i) => (
      <TeamComponent 
        key={i} 
        teamIdx={i} 
        name={name} 
        score={state.scores[name]} 
        playingTeam={state.playing_team}
        rename={(name) => this.setTeam(i, name)} />
    ))
  }

  renderResponses(state) {
    const result = []
    for(let i = 0; i < state.responses.length; i++) {
      const resp = state.responses[i]
      result.push(
        <div key={i} className={state.visible_responses.hasOwnProperty(i) ? 'shown' : 'hidden'} >
          <ResponseComponent response={{response: resp[0], score: resp[1]}} onClick={() => this.revealAnswer(i)} />
        </div>
      )
    }

    return result
  }

  render() {
    const gameState = this.props.game
    if(this.props.status === 'connecting') {
      return (
        <h1>Loading...</h1>
      )
    }

    const teams = this.renderTeams(gameState)
    return (
      <div className="host container">
        <div className="row justify-content-center up-for-grabs">
          <ScoreComponent score={gameState.score} />
        </div>
        <div className="row justify-content-between">
          {teams[0]}
          {['splash', 'scoreboard'].indexOf(gameState.state) !== -1
            ? <h2 onClick={() => this.startRound()}>Start round</h2>
            : <h2 onClick={() => this.strike()}>Strike!</h2>}
          {teams[1]}
        </div>
        <div className="row justify-content-between turns">
          <button className="btn btn-primary" onClick={() => this.setTurn(0)}>&lt;</button>
          <button className="btn btn-primary" onClick={() => this.setTurn(1)}>&gt;</button>
        </div>
        <div className="row" onClick={() => this.revealQuestion()}>
          <h2 className={gameState.question_visible ? 'shown' : 'hidden'}>{gameState.question}</h2>
        </div>
        <div className="col">
          {this.renderResponses(gameState)}
        </div>
      </div>
    )
  }
}

export default HostComponent