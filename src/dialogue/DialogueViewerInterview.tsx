import { all, Reference, tween, waitFor } from "@revideo/core";
import { DialogueBox } from "./DialogueBox";
import { SimpleSpeechAnimator } from "../dog/SimpleSpeechAnimator";
import { INewsContext } from "../context/INewsContext";
import { IBaseEvent } from "./event/IBaseEvent";
import { TextEvent } from "./event/TextEvent";
import { HeadlineEvent } from "./event/HeadlineEvent";
import { PauseEvent } from "./event/PauseEvent";
import { SpeechFactory } from '../dog/SpeechFactory';
import { TransitionEvent } from "./event/TransitionEvent";

export class DialogueViewerInterview {
  private readonly dialogue: Reference<DialogueBox>;
  private readonly speaker: Reference<SimpleSpeechAnimator>;
  private readonly context: INewsContext;

  private readonly fac: SpeechFactory;

  public constructor(
    dialogue: Reference<DialogueBox>,
    speaker: Reference<SimpleSpeechAnimator>,
    context: INewsContext
  ) {
    this.dialogue = dialogue;
    this.speaker = speaker;
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
      this.fac.getSpeaker(event.speaker).speak(event.content, event.speed),
      this.speaker().animate_speech(event.content, event.speed)
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
}