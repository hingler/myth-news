import { Color } from "@revideo/core";
import { IBaseEvent } from "./IBaseEvent";

export class TransitionEvent implements IBaseEvent {
  duration: number;
  color: Color;

  public constructor(duration: number, color: string) {
    this.duration = duration;
    this.color = new Color(color);
  }
}