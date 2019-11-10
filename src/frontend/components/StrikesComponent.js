import React, {Component} from 'react'

class StrikesComponent extends Component {
  constructor() {
    super()
  }

  renderStrikes(strikeCount) {
    const result = []
    for(let i = 0; i < strikeCount; i++) {
      result.push(<h1 key={i} className='strike'>X</h1>)
    }

    return result
  }

  render() {
    return (
      <div className="strikes">
        {this.renderStrikes(this.props.strikes)}
      </div>
    )
  }
}

export default StrikesComponent