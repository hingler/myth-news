import { createRef, Reference, useLogger } from "@revideo/core";
import { INewsScene } from "./INewsScene";
import { INewsContext } from "../context/INewsContext";
import { brightness, Img, Node } from "@revideo/2d";
import { DogSpeech } from "../dog/DogSpeech";
import { VideoPlayer } from "../video/VideoPlayer";
import { DialogueBox } from "../dialogue/DialogueBox";
import { DialogueViewerNewsroom } from "../dialogue/DialogueViewerNewsroom";
import { IBaseEvent } from "../dialogue/event/IBaseEvent";

export class NewsroomScene implements INewsScene {
  private readonly imageRef = createRef<Img>();
  private readonly dogRef = createRef<DogSpeech>();
  private readonly videoRef = createRef<VideoPlayer>();
  private readonly dialogueRef = createRef<DialogueBox>();

  private handler: DialogueViewerNewsroom;

  public *CreateScene(sceneRoot: Reference<Node>, context: INewsContext) {
    sceneRoot().add(
      <Img position={[0, -240]} height={1440} opacity={1.0} src={"/news/backdrop.png"} filters={[ brightness(0.5) ]}/>
    )
  
    sceneRoot().add(
      <Img ref={this.imageRef} position={[220, -250]} size={[600,450]} src={"/news/pukeko.jpg"} opacity={0.0}/>
    )
  
    sceneRoot().add(
      <DogSpeech ref={this.dogRef} left={[-200, 150]} scale={1.2} context={context}/>
    )
  
    sceneRoot().add(
      <Img src={"/dog/newsstand.png"} size={[2560, 1440]} position={[0, 300]}/>
    )
  
    // own scene
    yield sceneRoot().add(
      <VideoPlayer ref={this.videoRef} />
    );
  
    // per scene
    sceneRoot().add(
      <DialogueBox ref={this.dialogueRef} size={['100%', '100%']} opacity={0.0}/>
    )

    this.handler = new DialogueViewerNewsroom(this.dogRef, this.dialogueRef, this.imageRef, this.videoRef, context);
  }

  public *HandleEvent(event: IBaseEvent) {
    yield* this.handler.handleEvent(event);
  }

  public *FinishScene() {}
}