import { createRef, Reference, all, easeOutQuint, easeOutQuad, waitFor, chain, useLogger } from '@revideo/core';
import { INewsScene } from "./INewsScene";
import { Layout, Node, Txt, Video } from "@revideo/2d";
import { INewsContext } from "../context/INewsContext";
import { IBaseEvent } from "../dialogue/event/IBaseEvent";
import { DialogueBox } from "../dialogue/DialogueBox";
import { SimpleSpeechPlayer } from "../dog/SimpleSpeechPlayer";
import moment, { duration } from "moment";
import { TextEvent } from "../dialogue/event/TextEvent";
import { SceneInfo } from '../dialogue/parser/SceneInfo';

export class HoroscopeScene implements INewsScene {

  private dialogueRef: Reference<DialogueBox> = createRef();
  private horoscopeRef: Reference<Layout> = createRef();

  private readonly fortune: Array<string>;
  private readonly numbers: Array<number>;


  private speechPlayer : SimpleSpeechPlayer;

  public constructor(
    fortune: Array<string>,
    numbers: Array<number>
  ) {
    this.fortune = fortune;
    this.numbers = numbers;
  }

  public static fromScene(scene: SceneInfo) : INewsScene {
    let fortune : Array<string> = scene.descriptors.get("fortune").split("\n").map(v => v.trim()).filter(v => v.length > 0);
    let numbers : Array<number> = scene.descriptors.get("numbers").split("\n").map(v => v.trim()).filter(v => v.length > 0).map(v => parseInt(v));
    return new HoroscopeScene(fortune, numbers);
  }

  public *CreateScene(sceneRoot: Reference<Node>, context: INewsContext) {
    this.speechPlayer = new SimpleSpeechPlayer(context);
    this.speechPlayer.AddSample("/res/09/txt4.wav");

    context.getAudioPlayer().stop();
    let h = context.getAudioPlayer().getHandle("/res/09/wifi.m4a");
    yield* h.play();
    sceneRoot().add(
      <Video src={"/res/09/bg.mp4"} size={['100%', '100%']} play={true}/>
    );

    const baseRef = createRef<Node>();
    sceneRoot().add(<Node ref={baseRef} />)

    baseRef().add(
      <Layout layout ref={this.horoscopeRef} direction={"column"} alignItems={"center"} fontFamily={"Lexend"} fontWeight={500} position={[0, -432]} opacity={0.0} shadowColor={"#FFFFFF"} shadowBlur={16}>
        <Txt fill={"white"} fontSize={60}>your fortune for...</Txt>
        <Txt fill={"white"} fontSize={89}>{moment().format("MMMM Do, YYYY")}</Txt>
        {/* <Txt fill={"white"} fontSize={576} ref={this.horoscopeRef}>♋︎</Txt> */}
      </Layout>
    )

    baseRef().add(
      <DialogueBox ref={this.dialogueRef} size={["100%", '100%']} shadowColor={"#FFFFFF"} shadowBlur={16}/>
    )

    this.dialogueRef().color("#00000000");
    this.dialogueRef().textFill("#FFFFFFFF");
    this.dialogueRef().font("Lexend");

    this.speechPlayer.speak_speed = 15.0;
    this.speechPlayer.read_speed = 15.0;
    this.dialogueRef().read_speed = 15.0;

    yield* waitFor(0.5);
    yield* all(
      this.horoscopeRef().position([0, -288], 1.5, easeOutQuad),
      this.horoscopeRef().opacity(1.0, 1.5, easeOutQuad)
    )

    yield* waitFor(1.0);

    for (let i = 0; i < this.fortune.length; i++) {
      let te = new TextEvent(this.fortune[i], 1.0, "");
      yield* this.HandleEvent(te);
      yield* waitFor(1.0);
    }

    yield* baseRef().opacity(0.0, 1.5);

    yield* waitFor(1.0);

    baseRef().remove();

    yield* this.HandleNumbers(sceneRoot);
    yield* waitFor(0.5);
  }

  private *HandleNumbers(sceneRoot: Reference<Node>) {
    const numbersRef = createRef<Layout>();
    const compartmentRef = createRef<Layout>();
    yield sceneRoot().add(
      <Layout ref={numbersRef} direction={"column"} alignItems={"center"} fontFamily={"Lexend"} fontWeight={500} position={[0, 0]} opacity={0.0} shadowColor={"#FFFFFF"} shadowBlur={16}>
        <Txt fill={"white"} fontSize={72} position={[0, -72]} fontFamily={"Lexend"}>Your lucky numbers</Txt>
        <Layout fontSize={120} ref={compartmentRef} direction={"row"} alignItems={"center"} position={[0, 72]} />
        {/* <Txt fill={"white"} fontSize={576} ref={this.horoscopeRef}>♋︎</Txt> */}
      </Layout>
    )

    const arr : Array<Reference<Txt>> = [];


    for (let i = 0; i < this.numbers.length; i++) {
      const nref = createRef<Txt>();
      yield compartmentRef().add(
        <Txt ref={nref} fill={"#FFFFFF"} text={this.numbers[i].toString()} fontSize={96} fontFamily={"Lexend"} textAlign={"center"} fontWeight={600} margin={32} position={[i * 160 - 400, -24]} opacity={0.0}></Txt>
      )
      arr.push(nref);
    }

    yield* numbersRef().opacity(1.0, 1.0);
    yield* waitFor(1.0);
    // yield* waitFor(0.5);
    for (let i = 0; i < this.numbers.length; i++) {
      const nref = arr[i];
      yield chain(waitFor(0.35 * i), all(nref().position([i * 160 - 400, 0], 0.5), nref().opacity(1.0, 0.5)));
    }

    yield* waitFor(3.5);

    yield* numbersRef().opacity(0.0, 1.0);
    yield* waitFor(0.5);

    // yield* waitFor(0.35 * this.numbers.length + 1.5);
  }

  public *HandleEvent(event: IBaseEvent) {
    if (event instanceof TextEvent) {
      yield* all(
        this.dialogueRef().speak(event.content, event.speed),
        this.speechPlayer.speak(event.content, event.speed)
      );
    }
  }

  public *FinishScene() { }
}
