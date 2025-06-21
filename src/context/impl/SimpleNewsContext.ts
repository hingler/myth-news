import { IAudioPlayer } from "../IAudioPlayer";
import { IColorOverlay } from "../IColorOverlay";
import { ITextHandle } from "../ITextHandle";
import { INewsContext } from '../INewsContext';
import { Reference } from "@revideo/core";
import { SimpleAudioPlayer } from "./SimpleAudioPlayer";

export class SimpleNewsContext implements INewsContext {
  private readonly overlay: IColorOverlay;
  private readonly headline: ITextHandle;
  private readonly player: Reference<SimpleAudioPlayer>;

  public constructor(
    overlay: IColorOverlay,
    player: Reference<SimpleAudioPlayer>,
    headline: ITextHandle
  ) {
    this.overlay = overlay;
    this.player = player;
    this.headline = headline;
  }

  public getAudioPlayer() {
    return this.player();
  }

  public getOverlay() {
    return this.overlay;
  }

  public getHeadlineHandle() {
    return this.headline;
  }
}