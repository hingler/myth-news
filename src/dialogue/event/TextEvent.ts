import { IBaseEvent } from './IBaseEvent';
export class TextEvent implements IBaseEvent {
  content: string

  public constructor(content: string) {
    this.content = content;
  }
}

// bold event? or bold node?