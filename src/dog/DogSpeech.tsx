import { Audio, Img, initial, Layout, LayoutProps, Node, NodeProps, signal } from "@revideo/2d";
import { all, chain, createRef, loop, loopFor, SignalValue, SimpleSignal, useThread, waitFor } from "@revideo/core";
import { AudioHelper } from "./AudioHelper";
import { INewsContext } from "../context/INewsContext";
import { IAudioPlayer } from "../context/IAudioPlayer";

export interface DogSpeechProps extends LayoutProps {
  initialText?: SignalValue<string>;
  context?: INewsContext;
}

export class DogSpeech extends Layout {
  @initial("")
  @signal()
  public declare readonly initialText: SimpleSignal<string, DogSpeech>;

  private readonly dogImage = createRef<Img>();
  private readonly imageRoot = createRef<Layout>();
  private readonly audioHelper = createRef<AudioHelper>();

  private readonly player: IAudioPlayer;

  private readonly l = ["/audio/bark1.wav", "/audio/bark2.wav", "/audio/bark3.wav", "/audio/bark4.wav", "/audio/bark5.wav", "/audio/bark6.wav", "/audio/bark7.wav"];

  public constructor(props?: DogSpeechProps) {
    super({...props});
    this.add(
      <Layout ref={this.imageRoot} position={[0, 200]}>
        <Img src={"/dog/oniondog_stencil.png"} position={[0, -200]} size={[700, 700]} ref={this.dogImage}/>
        <AudioHelper ref={this.audioHelper} context={props.context}/>
      </Layout>
    );

    this.player = props.context.getAudioPlayer();

    this.audioHelper().addSource(...this.l);
  }

  public *speak(text: string, speed: number = 1.0) {
    let anim_time = text.length / (30 * speed);
    // every .1 seconds, call a func

    const ah = this.audioHelper;

    useThread().spawn(function* () {
      const tt = 0.1 / speed;
      const fac = (1.0 / Math.max(tt, 0.001));
      for (let i = 0; i < (fac * anim_time); i++) {
        yield* ah().playSample();
        yield* waitFor(tt);
      }
    });
    
    


    yield* all(this.animate_image(anim_time, speed));
  }

  private *animate_image(seconds: number, speed: number = 1.0) {
    const anim_delay = (0.0833) / speed;
    yield* chain(
      loopFor(
        seconds,
        () => this.imageRoot().scale([1.05, 0.95], anim_delay).to([0.95, 1.05], anim_delay)
      ),

      this.imageRoot().scale([1, 1], anim_delay)
    );
  }

  public *play_sound(source: string) {
    yield* this.audioHelper().playSingleSample(source);
  }
}