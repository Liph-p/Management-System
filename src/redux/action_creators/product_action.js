import {SAVE_PRODUCT} from "../action_types";

export const createSaveProduct = (value) => {
  return {type:SAVE_PRODUCT,data:value}
}