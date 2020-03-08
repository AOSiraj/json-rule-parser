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

let sort = (type, json) => {
  let outPut = {
    type: type,
    rules: []
  }
  let temp = []
  json.forEach((element) => {
    if(typeof element === 'string')
      outPut.rules.push(element)
    else 
      temp.push(element)
  })
  temp.forEach((element) => {
    outPut.rules.push(sort(element.type, element.rules))
  })
  return outPut
}

let removeType = (type, json, TYPE) => {
  let newJson = JSON.parse(JSON.stringify(json))
  // debugger
  let outPut = {
    type: type,
    rules: []
  }
  if(typeof newJson !== 'string'){
      if(type === TYPE){
        newJson.forEach((element) => {
          if(typeof element === 'string'){
            outPut.rules.push(element)
          }
          else if (element.type === TYPE){
            outPut.rules = outPut.rules.concat(element.rules)
          }
          else {
            outPut.rules.push(removeType(element.type, element.rules, TYPE))
          }
        })
      }
      else {
        newJson.forEach(element => {
          if(typeof element !== 'string'){
            // debugger
            outPut.rules.push(removeType(element.type, element.rules, TYPE))
          }
          else{
            outPut.rules.push(element)
          }
        })
      } 
  }
  let output = {
    type: outPut.type,
    rules: []
  }
  let combinedAnyArray = []
  outPut.rules.forEach(element => {
    if(typeof element === 'string'){
      
      output.rules.push(element)
    }
    else if( element.type !== 'ANY'){
      output.rules.push(element)
    }
    else {
      combinedAnyArray = combinedAnyArray.concat(element.rules)
    }
  })


  if(combinedAnyArray.length > 0) {
    output.rules = output.rules.concat({
      type: 'ANY', 
      rules: combinedAnyArray
    })
  }
  return output
}

let removeAllAny = (type, json) => {
  let newJson = JSON.parse(JSON.stringify(json))
  let outPut = {
    type: type,
    rules: []
  }
  if(typeof newJson !== 'string'){
      if(type === 'ALL'){
        debugger
        let temp = []
        let anyArr = null
        newJson.forEach((element) => {
          if(typeof element === 'string'){
            temp.push(element)
          }
          else if (element.type !== 'ANY'){
            temp.push(element)
          }
          else {
            anyArr = element
          }
        })
        if(anyArr !== null){
          outPut.type = 'ANY'
          anyArr.rules.forEach(element => {
            outPut.rules.push({
              type: 'ALL',
              rules: [...temp, element]
            })
          })
        }
        else{
          outPut.rules = temp
        }
      } 
      else {
        newJson.forEach(element => {
          if(typeof element !== 'string'){
            outPut.rules.push(removeAllAny(element.type, element.rules))
          }
          else{
            outPut.rules.push(element)
          }
        })
      } 
  }
  return outPut
}

let parseANY = (json) => {
  let newJson = json
  for(let i = 0 ; i < 10; i++ ){
    // remove ANY ANY
    newJson = {rules: removeType(newJson.rules.type, newJson.rules.rules, 'ANY')}
    // pull strings up
    newJson = {rules: sort(newJson.rules.type, newJson.rules.rules)}
  }

  return newJson
} 

let parseALL = (json) => {
  let newJson = json
  for(let i = 0 ; i < 10; i++ ){
    // remove ALL ALL
    newJson = {rules: removeType(newJson.rules.type, newJson.rules.rules, 'ALL')}
    // pull strings up
    newJson = {rules: sort(newJson.rules.type, newJson.rules.rules)}
  }

  return newJson
} 

let parseAllAny = (json) => {
  //remove All Any
  let newJson = json
  for(let i = 0 ; i < 10; i++ ){
    newJson = {rules: removeAllAny(json.rules.type, json.rules.rules)}
  }
  return newJson
}

let combinationParse = (json) => {
  let newJson = json
  for(let i = 0 ; i < 10; i++ ){
    // remove ANY ANY
    newJson = {rules: removeType(newJson.rules.type, newJson.rules.rules, 'ANY')}
    // pull strings up
    newJson = {rules: sort(newJson.rules.type, newJson.rules.rules)}
    // remove ALL ALL
    newJson = {rules: removeType(newJson.rules.type, newJson.rules.rules, 'ALL')}
    // pull strings up
    newJson = {rules: sort(newJson.rules.type, newJson.rules.rules)}
    //remove All Any
    debugger
    newJson = {rules: removeAllAny(newJson.rules.type, newJson.rules.rules)}
  }
  // newJson = {rules: removeAllAny(newJson.rules.type, newJson.rules.rules)}


  return newJson
}
// use the component in your app!
class App extends Component {
  render() {
    let json = require('./test.json')
    let stringConditions = {rules: stringyfyConditions(json.rules)}
    // let parsedAny = parseANY(stringConditions)
    // let parsedAll = parseALL(parsedAny)
    // let parsedAllAny = parseAllAny(parsedAll)
    let parsedAllAny = combinationParse(stringConditions)
    return (
      <div style={{display: 'flex', marginTop: '10px'}}>
        {/* <div style={{width: '30%'}}><ReactJson src={json} /></div> */}
        {/* <div style={{width: '70%'}}><ReactJson src={{rules: stringyfyConditions(json.rules)}} /> */}
        {/* <ReactJson src={parsedAny} />    */}
        {/* <ReactJson src={parsedAll} />    */}
        <ReactJson src={parsedAllAny} />
        {/* </div>     */}
      </div>
    );
  }
}


export default App;
