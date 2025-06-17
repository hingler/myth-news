import { IBaseEvent } from "./IBaseEvent";

export class HeadlineEvent implements IBaseEvent {
  title: string

  public constructor(title: string) {
    this.title = title;
  }
}