import React, {Component} from 'react'
import ScoreComponent from './ScoreComponent'
import EnterNameComponent from './EnterNameComponent'

class TeamComponent extends Component {
  constructor() {
    super()
    this.state = {
      naming: false
    }
  }

  click(e) {
    e.preventDefault()
    if(!this.state.naming) {
      this.setState({naming: true})
    }
  }

  rename(name) {
    console.log('renaming')
    if(this.props.rename) {
      this.props.rename(name)
    }

    this.setState({naming: false})
  }

  render() {
    return (
      <div className={["team", "team-" + this.props.teamIdx].join(' ')} onClick={(e) => this.click(e)}>
        {this.state.naming 
          ? <EnterNameComponent nameCallback={(name) => this.rename(name)} /> 
          : <h2>{this.props.name}</h2>}
        <ScoreComponent score={this.props.score} />
      </div>
    )
  }
}

export default TeamComponent