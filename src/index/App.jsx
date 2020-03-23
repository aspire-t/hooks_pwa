import React from 'react'
import { connect } from 'react-redux'
import './App.css'

import Header from '../common/Header'
import DepartDate from './DepartDate'
import HighSpeed from './HighSpeed'
import Submit from './Submit'
import Journey from './Journey'

function App(props) {
  return (
    <div>
      <Header></Header>
      <Journey></Journey>
      <DepartDate></DepartDate>
      <HighSpeed></HighSpeed>
      <Submit></Submit>
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {},
  function mapDispatchToProps(dispatch) {}
)(App)
