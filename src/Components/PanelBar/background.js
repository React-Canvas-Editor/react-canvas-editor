import React, { Component } from "react";
import { fabric } from "fabric";
import { connect } from "react-redux";
import { setCanvasBackgroundImage, setCanvas } from "../../Actions/editor";

class BackgroundImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundImage: "",
    };
  }

  removeBackground = () => {
    const { canvas } = this.props.editorState;
    this.props.setCanvasBackgroundImage({ backgroundImage: "" });
    if (canvas.backgroundImage) {
      canvas.setBackgroundImage(null);
      canvas.renderAll();
    }
    this.props.setCanvas({ canvas });

    console.log(canvas.getObjects());
  };

  addBackground = (url) => {
    const { canvas } = this.props.editorState;
    this.removeBackground();

    fabric.Image.fromURL(
      url,
      (img) => {
        if (canvas) {
          canvas.setBackgroundImage(
            img,
            () => {
              canvas.renderAll();
            },
            {
              scaleX: canvas.width / img.width,
              scaleY: canvas.height / img.height,
            }
          );
        }
      },
      { crossOrigin: "anonymous" }
    );
    this.props.setCanvasBackgroundImage({ backgroundImage: url });
    this.props.setCanvas({ canvas });
  };

  render() {
    return (
      <div>
        <button
          onClick={() =>
            this.addBackground(
              "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
            )
          }
        >
          Add Background Image{" "}
        </button>{" "}
        <button onClick={this.removeBackground}>Remove Background </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    editorState: state.editor,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setCanvasBackgroundImage: (data) => {
      return dispatch(setCanvasBackgroundImage(data));
    },
    setCanvas: (data) => {
      return dispatch(setCanvas(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundImage);
