import React, {Component} from 'react'

class ScoreComponent extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="score">
        <h2>{this.props.score}</h2>
      </div>
    )
  }
}

export default ScoreComponent