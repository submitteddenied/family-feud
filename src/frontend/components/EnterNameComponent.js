import React, {Component} from 'react'

class EnterNameComponent extends Component {
  constructor(props) {
    super(props)
    this.textInput = React.createRef()
  }

  submit(e) {
    e.preventDefault()
    this.props.nameCallback(this.textInput.current.value)
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" placeholder="Enter name" id="name" className="form-control" ref={this.textInput} />
        <button type="submit" className="btn btn-primary" onClick={(e) => this.submit(e)}>Submit</button>
      </div>
    )
  }
}

export default EnterNameComponent