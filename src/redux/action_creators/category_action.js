import {SAVE_CATEGORY} from "../action_types"

export const createSaveCateList = (value) => {
  return {type:SAVE_CATEGORY,data:value}
}