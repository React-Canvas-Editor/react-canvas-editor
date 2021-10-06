import React, { Component } from "react";
import { fabric } from "fabric";
import { TwitterPicker } from "react-color";
import template from "./temp";
import StaticText from "./Objects/StaticText";
import StaticVector from "./Objects/StaticVector";
import StaticImage from "./Objects/StaticImage";
import { loadImageFromURL } from "./Objects/image-loader";
import Navbar from "./navbar";

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
      backgroundImage: ""
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
      preserveObjectStacking: true
    });

    this.setState({ canvas });

    document.addEventListener("keydown", this.onHandleKeyDown);
  }

  onHandleKeyDown = (event) => {
    if (event.which === 46) {
      this.deleteActiveObject();
    }
  };

  addText = () => {
    const { canvas } = this.state;
    canvas.add(
      new fabric.IText("Tap and Type", {
        fontFamily: "arial",
        fill: this.state.color,
        fontSize: 29,
        padding: 5,
        left: 0,
        right: 0
      })
    );
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
              scaleY: canvas.height / img.height
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
  textColorChange = (e) => {
    const { canvas } = this.state;
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("fill", e.target.value);
      canvas.renderAll();
    }
    this.setState({ color: e.target.value });
  };

  textBgColorChange = (e) => {
    const { canvas } = this.state;
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("backgroundColor", e.target.value);
      canvas.renderAll();
    }
  };

  onBold = (e) => {
    const { canvas } = this.state;
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
  };

  onItalic = (e) => {
    const { canvas } = this.state;
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
    const { canvas } = this.state;
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
    const { canvas } = this.state;
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
    const { canvas } = this.state;
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
    const { canvas } = this.state;
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("fontSize", e.target.value);
      canvas.renderAll();
    }
    this.setState({ fontSize: e.target.value });
  };

  onImageChange = (e) => {
    const { canvas } = this.state;
    var url = URL.createObjectURL(e.target.files[0]);
    fabric.Image.fromURL(
      url,
      (img) => {
        canvas.add(img);
        canvas.renderAll();
      },
      { scaleX: 0.15, scaleY: 0.15 }
    );
    console.log(canvas.getObjects());
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
      quality: 1
    });
    this.setState({ href: image });
  };

  addTemplate = async () => {
    const { canvas } = this.state;
    canvas.clear();
    if (canvas) {
      canvas.backgroundColor = template.background.value;
      canvas.renderAll();
    }
    for (const object of template.objects) {
      const element = await this.importTemplate(object);
      if (element) {
        canvas.add(element);
        canvas.renderAll();
      } else {
        console.log("UNABLE TO LOAD OBJECT: ", object.type);
      }
    }
  };
  importTemplate = async (item) => {
    let object;
    switch (item.type) {
      case "StaticText":
        object = await this.staticText(item);
        break;
      case "StaticImage":
        object = await this.staticImage(item);
        break;
    }
    return object;
  };

  staticText = (item) => {
    return new Promise((resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, "text");
        const metadata = item.metadata;
        const oldCanvasWidth = item.canvas.width;
        const newCanvasWidth = this.state.canvas.width;
        const {
          textAlign,
          fontFamily,
          fontSize,
          fontWeight,
          charSpacing,
          lineheight,
          text,
          padding
        } = metadata;
        const textOptions = {
          ...baseOptions,
          text: text ? text : "Default Text",
          ...(textAlign && { textAlign }),
          ...(fontFamily && { fontFamily }),
          ...(fontSize && {
            fontSize: (fontSize * newCanvasWidth) / oldCanvasWidth
          }),
          ...(fontWeight && { fontWeight }),
          ...(charSpacing && { charSpacing }),
          ...(lineheight && { lineheight }),
          ...(padding && { padding })
        };
        const element = new fabric.StaticText(textOptions);
        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  };

  staticImage = (item) => {
    return new Promise(async (resolve, reject) => {
      try {
        const baseOptions = this.getBaseOptions(item, "img");
        const src = item.metadata.src;
        const image = await loadImageFromURL(src);
        console.log(this.state.canvasScale);
        const { width, height } = baseOptions;
        if (!width || !height) {
          baseOptions.width = image.width;
          baseOptions.height = image.height;
        }
        const element = new fabric.StaticImage(image, baseOptions);

        resolve(element);
      } catch (err) {
        reject(err);
      }
    });
  };

  getBaseOptions(item, type) {
    const { left, top, width, height, scaleX, scaleY } = item;
    let metadata = item.metadata ? item.metadata : {};
    const { fill, angle, originX, originY } = metadata;
    const oldCanvasWidth = item.canvas.width;
    const oldCanvasHeight = item.canvas.height;
    const newCanvasWidth = this.state.canvas.width;
    const newCanvasHeight = this.state.canvas.height;

    let baseOptions = {
      angle: angle ? angle : 0,
      top: top ? (top * newCanvasWidth) / oldCanvasWidth : 0,
      left: left ? (left * newCanvasWidth) / oldCanvasWidth : 0,
      width: type === "img" ? width : (width * newCanvasWidth) / oldCanvasWidth,
      height:
        type === "img" ? height : (height * newCanvasHeight) / oldCanvasHeight,
      originX: originX || "left",
      originY: originY || "top",
      scaleX: (scaleX * newCanvasWidth) / oldCanvasWidth || 1,
      scaleY: (scaleY * newCanvasWidth) / oldCanvasWidth || 1,
      fill: fill || "#000000",
      metadata: metadata
    };
    return baseOptions;
  }
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
    this.addBackground(this.state.backgroundImage);
    this.setState({ canvasScale: percentage });
    canvas.renderAll();
  };

  render() {
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
            Download
          </a>
        </Navbar>
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
        <div>
          <button onClick={this.addTemplate}>Add Template</button>
        </div>
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
        <div>
          <label for="img">Upload image</label>
          <input
            type="file"
            id="img"
            name="img"
            accept="image/*"
            onChange={this.onImageChange}
          />
        </div>
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
              margin: "auto"
            }}
            ref={this.container}
          ></canvas>
        </div>
      </div>
    );
  }
}

export default Editor;
