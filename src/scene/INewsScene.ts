import { IBaseEvent } from "../dialogue/event/IBaseEvent";
import { INewsContext } from '../context/INewsContext';
import { Reference } from "@revideo/core";
import { Node } from "@revideo/2d";

export interface INewsScene {
  CreateScene(root: Reference<Node>, context: INewsContext) : any;
  HandleEvent(event: IBaseEvent) : any;

  // any REQUIRED cleanup
  FinishScene() : any;
}