import { IBaseEvent } from "../event/IBaseEvent";

export class SceneInfo {
  tag: string;
  content: Array<IBaseEvent>;
  descriptors: object;
}

export class BroadcastInfo {
  title: string;
  titleDuration: number;
  musicSrc: string;
  scenes: Array<SceneInfo>;
}