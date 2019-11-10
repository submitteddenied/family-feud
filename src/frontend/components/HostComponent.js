import React, {Component} from 'react'
import TeamComponent from './TeamComponent'

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

  renderTeams(state) {
    const teamNames = Object.keys(state.scores)
    return teamNames.map((name, i) => (
      <TeamComponent key={i} teamIdx={i} name={name} score={state.scores[name]} rename={(name) => this.setTeam(i, name)} />
    ))
  }

  render() {
    const gameState = this.props.game
    if(this.props.status === 'connecting') {
      return (
        <h1>Loading...</h1>
      )
    }

    return (
      <div className="host container">
        <div className="row justify-content-between">
          {this.renderTeams(gameState)}
        </div>
      </div>
    )
  }
}

export default HostComponent