import {SAVE_PRODUCT} from "../action_types";
let initState = []
export default function test(preState=initState,action){
  let {type,data} = action
  let newState
  switch(type){
    case SAVE_PRODUCT:
      newState = [...data]
      return newState
    
    default:
      return preState
  }
  

}