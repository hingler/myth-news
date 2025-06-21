import { SceneInfo } from '../parser/SceneInfo';
import { IBaseEvent } from "./IBaseEvent";

export class SceneEvent implements IBaseEvent {
  info: SceneInfo;

  public constructor(info: SceneInfo) {
    this.info = info;
  }
}