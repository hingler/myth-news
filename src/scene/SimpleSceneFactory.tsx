import { SceneInfo } from "../dialogue/parser/SceneInfo";
import { HoroscopeScene } from "./HoroscopeScene";
import { INewsScene } from "./INewsScene";
import { InterviewScene } from "./InterviewScene";
import { ISceneFactory } from "./ISceneFactory";
import { NewsroomScene } from "./NewsroomScene";

export class SimpleSceneFactory implements ISceneFactory {
  public createScene(info: SceneInfo) {
    switch (info.tag) {
      case "interview":
        return InterviewScene.fromScene(info);
      case "horoscope":
        return HoroscopeScene.fromScene(info);
      default:
        return new NewsroomScene();
    }
  }
}