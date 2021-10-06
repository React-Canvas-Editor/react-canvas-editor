//@ts-nocheck

import { fabric } from "fabric";

export class StaticTextObject extends fabric.Textbox {
  static type = "StaticText";

  initialize(options: StaticTextOptions) {
    const { text, ...textOptions } = options;
    //@ts-ignore
    super.initialize(text, textOptions);

    return this;
  }
  toObject(propertiesToInclude = []) {
    return super.toObject(propertiesToInclude);
  }
  toJSON(propertiesToInclude = []) {
    return super.toObject(propertiesToInclude);
  }
  static fromObject(options: StaticTextOptions, callback: Function) {
    return callback && callback(new fabric.StaticText(options));
  }
}

fabric.StaticText = fabric.util.createClass(StaticTextObject, {
  type: StaticTextObject.type
});
fabric.StaticText.fromObject = StaticTextObject.fromObject;

export type StaticTextOptions = fabric.ITextboxOptions & { text: string };

declare module "fabric" {
  namespace fabric {
    class StaticText extends StaticTextObject {
      constructor(options: StaticTextOptions);
    }
  }
}
