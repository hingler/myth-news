import { all, Reference, tween, waitFor } from "@revideo/core";
import { INewsContext } from "../context/INewsContext";
import { DialogueBox } from "./DialogueBox";
import { SpeechFactory } from "../dog/SpeechFactory";
import { HeadlineEvent } from "./event/HeadlineEvent";
import { TextEvent } from "./event/TextEvent";
import { PauseEvent } from "./event/PauseEvent";
import { IBaseEvent } from "./event/IBaseEvent";
import { TransitionEvent } from "./event/TransitionEvent";
import { VideoEvent } from "./event/VideoEvent";
import { VideoStopEvent } from "./event/VideoStopEvent";
import { VideoPlayer } from "../video/VideoPlayer";

export class DialogueViewerVideo {
  private readonly dialogue: Reference<DialogueBox>;
  private readonly videoPlayer: Reference<VideoPlayer>;
  private readonly context: INewsContext;

  private readonly fac: SpeechFactory;

  public constructor(
    dialogue: Reference<DialogueBox>,
    videoPlayer: Reference<VideoPlayer>,
    context: INewsContext
  ) {
    this.dialogue = dialogue;
    this.videoPlayer = videoPlayer;
    this.context = context;

    this.fac = new SpeechFactory(context);
  }

  public *handleEvent(event: IBaseEvent) : any {
    if (event instanceof PauseEvent) {
      yield* this.handlePause(event as PauseEvent);
    } else if (event instanceof TextEvent) {
      yield* this.handleText(event as TextEvent);
    } else if (event instanceof HeadlineEvent) {
      yield* this.handleHeadline(event as HeadlineEvent);
    } else if (event instanceof TransitionEvent) {
      yield* this.handleTransition(event as TransitionEvent);
    } else if (event instanceof VideoEvent) {
      yield* this.handleVideo(event as VideoEvent);
      // would like to duck the bg audio while this is playing
    } else if (event instanceof VideoStopEvent) {
      yield* this.handleVideoStop(event as VideoStopEvent);
    }
  }

  private *handlePause(event: PauseEvent) {
    yield* waitFor(event.duration);
  }

  private *handleText(event: TextEvent) {
    this.dialogue().opacity(1.0);
    this.context.getHeadlineHandle().setContent("");
    yield* all(
      this.dialogue().speak(event.content, event.speed),
      this.fac.getSpeaker(event.speaker).speak(event.content, event.speed)
    );
  }

  private *handleHeadline(event: HeadlineEvent) {
    this.context.getHeadlineHandle().setContent(event.title);
    this.dialogue().opacity(0.0);
    yield* this.context.getAudioPlayer().playSample("/audio/ping.wav");
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
}