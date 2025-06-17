import { IBaseEvent } from "./IBaseEvent";

export class VideoEvent implements IBaseEvent {
  src: string;
  volume: number;

  public constructor(src: string, volume: number) {
    this.src = src;
    this.volume = volume;
  }
}