import { all, createRef, linear, Reference } from "@revideo/core";
import { INewsScene } from "./INewsScene";
import { NewsroomScene } from "./NewsroomScene";
import { INewsContext } from "../context/INewsContext";
import { Layout, Node, Rect, Txt, TxtProps } from "@revideo/2d";
import moment from "moment";
import { IBaseEvent } from "../dialogue/event/IBaseEvent";
import { SceneInfo } from "../dialogue/parser/SceneInfo";

const baseTitle : TxtProps = {
  fill: "#9BEDF0",
  textWrap: true,
  textAlign: "center",
  stroke: "#3E3AA7",
  strokeFirst: true,
  lineWidth: 15
}

const titleStyle = {
  fontSize: 128,
  ...baseTitle
}

const dateStyle : TxtProps = {
  fontSize: 60,
  ...baseTitle
}

export class IntroScene implements INewsScene {
  private readonly d: NewsroomScene;
  private readonly title: string;
  private readonly duration: number;
  private readonly bgmSrc: string;

  public constructor(
    title: string, 
    duration: number,
    bgmSrc: string
  ) {
    this.d = new NewsroomScene();
    this.title = title;
    this.duration = duration;
    this.bgmSrc = bgmSrc;
  }

  public static fromScene(info: SceneInfo) : IntroScene {
    let title = info.descriptors.get("title") ?? "Myth and Story News";
    let bgm = info.descriptors.get("bgmSrc") ?? "/audio/newsflash.m4a";
    let duration = parseFloat(info.descriptors.get("duration") ?? "2.7");

    return new IntroScene(title, duration, bgm);
  }

  public *CreateScene(root: Reference<Node>, context: INewsContext) {
    yield* this.d.CreateScene(root, context);
    const titleRef = createRef<Txt>();
    const layoutRef = createRef<Layout>();
    const fadeRef = createRef<Rect>();

    root().add(
      <Rect fill={"#000000"} ref={fadeRef} opacity={.5} size={['100%', '100%']}/>
    )

    root().add(<Layout direction={"column"} layout ref={layoutRef} position={[-1080, 0]} />)
    
    layoutRef().add(
      <Txt ref={titleRef} text={this.title} fontFamily={"Comic Sans MS"} position={[0, 0]} padding={32}
      {...titleStyle}
      />
    );

    const d = moment().format("MMMM Do, YYYY");

    layoutRef().add(
      <Txt.i fontFamily={"Comic Sans MS"} {...dateStyle} marginTop={32}>{d}</Txt.i>
    );

    let titleAnim = layoutRef().position([-35, 0], .1, linear)
    .to([35, 0], this.duration, linear)
    .to([1080, 0], 0.1, linear)

    let opacityAnim = fadeRef().opacity(0.5, this.duration).to(0.0, 0.2);

    yield* context.getAudioPlayer().playSample(this.bgmSrc);
    yield* all(titleAnim, opacityAnim);
  }

  public *HandleEvent(event: IBaseEvent) {
    yield* this.d.HandleEvent(event);
  }
  public *FinishScene() {
    yield* this.d.FinishScene();
  }
}