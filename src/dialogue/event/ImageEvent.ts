import { IBaseEvent } from "./IBaseEvent";

export class ImageEvent implements IBaseEvent {
  src: string
  caption: string

  public constructor(src: string, caption: string) {
    this.src = src;
    this.caption = caption;
  }
}