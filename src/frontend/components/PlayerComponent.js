import React, {Component} from 'react'
import EnterNameComponent from './EnterNameComponent'

class PlayerComponent extends Component {
  constructor() {
    super()
    this.state = {
      name: 'Player',
      team: null
    }
  }

  updateName(name) {
    this.setState({name})
  }

  render() {
    const showNameEntry = this.state.name === 'Player'
    const showTeamSelect = !showNameEntry && this.state.team == null
    return (
      <div>
        <h1>Hello {this.state.name}</h1>
        {showNameEntry ? <EnterNameComponent nameCallback={(name) => this.updateName(name)} /> : ''}
      </div>
    )
  }
}

export default PlayerComponent