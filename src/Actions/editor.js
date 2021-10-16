import {
    SET_CANVAS
} from "./actionTypes";


export const setCanvas = data => {
    return {
        type: SET_CANVAS,
        data
    };
};