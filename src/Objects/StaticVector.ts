//@ts-nocheck
import { fabric } from "fabric";

class SvgObject extends fabric.Group {
  static type = "StaticVector";
  public src: string;
  //@ts-ignore
  initialize(objects, options, others) {
    this.set("src", others.src);
    const object = fabric.util.groupSVGElements(objects, options);
    //@ts-ignore
    super.initialize([object], others);
    return this;
  }

  toObject(propertiesToInclude = []) {
    // @ts-ignore
    return super.toObject(propertiesToInclude, {
      src: this.src
    });
  }
  toJSON(propertiesToInclude = []) {
    // @ts-ignore
    return super.toObject(propertiesToInclude, {
      src: this.src
    });
  }
}

fabric.Svg = fabric.util.createClass(SvgObject, {
  type: SvgObject.type
});

export type SvgOptions = fabric.Group & { text: string };

declare module "fabric" {
  namespace fabric {
    class Svg extends SvgObject {
      constructor(objects: any, options: any, others: any);
    }
  }
}

export default SvgObject;
