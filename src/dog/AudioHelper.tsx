import { Audio, Node, NodeProps } from "@revideo/2d";
import { createRef, Logger, Reference, useLogger, waitFor } from "@revideo/core";
import { INewsContext } from '../context/INewsContext';

export interface AudioHelperProps extends NodeProps {
  context: INewsContext;
}

export class AudioHelper extends Node {
  private sources: Array<string>;
  private nodes: Array<Reference<Audio>>;

  private context: INewsContext;

  private readonly NODE_COUNT = 5;
  private offset = 0;
  public constructor(props: AudioHelperProps) {
    super(props);
    this.sources = [];
    this.nodes = [];
    this.context = props.context;
  }

  public addSource(...src: Array<string>) {
    this.sources.push(...src);
  }

  public *playSample() {
    const source = this.sources[this.getRandomOffset()];
    yield* this.playSingleSample(source);

    // let active_node = yield* this.replaceNode(this.offset, source);
    // this.offset = (this.offset + 1) % this.NODE_COUNT;

    // useLogger().warn("" + this.offset);
    // yield active_node().src(source);
    // yield active_node().play();
  }

  public *playSingleSample(source: string) {
    yield* this.addAndPlay(source);
  }

  private *createNode(src: string = "/audio/bark1.wav") {
    const audioRef = createRef<Audio>();
    const audioNode = <Audio ref={audioRef} src={src} play={false}/>
    yield this.add(audioNode);
    this.nodes.push(audioRef);

    return audioRef;
  }

  private createNodeSync() {
    const audioRef = createRef<Audio>();
    const audioNode = <Audio ref={audioRef} src={"/audio/bark1.wav"} play={false}/>
    this.add(audioNode);
    this.nodes.push(audioRef);
  }

  // private *replaceNode(index: number, source: string) {
  //   useLogger().warn("replacing node " + index + " with " + source);
  //   const audioRef = createRef<Audio>();
  //   const audioNode = <Audio ref={audioRef} src={source} play={true}/>
  //   yield this.add(audioNode);
  //   this.nodes[index]().remove();
  //   this.nodes[index] = (audioRef);

  //   return audioRef;
  // }

  private *addAndPlay(source: string = "/audio/bark1.wav") {
    // const audioRef = yield* this.createNode(source);
    // yield audioRef().play();
    yield* this.context.getAudioPlayer().playSample(source);
  }

  public getRandomOffset() {
    const sample = Math.random();
    return Math.floor(sample * this.sources.length);
    // const sample = this.offset;
    // this.offset = (this.offset + 1) % this.sources.length;
    // return sample;
  }
}