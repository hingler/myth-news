import { INewsContext } from "../context/INewsContext";
import { SimpleSpeechPlayer } from "./SimpleSpeechPlayer";

export class SpeechFactory {
  private readonly dogSpeechSamples = ["/audio/bark1.wav", "/audio/bark2.wav", "/audio/bark3.wav", "/audio/bark4.wav", "/audio/bark5.wav", "/audio/bark6.wav", "/audio/bark7.wav"];
  private readonly smegoSpeechSamples = ["/audio/smego/squeak1.wav", "/audio/smego/squeak2.wav", "/audio/smego/squeak3.wav", "/audio/smego/squeak4.wav", "/audio/smego/squeak5.wav", "/audio/smego/squeak6.wav"]

  private readonly context: INewsContext;

  public constructor(context: INewsContext) {
    this.context = context;
  }

  public getSpeaker(name: string) : SimpleSpeechPlayer {
    switch (name) {
      case "alba":
      case "smego":
        const player = this.getPlayer(this.smegoSpeechSamples);
        player.speak_speed = 5.0;
        return player;
      default:
        return this.getPlayer(this.dogSpeechSamples);
    }
  }

  public getPlayer(samples: Array<string>) : SimpleSpeechPlayer {
    let res = new SimpleSpeechPlayer(this.context);
    samples.forEach((v) => res.AddSample(v));
    return res;
  }
}