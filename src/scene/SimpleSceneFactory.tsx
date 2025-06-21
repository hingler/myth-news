import { SceneInfo } from "../dialogue/parser/SceneInfo";
import { ISceneFactory } from "./ISceneFactory";
import { NewsroomScene } from "./NewsroomScene";

export class SimpleSceneFactory implements ISceneFactory {
  public createScene(info: SceneInfo) {
    return new NewsroomScene();
  }
}