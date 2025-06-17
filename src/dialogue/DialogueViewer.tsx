import { all, Reference, waitFor } from '@revideo/core';
import { DogSpeech } from '../dog/DogSpeech';
import { DialogueBox } from './DialogueBox';
import { Img, Txt } from '@revideo/2d';
import { IBaseEvent } from './event/IBaseEvent';
import { ImageEvent } from './event/ImageEvent';
import { PauseEvent } from './event/PauseEvent';
import { TextEvent } from './event/TextEvent';
import { HeadlineEvent } from './event/HeadlineEvent';
import { VideoPlayer } from '../video/VideoPlayer';
import { VideoEvent } from './event/VideoEvent';
import { VideoStopEvent } from './event/VideoStopEvent';
export class DialogueViewer {

  private readonly speech: Reference<DogSpeech>;
  private readonly dialogue: Reference<DialogueBox>;
  private readonly image: Reference<Img>;
  private readonly headline: Reference<Txt>;
  private readonly videoPlayer: Reference<VideoPlayer>;

  public constructor(
    speech: Reference<DogSpeech>,
    dialogue: Reference<DialogueBox>,
    image: Reference<Img>,
    headline: Reference<Txt>,
    videoPlayer: Reference<VideoPlayer>
  ) {
    this.speech = speech;
    this.dialogue = dialogue;
    this.image = image;
    this.headline = headline;
    this.videoPlayer = videoPlayer;
  }

  public *handleEvent(event: IBaseEvent): any {
    if (event instanceof ImageEvent) {
      yield* this.handleImage(event as ImageEvent);
    } else if (event instanceof PauseEvent) {
      yield* this.handlePause(event as PauseEvent);
    } else if (event instanceof TextEvent) {
      yield* this.handleText(event as TextEvent);
    } else if (event instanceof HeadlineEvent) {
      yield* this.handleHeadline(event as HeadlineEvent);
    } else if (event instanceof VideoEvent) {
      yield* this.handleVideo(event as VideoEvent);
      // would like to duck the bg audio while this is playing
    } else if (event instanceof VideoStopEvent) {
      yield* this.handleVideoStop(event as VideoStopEvent);
    }
  }

  private *handleImage(event: ImageEvent) {
    this.image().src(event.src);
    this.image().opacity(1.0);
  }

  private *handlePause(event: PauseEvent) {
    yield* waitFor(event.duration);
  }

  private *handleText(event: TextEvent) {
    this.dialogue().opacity(1.0);
    this.headline().opacity(0.0);
    yield* all(
      this.dialogue().speak(event.content),
      this.speech().speak(event.content)
    );
  }

  private *handleHeadline(event: HeadlineEvent) {
    this.headline().text(event.title);
    this.headline().opacity(1.0);
    this.dialogue().opacity(0.0);
    yield* this.speech().play_sound("/audio/ping.wav");
  }

  private *handleVideo(event: VideoEvent) {
    yield* this.videoPlayer().playVideo(event.src, event.volume);
  }

  private *handleVideoStop(event: VideoStopEvent) {
    yield* this.videoPlayer().stopVideo();
  }
}