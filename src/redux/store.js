//最核心的管理者
//从redux中引入createStore,创建最核心的store对象
import {createStore,applyMiddleware} from "redux"
import thunk from "redux-thunk"
import {composeWithDevTools} from "redux-devtools-extension"
import reducers from "./reducers";

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))
