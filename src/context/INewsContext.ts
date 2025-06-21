import { IAudioPlayer } from './IAudioPlayer';
import { IColorOverlay } from './IColorOverlay';
import { ITextHandle } from './ITextHandle';

// stuff that needs to be passed in from root
export interface INewsContext {
  getAudioPlayer() : IAudioPlayer;
  getOverlay() : IColorOverlay;
  getHeadlineHandle() : ITextHandle;
}