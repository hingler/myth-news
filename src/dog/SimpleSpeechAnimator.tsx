import { Img, initial, Layout, LayoutProps, Node, signal } from "@revideo/2d";
import { chain, createRef, loopFor, Reference, SignalValue, SimpleSignal } from "@revideo/core";

export interface SimpleSpeechProps extends LayoutProps {
  speakerOffset?: SignalValue<number>;
  speakerSrc?: SignalValue<string>;
}

export class SimpleSpeechAnimator extends Layout {
  private readonly layoutRoot: Reference<Layout> = createRef();

  @initial(200)
  @signal()
  public declare readonly speakerOffset: SimpleSignal<number, SimpleSpeechAnimator>;

  @initial("")
  @signal()
  public declare readonly speakerSrc: SimpleSignal<string, SimpleSpeechAnimator>;
  public constructor(props: SimpleSpeechProps) {
    super(props);
    this.add(<Layout ref={this.layoutRoot} position={() => [0, this.speakerOffset()]}/>);
    this.layoutRoot().add(
      <Img src={this.speakerSrc()} position={() => [0, -this.speakerOffset()]} height={"60%"}/>
    )
  }

  public *animate_speech(text: string, rate: number) {
    const time = (text.length / (30 * rate));
    const anim_delay = (0.0833) / rate;
    yield* chain(
      loopFor(
        time,
        () => this.layoutRoot().scale([1.05, 0.95], anim_delay).to([0.95, 1.05], anim_delay)
      ),

      this.layoutRoot().scale([1, 1], anim_delay)
    );
  }
}