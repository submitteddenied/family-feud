import React, {Component} from 'react'
import ScoreComponent from './ScoreComponent'
import TeamComponent from './TeamComponent'
import ResponseComponent from './ResponseComponent'

class ScreenComponent extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    const html = document.getElementsByTagName('html')[0]
    html.addEventListener('dblclick', this.fullscreen)
  }

  fullscreen() {
    const html = document.getElementsByTagName('html')[0]
    html.requestFullscreen()
  }

  componentWillUnmount() {
    const html = document.getElementsByTagName('html')[0]
    document.exitFullscreen()
    html.removeEventListener('dblclick', this.fullscreen)
  }

  renderTeams(state) {
    const teamNames = Object.keys(state.scores)
    return teamNames.map((name, i) => (
      <TeamComponent key={i} teamIdx={i} name={name} score={state.scores[name]} />
    ))
  }

  renderBigScreen(state) {
    const result = []

    if(state.question) {
      result.push(<h1 key="q">{state.question}</h1>)
    }

    for(let i = 0; i < state.response_count; i++) {
      result.push(<ResponseComponent key={i} response={state.responses[i]} />)
    }

    return (
      <div className="big-screen col">
        {result}
      </div>
    )
  }

  render() {
    const gameState = this.props.game
    if(this.props.status === 'connecting') {
      return (
        <h1>Loading...</h1>
      )
    }
    return (
      <div className="screen-container container">
        <div className="row justify-content-center up-for-grabs">
          <ScoreComponent score={gameState.score} />
        </div>
        <div className="row justify-content-center">
          <h1>Family Feud!</h1>
        </div>
        <div className="row  justify-content-between">
          {this.renderTeams(gameState)}
        </div>
        <div className="row">
          {this.renderBigScreen(gameState)}
        </div>
      </div>
    )
  }
}

export default ScreenComponent
