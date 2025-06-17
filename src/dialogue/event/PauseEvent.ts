import { IBaseEvent } from "./IBaseEvent";

export class PauseEvent implements IBaseEvent {
  duration: number;

  public constructor(duration: number) {
    this.duration = duration;
  }
}