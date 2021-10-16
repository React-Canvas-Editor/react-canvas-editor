import {
    SET_CANVAS
} from "../Actions/actionTypes";
const initialState = {
    canvas: null,
    backgroundColor: "#FDEFEF",
    fontSize: "24",
    href: "",
    color: "#000000",
    canvasScale: 1,
    backgroundImage: ""
};

const editorReducer = (state = initialState, action) => {
    let localState = Object.assign({}, state);
    switch (action.type) {
        case SET_CANVAS:
            localState.canvas = action.data.canvas;
            return localState;
        default:
            return state;
    }
};

export default editorReducer;