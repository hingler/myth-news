// generic audio player

import { IAudioHandle } from "./IAudioHandle";

export interface IAudioPlayer {
  playSample(src: string) : any;
  // tba: get handle for playing and stopping samples

  getHandle(src: string) : IAudioHandle;
  freeHandle(handle: IAudioHandle): void;
  setVolume(handle: IAudioHandle, volume: number) : IAudioHandle;

  stop(): any;
}
