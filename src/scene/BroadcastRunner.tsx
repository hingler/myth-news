import { Node } from "@revideo/2d";
import { INewsContext } from "../context/INewsContext";
import { ISceneFactory } from './ISceneFactory';
import { createRef, Reference } from "@revideo/core";
import { BroadcastInfo, IEventList, SceneInfo } from "../dialogue/parser/SceneInfo";
import { INewsScene } from "./INewsScene";
import { SceneEvent } from "../dialogue/event/SceneEvent";

export class BroadcastRunner {
  private readonly root: Reference<Node>;
  private readonly fac: ISceneFactory;
  private readonly ctx: INewsContext;
  private rootChild: Reference<Node> = null;

  private currentScene: INewsScene;

  public constructor(root: Reference<Node>, fac: ISceneFactory, ctx: INewsContext) {
    this.root = root;
    this.fac = fac;
    this.ctx = ctx;
  }

  public *initializeScene(scene: INewsScene) {
    const newChild = createRef<Node>();
    yield this.root().add(<Node ref={newChild}></Node>);
    yield* scene.CreateScene(newChild, this.ctx);

    if (this.rootChild != null) {
      yield this.rootChild().remove();
    }

    this.rootChild = newChild;
    this.currentScene = scene;
  }

  public *runBroadcast(broadcast: BroadcastInfo) {
    // need to initialize before this gets called anyway
    yield* this.runEventList(broadcast);
  }

  public *runScene(info: SceneInfo) : any {
    yield* this.currentScene.FinishScene();
    let newScene = this.fac.createScene(info);
    yield* this.initializeScene(newScene);
    yield* this.runEventList(info);
  }

  private *runEventList(list: IEventList) {
    for (let i = 0; i < list.events.length; i++) {
      // if we see a scene: call a function which swaps out the scene
      let e = list.events[i];
      if (e instanceof SceneEvent) {
        yield* this.runScene(e.info);
      } else {
        yield* this.currentScene.HandleEvent(e);
      }
    }
  }
}