import { SceneInfo } from '../dialogue/parser/SceneInfo';
import { INewsScene } from './INewsScene';
export interface ISceneFactory {
  createScene(info: SceneInfo) : INewsScene;
}