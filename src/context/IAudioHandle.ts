export interface IAudioHandle {
  play() : any;
  pause() : any;

  setVolume(vol: number): any;
  setVolume(vol: number, duration: number): any;
}
