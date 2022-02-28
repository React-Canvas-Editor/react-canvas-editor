import { SET_CANVAS, SET_CANVAS_IMAGE, SET_CANVAS_SCALE } from "./actionTypes";

export const setCanvas = (data) => {
  return {
    type: SET_CANVAS,
    data,
  };
};

export const setCanvasBackgroundImage = (data) => {
  return {
    type: SET_CANVAS_IMAGE,
    data,
  };
};

export const setCanvasScale = (data) => {
  return {
    type: SET_CANVAS,
    data,
  };
};
