import { Audio } from "@revideo/2d";
import { IAudioHandle } from "../IAudioHandle";
import { Reference, tween } from "@revideo/core";

export class SimpleAudioHandle implements IAudioHandle {
  private readonly node: Reference<Audio>;
  private readonly src: string;
  public constructor(node: Reference<Audio>, src: string) {
    this.node = node;
    this.src = src;
  }

  public *play() { yield this.node().play(); }
  public pause() { this.node().pause(); }

  public *setVolume(vol: number) {
    yield this.node().pause();
    // tba
  }

  public getSrc() { return this.src; }
  public getPlayhead() { return this.node().getCurrentTime();  }
}
