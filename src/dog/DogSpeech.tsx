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
  private readonly audioHelper_bup = createRef<AudioHelper>();

  private readonly player: IAudioPlayer;

  private readonly l = ["bark1.wav", "bark2.wav", "bark3.wav", "bark4.wav", "bark5.wav", "bark6.wav", "bark7.wav"];
  private readonly pre = "/audio/";
  private readonly pret = "/audio/bark/"
  
  private flag = false;

  public constructor(props?: DogSpeechProps) {
    super({...props});
    this.add(
      <Layout ref={this.imageRoot} position={[0, 200]}>
        <Img src={"/dog/oniondog_stencil.png"} position={[0, -200]} size={[700, 700]} ref={this.dogImage}/>
        <AudioHelper ref={this.audioHelper} context={props.context}/>
        <AudioHelper ref={this.audioHelper_bup} context={props.context} />
      </Layout>
    );

    this.player = props.context.getAudioPlayer();

    const a = this.l.map(s => this.pre + s);
    const at = this.l.map(s => this.pret + s);

    this.audioHelper().addSource(...a);
    this.audioHelper_bup().addSource(...at);

    this.flag = false;
  }

  public *speak(text: string, speed: number = 1.0) {
    let anim_time = text.length / (30 * speed);
    // every .1 seconds, call a func

    const ah = this.audioHelper;
    const aht = this.audioHelper_bup;

    const that = this;

    useThread().spawn(function* () {
      const tt = 0.1 / speed;
      const fac = (1.0 / Math.max(tt, 0.001));
      for (let i = 0; i < (fac * anim_time); i++) {
        if (that.flag) {
          yield* aht().playSample();
        } else {
          yield* ah().playSample();
        }

        that.flag = !that.flag;

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