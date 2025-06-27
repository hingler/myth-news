import { IBaseEvent } from "../event/IBaseEvent";

export interface IEventList {
  events: Array<IBaseEvent>;
}

export class SceneInfo implements IEventList {
  tag: string;
  events: Array<IBaseEvent>;
  descriptors: Map<string, string>;
}

export class BroadcastInfo implements IEventList {
  title: string;
  titleDuration: number;
  musicSrc: string;
  defaultPause: boolean;
  events: Array<IBaseEvent>;
}