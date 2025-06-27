import { createRef, Reference } from "@revideo/core";
import { INewsScene } from "./INewsScene";
import { VideoPlayer } from "../video/VideoPlayer";
import { DialogueBox } from "../dialogue/DialogueBox";
import { Node } from "@revideo/2d";
import { INewsContext } from "../context/INewsContext";
import { DialogueViewerVideo } from "../dialogue/DialogueViewerVideo";
import { IBaseEvent } from "../dialogue/event/IBaseEvent";

export class VideoScene implements INewsScene {
  private readonly videoRef = createRef<VideoPlayer>();
  private readonly dialogueRef = createRef<DialogueBox>();

  private handler: DialogueViewerVideo;

  public *CreateScene(sceneRoot: Reference<Node>, context: INewsContext) {
    sceneRoot().add(
      <VideoPlayer ref={this.videoRef} />
    );

    sceneRoot().add(
      <DialogueBox ref={this.dialogueRef} size={['100%', '100%']} opacity={0.0} />
    );

    // barebones-er video thing   
    this.handler = new DialogueViewerVideo(this.dialogueRef, this.videoRef, context);
  }

  public *HandleEvent(event: IBaseEvent) {
    yield* this.handler.handleEvent(event);
  }

  public *FinishScene() {}
}