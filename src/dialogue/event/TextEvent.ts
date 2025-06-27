import { IBaseEvent } from './IBaseEvent';
export class TextEvent implements IBaseEvent {
  content: string
  speed: number;
  speaker: string;

  public constructor(content: string, speed: number, speaker: string) {
    this.content = content;
    this.speed = speed;
    this.speaker = speaker;
  }
}

// bold event? or bold node?