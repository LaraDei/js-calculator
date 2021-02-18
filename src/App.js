import React from 'react'
import Output from './Output'
import Input from './Input'
import Buttons from './Buttons'
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVal: '0',
      prevVal: '0',
      input: '',
      currentSign: 'pos',
      lastClicked: '',
      evaluated: false,
      endsWithOperator: /[*+-/]$/g,
      endsWithNegativeSign: /‑$/
    }
  }

  maxDigitWarning() {
    this.setState({
      currentVal: 'Digit Limit Met',
      prevVal: this.state.currentVal
    });
    setTimeout(() => this.setState({ currentVal: this.state.prevVal }), 1000);
  }

  handleNums(num){
    if (!this.state.currentVal.includes('Limit')) {
    const { currentVal, input, evaluated } = this.state
    this.setState({ evaluated: false, currentVal: num });
    if (currentVal.length > 13) {
      this.maxDigitWarning()
    }else if (evaluated) {
      this.setState({
        currentVal: num,
        formula: num !== '0' ? num : ''
      });
    } else {
    this.setState({
      currentVal:
        currentVal === '0' 
          ? num
          : currentVal + num,
      input:
        currentVal === '0' && num === '0'
          ? input === ''
            ? num
            : input
          : /([^.0-9]0|^0)$/.test(input)
          ? input.slice(0, -1) + num
          : input + num,
    })
  }
}
  }
  
  handleOpp(opp){
    if (!this.state.currentVal.includes('Limit')) {
      const { input, prevVal, evaluated } = this.state;
      this.setState({ currentVal: opp, evaluated: false});
      if (evaluated) {
        this.setState({ input: prevVal + opp });
      }  else if (!this.state.endsWithOperator.test(input)) {
        this.setState(prevState=>({
          prevVal: prevState.input,
          input: input + opp
        }));
      } else if (opp === '-' ) {
        this.setState({
          input: input + opp
        })
      } else {
        this.setState({
          input: prevVal + opp
        });
      }
    }
    console.log(this.state.input)
  }

  handledec(){
    if (this.state.evaluated === true) {
      this.setState({
        currentVal: '0.',
        input: '0.',
        evaluated: false
      });
    } else if (
      !this.state.currentVal.includes('.') &&
      !this.state.currentVal.includes('Limit')
    ) {
      this.setState({ evaluated: false });
      if (this.state.currentVal.length > 13) {
        this.maxDigitWarning();
      } else if (
        this.state.endsWithOperator.test(this.state.input) ||
        (this.state.currentVal === '0' && this.state.input === '')
      ) {
        this.setState({
          currentVal: '0.',
          input: this.state.input + '0.'
        });
      } else {
        this.setState({
          currentVal: this.state.input.match(/(-?\d+\.?\d*)$/)[0] + '.',
          input: this.state.input + '.'
        });
      }
    }
  }

  handleEquals(){
    if (!this.state.input) {
      return
    }
      let expression = this.state.input;
      console.log(expression)
      while (this.state.endsWithOperator.test(expression)) {
        expression = expression.slice(0, -1);
      }
      expression = expression
        .replace('--', '+0+');
      let sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '')
      // eslint-disable-next-line no-eval
      let answer = Math.round(1000000000000 * eval(sanitizedExpression)) / 1000000000000;
      this.setState({
        currentVal: answer.toString(),
        input:
          expression
            .replace('+0+', '‑-') + '=' +
          answer,
        prevVal: answer,
        evaluated: true
      });
  }

  handleClear(){
    this.setState({
      currentVal: '0',
      prevVal: '0',
      input: '',

      currentSign: 'pos',
      lastClicked: '',
      evaluated: false
    });
  }

  render(){
    return (
      <div className="App">
      <Output currentValue={this.state.currentVal}/>
      <Input formula={this.state.input.replace(/x/g, '⋅')}/>
      <Buttons
        clear={()=>this.handleClear()}
        solve={()=>this.handleEquals()}
        number={(e)=>this.handleNums(e.target.value)}
        operation={(e)=>this.handleOpp(e.target.value)}
        decimal={()=>this.handledec()}
        /> 
      </div>
    )
  }
}

