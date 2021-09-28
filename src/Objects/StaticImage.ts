//@ts-nocheck

import { fabric } from "fabric";

export class StaticImageObject extends fabric.Image {
  static type = "StaticImage";
  subtype = "image";
  //@ts-ignore
  initialize(element, options) {
    this.subtype = options.subtype;
    // this.set('crossOrigin', 'anonymous')
    //@ts-ignore
    super.initialize(element, options);
    return this;
  }

  static fromObject(options, callback) {
    fabric.util.loadImage(
      options.src,
      function (img) {
        // @ts-ignore
        return callback && callback(new fabric.StaticImage(img, options));
      },
      null,
      // @ts-ignore
      { crossOrigin: "anonymous" }
    );
  }

  toObject(propertiesToInclude = []) {
    // @ts-ignore
    return super.toObject(propertiesToInclude, {
      subtype: this.subtype
    });
  }
  toJSON(propertiesToInclude = []) {
    // @ts-ignore
    return super.toObject(propertiesToInclude, {
      subtype: this.subtype
    });
  }
}

fabric.StaticImage = fabric.util.createClass(StaticImageObject, {
  type: StaticImageObject.type
});
fabric.StaticImage.fromObject = StaticImageObject.fromObject;

export interface StaticImageOptions extends fabric.IImageOptions {
  id: string;
  name?: string;
  description?: string;
  subtype: string;
  src: string;
}

declare module "fabric" {
  namespace fabric {
    class StaticImage extends StaticImageObject {
      constructor(element: any, options: any);
    }
  }
}
