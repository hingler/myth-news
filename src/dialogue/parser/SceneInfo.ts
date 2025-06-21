import { IBaseEvent } from "../event/IBaseEvent";

export interface IEventList {
  events: Array<IBaseEvent>;
}

export class SceneInfo implements IEventList {
  tag: string;
  events: Array<IBaseEvent>;
  descriptors: object;
}

export class BroadcastInfo implements IEventList {
  title: string;
  titleDuration: number;
  musicSrc: string;
  events: Array<IBaseEvent>;
}