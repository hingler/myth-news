import { useThread, waitFor } from "@revideo/core";
import { IAudioPlayer } from "../context/IAudioPlayer";
import { INewsContext } from '../context/INewsContext';

export class SimpleSpeechPlayer {
  private readonly player: IAudioPlayer;
  private readonly samples: Array<string> = [];

  public read_speed : number = 30.0;
  public speak_speed : number = 10.0;

  public constructor(context: INewsContext) { this.player = context.getAudioPlayer() }

  public AddSample(source: string) {
    this.samples.push(source);
  }

  public *speak(text: string, speed: number) {
    const tt = (1.0 / this.speak_speed);
    const anim_time = text.length / this.read_speed;
    const fac = this.speak_speed;

    const that = this;

    for (let i = 0; i < (fac * anim_time) - 1; i++) {
      yield* this.player.playSample(this.getRandomSample());
      yield* waitFor(tt);
    }
      
    // yield* useThread().spawn(function* () {

    //   for (let i = 0; i < (fac * anim_time) - 1; i++) {
    //     yield* that.player.playSample(that.getRandomSample());
    //     yield* waitFor(tt);
    //   }
    // });
  }

  private getRandomSample() {
    if (this.samples.length == 0) {
      return "";
    }

    const rn = Math.random();
    return this.samples[Math.floor(rn * this.samples.length)];
  }
}