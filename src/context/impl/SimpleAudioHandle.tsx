import { Audio } from "@revideo/2d";
import { IAudioHandle } from "../IAudioHandle";
import { Reference } from "@revideo/core";

export class SimpleAudioHandle implements IAudioHandle {
  private readonly node: Reference<Audio>;
  public constructor(node: Reference<Audio>) {
    this.node = node;
  }

  public *play() { yield this.node().play(); }
  public *pause() { yield this.node().pause(); }

  public *setVolume(vol: number) {
    yield this.node().setVolume(vol);
  }
}