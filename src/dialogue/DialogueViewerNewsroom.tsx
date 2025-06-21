import { all, Reference, tween, waitFor } from '@revideo/core';
import { DogSpeech } from '../dog/DogSpeech';
import { DialogueBox } from './DialogueBox';
import { Audio, Img, Rect, Txt } from '@revideo/2d';
import { IBaseEvent } from './event/IBaseEvent';
import { ImageEvent } from './event/ImageEvent';
import { PauseEvent } from './event/PauseEvent';
import { TextEvent } from './event/TextEvent';
import { HeadlineEvent } from './event/HeadlineEvent';
import { VideoPlayer } from '../video/VideoPlayer';
import { VideoEvent } from './event/VideoEvent';
import { VideoStopEvent } from './event/VideoStopEvent';
import { TransitionEvent } from './event/TransitionEvent';
import { SceneEvent } from './event/SceneEvent';
import { ITextHandle } from '../context/ITextHandle';
import { INewsContext } from '../context/INewsContext';
export class DialogueViewerNewsroom {

  private readonly speech: Reference<DogSpeech>;
  private readonly dialogue: Reference<DialogueBox>;
  private readonly image: Reference<Img>;
  private readonly videoPlayer: Reference<VideoPlayer>;
  private readonly context: INewsContext;

  public constructor(
    speech: Reference<DogSpeech>,
    dialogue: Reference<DialogueBox>,
    image: Reference<Img>,
    videoPlayer: Reference<VideoPlayer>,
    context: INewsContext
  ) {
    this.speech = speech;
    this.dialogue = dialogue;
    this.image = image;
    this.videoPlayer = videoPlayer;
    this.context = context;
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
    } else if (event instanceof TransitionEvent) {
      yield* this.handleTransition(event as TransitionEvent);
    } else if (event instanceof SceneEvent) {
      yield* this.handleScene(event as SceneEvent);
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
    this.context.getHeadlineHandle().setContent("");
    yield* all(
      this.dialogue().speak(event.content, event.speed),
      this.speech().speak(event.content, event.speed)
    );
  }

  private *handleHeadline(event: HeadlineEvent) {
    this.context.getHeadlineHandle().setContent(event.title);
    this.dialogue().opacity(0.0);
    yield* this.speech().play_sound("/audio/ping.wav");
  }

  private *handleVideo(event: VideoEvent) {
    this.context.getHeadlineHandle().setContent("");
    // tba
    // this.context.getAudioPlayer().setVolume(0.25 + 0.75 * (1.0 - event.volume));
    yield* this.videoPlayer().playVideo(event.src, event.volume, event.playbackRate);
  }

  private *handleVideoStop(event: VideoStopEvent) {
    // tba
    // this.bgAudio().setVolume(1.0);
    yield* this.videoPlayer().stopVideo();
  }

  private *handleTransition(event: TransitionEvent) {
    this.context.getHeadlineHandle().setContent("");
    this.dialogue().opacity(0.0);
    this.context.getOverlay().setOpacity(0.0);
    this.context.getOverlay().setColor(event.color);
    yield* tween(event.duration, t => this.context.getOverlay().setOpacity(t));

    // let events begin here
    yield tween(event.duration, t => this.context.getOverlay().setOpacity(1.0 - t));
  }

  private *handleScene(event: SceneEvent) {
    const events = event.info.events;
    for (let i = 0; i < events.length; i++) {
      // we need to do some shit to tell it what scene to open next
      yield* this.handleEvent(event);
    }
  }
}