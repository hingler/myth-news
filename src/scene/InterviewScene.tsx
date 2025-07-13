import { createRef, Reference, waitFor } from "@revideo/core";
import { INewsScene } from "./INewsScene";
import { brightness, Img, Layout, Node, Rect } from "@revideo/2d";
import { INewsContext } from "../context/INewsContext";
import { DialogueBox } from '../dialogue/DialogueBox';
import { SceneInfo } from "../dialogue/parser/SceneInfo";
import { IBaseEvent } from "../dialogue/event/IBaseEvent";
import { SimpleSpeechAnimator } from "../dog/SimpleSpeechAnimator";
import { DialogueViewerInterview } from "../dialogue/DialogueViewerInterview";

export class InterviewScene implements INewsScene {

  private readonly speakerSrc : string;
  private readonly backdropSrc : string;

  private readonly dialogueRef: Reference<DialogueBox> = createRef<DialogueBox>();
  private readonly speakerRoot: Reference<Layout> = createRef<Layout>();
  private readonly scene: SceneInfo;

  private viewer: DialogueViewerInterview;

  public constructor(speakerSrc: string, backdropSrc: string, scene: SceneInfo) {
    this.speakerSrc = speakerSrc;
    this.backdropSrc = backdropSrc;
    this.scene = scene;
  }

  public static fromScene(scene: SceneInfo) : InterviewScene {
    return new InterviewScene(
      scene.descriptors.get("speakerSrc") ?? "",
      scene.descriptors.get("backdropSrc") ?? "",
      scene
    );
  }

  public *CreateScene(sceneRoot: Reference<Node>, context: INewsContext) {

    const boxRef = createRef<Layout>();
    const contentRef = createRef<Layout>();
    const animatorRef = createRef<SimpleSpeechAnimator>();

    sceneRoot().add(
      <Layout size={["100%", "100%"]} ref={boxRef} />
    );

    boxRef().add(
      <Layout size={["100%", "72%"]} top={boxRef().top} ref={contentRef}/>
    );

    boxRef().add(
      <Rect size={["100%", "25%"]} bottom={boxRef().bottom} fill={"black"} />
    )

    sceneRoot().add(
      <DialogueBox ref={this.dialogueRef} size={['100%', '100%']} opacity={0.0} />
    );

    // contentRef
    contentRef().add(
      <Img opacity={1.0} src={this.backdropSrc} height={"100%"} filters={[ brightness(0.5) ]}/>
    )

    contentRef().add(
      <SimpleSpeechAnimator ref={animatorRef} speakerOffset={400} position={[0, 525]} speakerSrc={this.speakerSrc} />
    )

    this.viewer = new DialogueViewerInterview(this.dialogueRef, animatorRef, context);

    // yield* animatorRef().animate_speech(2.0, 1.0);
    // let text = new TextEvent("hello there everyone! please let me know if i am meeting your expectations.", 1.0, "alba");
    // yield* this.viewer.handleEvent(text);
    // yield* waitFor(2);
  }

  public *HandleEvent(event: IBaseEvent) {
    yield* this.viewer.handleEvent(event);
  }


  public *FinishScene() {}
}