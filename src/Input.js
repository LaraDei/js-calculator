import React from 'react'

export default class Input extends React.Component {
    render(){
      return (
        <div className="input">
          {this.props.formula}
        </div>
      )
    }
  }