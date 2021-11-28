import { SAVE_TITLE } from "../action_types";
let initState = {
  title:""
}
export default function test(preState=initState,action){
  let {type,data} = action
  let newState
  switch(type){
    case SAVE_TITLE:
      newState = {
        title:data
      }
      return newState
    
    default:
      return preState
  }
  

}