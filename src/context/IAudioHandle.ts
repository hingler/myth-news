export interface IAudioHandle {
  play() : any;
  pause() : any;
  setVolume(vol: number): any;

  getSrc(): string;
  getPlayhead(): number;
}
