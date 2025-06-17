import { Audio, Img, initial, Layout, LayoutProps, Node, NodeProps, signal } from "@revideo/2d";
import { all, chain, createRef, loop, loopFor, SignalValue, SimpleSignal, useThread, waitFor } from "@revideo/core";
import { AudioHelper } from "./AudioHelper";

export interface DogSpeechProps extends LayoutProps {
  initialText?: SignalValue<string>;
}

export class DogSpeech extends Layout {
  @initial("")
  @signal()
  public declare readonly initialText: SimpleSignal<string, DogSpeech>;

  private readonly dogImage = createRef<Img>();
  private readonly imageRoot = createRef<Layout>();
  private readonly audioHelper = createRef<AudioHelper>();

  private readonly l = ["/audio/bark1.wav", "/audio/bark2.wav", "/audio/bark3.wav", "/audio/bark4.wav", "/audio/bark5.wav", "/audio/bark6.wav", "/audio/bark7.wav"];

  public constructor(props?: DogSpeechProps) {
    super({...props});
    this.add(
      <Layout ref={this.imageRoot} position={[0, 200]}>
        <Img src={"/dog/oniondog_stencil.png"} position={[0, -200]} size={[700, 700]} ref={this.dogImage}/>
        <AudioHelper ref={this.audioHelper} />
      </Layout>
    );

    this.audioHelper().addSource(...this.l);
  }

  public *speak(text: string) {
    let anim_time = text.length / 30;
    // every .1 seconds, call a func


    yield* this.audioHelper().playSingleSample(this.l[0]);

    const ah = this.audioHelper;
    const el = this.l;

    useThread().spawn(function* () {
      const tt = 0.1;
      const fac = (1.0 / Math.max(tt, 0.001));
      for (let i = 0; i < (fac * anim_time); i++) {
        yield* ah().playSample();
        yield* waitFor(tt);
      }
    });
    
    


    yield* all(this.animate_image(anim_time));
  }

  private *animate_image(seconds: number) {
    yield* chain(
      loopFor(
        seconds,
        () => this.imageRoot().scale([1.05, 0.95], 0.083).to([0.95, 1.05], 0.083)
      ),

      this.imageRoot().scale([1, 1], 0.083)
    );
  }

  public *play_sound(source: string) {
    yield* this.audioHelper().playSingleSample(source);
  }
}