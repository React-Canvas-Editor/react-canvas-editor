import React, { Component } from "react";
import { fabric } from "fabric";
import { connect } from "react-redux";
import { setCanvasBackgroundImage, setCanvas } from "../../Actions/editor";
import template from "../../temp.json";
import { loadImageFromURL } from "../../Utils/Objects/image-loader";

class Template extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addTemplate = async () => {
    const { canvas } = this.props.editorState;
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
      this.props.setCanvas({ canvas });
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
        const newCanvasWidth = this.props.editorState.canvas.width;
        const {
          textAlign,
          fontFamily,
          fontSize,
          fontWeight,
          charSpacing,
          lineheight,
          text,
          padding,
        } = metadata;
        const textOptions = {
          ...baseOptions,
          text: text ? text : "Default Text",
          ...(textAlign && { textAlign }),
          ...(fontFamily && { fontFamily }),
          ...(fontSize && {
            fontSize: (fontSize * newCanvasWidth) / oldCanvasWidth,
          }),
          ...(fontWeight && { fontWeight }),
          ...(charSpacing && { charSpacing }),
          ...(lineheight && { lineheight }),
          ...(padding && { padding }),
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
    const newCanvasWidth = this.props.editorState.canvas.width;
    const newCanvasHeight = this.props.editorState.canvas.height;

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
      metadata: metadata,
    };
    return baseOptions;
  }

  render() {
    console.log("canvas", this.props.editorState.canvas);
    return (
      <div>
        <button onClick={this.addTemplate}>Add Template</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Template);
