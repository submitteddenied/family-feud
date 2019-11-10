import React, {Component} from 'react'

class ResponseComponent extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className="response row" onClick={this.props.onClick}>
        <div class="col">
          <h2>{this.props.response ? this.props.response.response : '???'}</h2>
        </div>
        <div class="col-2">
          <h3>{this.props.response ? this.props.response.score : ''}</h3>
        </div>
      </div>
    )
  }
}

export default ResponseComponent