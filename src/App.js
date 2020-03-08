import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import the react-json-view component
import ReactJson from 'react-json-view'
 
let stringyfyConditions = (json) => {
  if(json.name)
    return JSON.stringify(json)
  else {
    let newJson = {
      type: json.type,
      rules: []
    }
    json.rules.forEach(element => {
      newJson.rules.push(stringyfyConditions(element))
    });
    return newJson
  }
}

let removeAnyAny = (type, json) => {
  let newJson = JSON.parse(JSON.stringify(json))
  debugger
  let outPut = {
    type: type,
    rules: []
  }
  if(typeof newJson !== 'string'){
      if(type === 'ANY'){
        newJson.forEach((element) => {
          if(typeof element === 'string'){
            outPut.rules.push(element)
          }
          else if (element.type === 'ANY'){
            outPut.rules = outPut.rules.concat(element.rules)
          }
          else {
            outPut.rules.push(removeAnyAny(element.type, element.rules))
          }
        })
      }
      else {
        newJson.forEach(element => {
          if(typeof element !== 'string'){
            debugger
            outPut.rules.push(removeAnyAny(element.type, element.rules))
          }
          else{
            outPut.rules.push(element)
          }
        })
      } 
  }
  return outPut
}

let getFlatJSON = (json) => {
  let newJson = {rules: stringyfyConditions(json.rules)}
  for(let i = 0 ; i < 10; i++ ){
    newJson = {rules: removeAnyAny(newJson.rules.type, newJson.rules.rules)}
  }

  return newJson
}

// use the component in your app!
class App extends Component {
  render() {
    let json = require('./test.json')
    let flatJSON = getFlatJSON(json)
    return (
      <div style={{display: 'flex', marginTop: '10px'}}>
        <div style={{width: '30%'}}><ReactJson src={json} /></div>
        <div style={{width: '70%'}}><ReactJson src={{rules: stringyfyConditions(json.rules)}} /
        ><ReactJson src={flatJSON} /></div>    
      </div>
    );
  }
}


export default App;
