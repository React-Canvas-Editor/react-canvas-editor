import React, { Component } from "react";
import { fabric } from "fabric";
import { connect } from "react-redux";
import { setCanvasBackgroundImage, setCanvas } from "../../Actions/editor";

class TextPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      backgroundColor: "#FDEFEF",
      fontSize: "24",
      href: "",
      color: "#000000",
      canvasScale: 1,
      backgroundImage: "",
    };
  }
  addText = () => {
    const { canvas } = this.props.editorState;
    canvas.add(
      new fabric.IText("Tap and Type", {
        fontFamily: "arial",
        fill: this.state.color,
        fontSize: 29,
        padding: 5,
        left: 0,
        right: 0,
      })
    );
  };
  textColorChange = (e) => {
    const { canvas } = this.props.editorState;
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("fill", e.target.value);
      canvas.renderAll();
    }
    this.setState({ color: e.target.value });
    this.props.setCanvas({ canvas });
  };

  textBgColorChange = (e) => {
    const { canvas } = this.props.editorState;
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("backgroundColor", e.target.value);
      canvas.renderAll();
    }
    this.props.setCanvas({ canvas });
  };

  onBold = (e) => {
    const { canvas } = this.props.editorState;
    if (e.target.checked) {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("fontWeight", "bold");
        canvas.renderAll();
      }
    } else {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("fontWeight", "");
        canvas.renderAll();
      }
    }
    this.props.setCanvas({ canvas });
  };

  onItalic = (e) => {
    const { canvas } = this.props.editorState;
    if (e.target.checked) {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("fontStyle", "italic");
        canvas.renderAll();
      }
    } else {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("fontStyle", "");
        canvas.renderAll();
      }
    }
  };

  onUnderline = (e) => {
    const { canvas } = this.props.editorState;
    if (e.target.checked) {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("underline", true);
        canvas.renderAll();
      }
    } else {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("underline", false);
        canvas.renderAll();
      }
    }
  };

  onLinethrough = (e) => {
    const { canvas } = this.props.editorState;
    if (e.target.checked) {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("linethrough", true);
        canvas.renderAll();
      }
    } else {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("linethrough", false);
        canvas.renderAll();
      }
    }
  };

  onOverline = (e) => {
    const { canvas } = this.props.editorState;
    if (e.target.checked) {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("overline", true);
        canvas.renderAll();
      }
    } else {
      if (canvas.getActiveObject()) {
        canvas.getActiveObject().set("overline", false);
        canvas.renderAll();
      }
    }
  };

  onFontSize = (e) => {
    const { canvas } = this.props.editorState;
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("fontSize", e.target.value);
      canvas.renderAll();
    }
    this.setState({ fontSize: e.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <button onClick={this.addText}>Add Text </button>
        <div>
          <label>Text color </label>
          <input
            type="color"
            value={this.state.color}
            size="10"
            onChange={(e) => this.textColorChange(e)}
          />{" "}
          <label>Background text color:</label>
          <input
            type="color"
            value=""
            size="10"
            onChange={(e) => this.textBgColorChange(e)}
          />
          <div>
            <input
              type="checkbox"
              name="fonttype"
              onChange={(e) => {
                this.onBold(e);
              }}
            />
            Bold
            <input
              type="checkbox"
              name="fonttype"
              onChange={(e) => {
                this.onItalic(e);
              }}
            />
            Italic
            <input
              type="checkbox"
              name="fonttype"
              onChange={(e) => {
                this.onUnderline(e);
              }}
            />
            Underline
            <input
              type="checkbox"
              name="fonttype"
              onChange={(e) => {
                this.onLinethrough(e);
              }}
            />
            Linethrough
            <input
              type="checkbox"
              name="fonttype"
              onChange={(e) => {
                this.onOverline(e);
              }}
            />
            Overline
          </div>
          <div>
            <label>Font size</label>
            <input
              type="range"
              min="1"
              max="120"
              step="1"
              value={this.state.fontSize}
              onChange={(e) => this.onFontSize(e)}
            />
          </div>
        </div>
      </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(TextPanel);
