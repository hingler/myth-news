import { IBaseEvent } from './IBaseEvent';
export class TextEvent implements IBaseEvent {
  content: string
  speed: number;

  public constructor(content: string, speed: number = 1.0) {
    this.content = content;
    this.speed = speed;
  }
}

// bold event? or bold node?