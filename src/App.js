import React, { Component, useState } from 'react'

class App extends Component {
  state = {
    number: 0,
    name: 'xxx'
  }
  render() {
    return (
      <div>
        <div>{this.state.number}</div>
        <div>{this.state.name}</div>
        <button
          onClick={() => this.setState({ number: this.state.number + 1 })}
        >
          +
        </button>
      </div>
    )
  }
}

function App2() {
  // setNum 要改变时，number和name要同时改变，如果只改变了一个，另外一个会变成空
  let [num, setNum] = useState({ number: 0, name: 'xxx' })
  return (
    <div>
      <div>{num.number}</div>
      <div>{num.name}</div>
      <button onClick={() => setNum({ number: num.number + 1, name: 'yyyy' })}>
        +
      </button>
    </div>
  )
}

export default App2
