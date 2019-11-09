import React, {Component} from 'react'
import ScoreComponent from './ScoreComponent'

class TeamComponent extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className={["team", "team-" + this.props.teamIdx].join(' ')}>
        <h2>{this.props.name}</h2>
        <ScoreComponent score={this.props.score} />
      </div>
    )
  }
}

export default TeamComponent