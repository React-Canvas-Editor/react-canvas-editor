import {
  SET_CANVAS,
  SET_CANVAS_IMAGE,
  SET_CANVAS_SCALE,
} from "../Actions/actionTypes";
const initialState = {
  canvas: null,
  backgroundColor: "#FDEFEF",
  fontSize: "24",
  href: "",
  color: "#000000",
  canvasScale: 1,
  backgroundImage: "",
};

const editorReducer = (state = initialState, action) => {
  let localState = Object.assign({}, state);
  switch (action.type) {
    case SET_CANVAS:
      localState.canvas = action.data.canvas;
      return localState;

    case SET_CANVAS_IMAGE:
      localState.backgroundImage = action.data.backgroundImage;
      return localState;

    case SET_CANVAS_SCALE:
      console.log(action, "xoom");
      localState.canvasScale = action.data.canvasScale;
      return localState;
    default:
      return state;
  }
};

export default editorReducer;
