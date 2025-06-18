import { IBaseEvent } from "./IBaseEvent";

export class VideoEvent implements IBaseEvent {
  src: string;
  volume: number;
  playbackRate: number;

  public constructor(src: string, volume: number, playbackRate: number) {
    this.src = src;
    this.volume = volume;
    this.playbackRate = playbackRate;
  }
}