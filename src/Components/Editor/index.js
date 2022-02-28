import React, { Component } from "react";
import { fabric } from "fabric";
import { TwitterPicker } from "react-color";
import StaticText from "../../Utils/Objects/StaticText";
import StaticVector from "../../Utils/Objects/StaticVector";
import StaticImage from "../../Utils/Objects/StaticImage";
import Navbar from "../Navbar";
import { connect } from "react-redux";
import { setCanvas } from "../../Actions/editor";
import BackgroundImage from "../PanelBar/background";
import Template from "../PanelBar/template";
import UploadImage from "../PanelBar/uploadImage";
import TextPanel from "../PanelBar/textPanel";

class Editor extends Component {
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
    this.container = React.createRef();
  }
  componentDidMount() {
    const container = this.container.current;
    const { clientHeight, clientWidth } = container;

    const canvas = new fabric.Canvas("canvas", {
      backgroundColor: "#FDEFEF",
      height: clientHeight,
      width: clientWidth,
      preserveObjectStacking: true,
    });

    this.props.setCanvas({ canvas });
    this.setState({ canvas });

    document.addEventListener("keydown", this.onHandleKeyDown);
  }

  onHandleKeyDown = (event) => {
    if (event.which === 46) {
      this.deleteActiveObject();
    }
  };

  addBackground = (url) => {
    const { canvas } = this.state;
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
    this.setState({ backgroundImage: url });
  };

  removeBackground = () => {
    const { canvas } = this.state;
    this.setState({ backgroundImage: "" });
    if (canvas.backgroundImage) {
      canvas.setBackgroundImage(null);
      canvas.renderAll();
    }
    console.log(canvas.getObjects());
  };

  onColorChange = (color) => {
    const { canvas } = this.state;
    this.removeBackground();
    if (canvas) {
      canvas.backgroundColor = color.hex;
      canvas.renderAll();
    }
  };

  deleteActiveObject = () => {
    const { canvas } = this.state;

    canvas.getActiveObjects().forEach((object) => {
      canvas.remove(object);
    });
  };

  download = (e) => {
    const { canvas } = this.state;
    const image = canvas.toDataURL({
      format: "png",
      quality: 1,
    });
    this.setState({ href: image });
  };

  zoomToPercent = (event) => {
    var percentage = Number(event.target.value) / 100;
    this.setCanvasSize(percentage);
  };
  zoomIn = () => {
    if (this.state.canvasScale < 4) {
      const percentage = this.state.canvasScale + 0.25;
      this.setCanvasSize(percentage);
    }
  };

  // Zoom Out
  zoomOut = () => {
    if (this.state.canvasScale > 0.25) {
      const percentage = this.state.canvasScale - 0.25;
      this.setCanvasSize(percentage);
    }
  };

  setCanvasSize = (percentage) => {
    var canvas = this.state.canvas;

    canvas.setHeight(
      canvas.getHeight() * (percentage / this.state.canvasScale)
    );
    canvas.setWidth(canvas.getWidth() * (percentage / this.state.canvasScale));
    const objects = canvas.getObjects();

    for (var i in objects) {
      const scaleX = objects[i].scaleX;
      const scaleY = objects[i].scaleY;
      const left = objects[i].left;
      const top = objects[i].top;
      const tempScaleX = scaleX * (percentage / this.state.canvasScale);
      const tempScaleY = scaleY * (percentage / this.state.canvasScale);
      const tempLeft = left * (percentage / this.state.canvasScale);
      const tempTop = top * (percentage / this.state.canvasScale);
      objects[i].scaleX = tempScaleX;
      objects[i].scaleY = tempScaleY;
      objects[i].left = tempLeft;
      objects[i].top = tempTop;
      objects[i].setCoords();
    }
    this.addBackground(this.props.editorState.backgroundImage);
    this.setState({ canvasScale: percentage });
    canvas.renderAll();
  };

  render() {
    console.log(this.props.editorState);
    let options = [];
    for (let i = 1; i < 17; i++) {
      options.push(
        <option key={i} value={i * 25}>
          {i * 25}%
        </option>
      );
      console.log(this.state.textBox);
    }
    return (
      <div id="Canvas">
        <Navbar>
          <a
            download={"image.png"}
            className="download"
            href={this.state.href}
            onClick={(e) => this.download(e)}
          >
            Download 1
          </a>
        </Navbar>
        {/* <button onClick={this.addText}>Add Text </button>
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
        </div> */}
        <TextPanel />
        <BackgroundImage />
        <Template />
        <div>
          <label>Zoom </label>
          <button onClick={this.zoomOut}>-</button>
          <select
            className="zoom"
            onChange={this.zoomToPercent}
            value={this.state.canvasScale * 100}
          >
            {options}
            <option value="100">FIT</option>
            <option value="200">FILL</option>
          </select>
          <button onClick={this.zoomIn}>+</button>
        </div>
        <UploadImage />
        <TwitterPicker
          color={this.state.backgroundColor}
          onChange={this.onColorChange}
        />
        <div>
          <canvas
            id="canvas"
            style={{
              width: "100%",
              height: "100%",
              border: "2px solid black",
              margin: "auto",
            }}
            ref={this.container}
          ></canvas>
        </div>
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
    setCanvas: (data) => {
      return dispatch(setCanvas(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
