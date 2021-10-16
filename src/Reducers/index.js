import { combineReducers } from "redux";
import Editor from "./editor"

const reducer = combineReducers({
    editor: Editor
});

export default reducer;