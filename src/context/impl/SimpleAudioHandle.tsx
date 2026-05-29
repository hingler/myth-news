import { Audio } from "@revideo/2d";
import { IAudioHandle } from "../IAudioHandle";
import { Reference, tween } from "@revideo/core";

export class SimpleAudioHandle implements IAudioHandle {
  private readonly node: Reference<Audio>;
  public constructor(node: Reference<Audio>) {
    this.node = node;
  }

  public *play() { yield this.node().play(); }
  public *pause() { yield this.node().pause(); }

  public *setVolume(vol: number, duration: number = 0.0) {
    if (duration < 0.0001) {
      yield this.node().setVolume(vol);
    } else {
      const va = this.node().getVolume();
      const vb = vol;
      yield* tween(duration, t => this.node().setVolume(t * (vb - va) + va));
    }
  }
}
