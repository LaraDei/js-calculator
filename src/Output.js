import React from 'react'

export default class Output extends React.Component {
    render(){
      return (
        <div className="Output" id='display'>
            {this.props.currentValue}
        </div>
      )
    }
  }