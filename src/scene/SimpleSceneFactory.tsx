import { SceneInfo } from "../dialogue/parser/SceneInfo";
import { InterviewScene } from "./InterviewScene";
import { ISceneFactory } from "./ISceneFactory";
import { NewsroomScene } from "./NewsroomScene";

export class SimpleSceneFactory implements ISceneFactory {
  public createScene(info: SceneInfo) {
    switch (info.tag) {
      case "interview":
        return new InterviewScene("/res/05/alba.png", "/res/05/nfd_nyc.png", info)
      default:
        return new NewsroomScene();
    }
  }
}