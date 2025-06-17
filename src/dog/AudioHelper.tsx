import { Audio, Node, NodeProps } from "@revideo/2d";
import { createRef, Logger, Reference, useLogger, waitFor } from "@revideo/core";

export class AudioHelper extends Node {
  private sources: Array<string>;
  private nodes: Array<Reference<Audio>>;

  private readonly NODE_COUNT = 5;
  private offset = 0;
  public constructor(props: NodeProps) {
    super(props);
    this.sources = [];
    this.nodes = [];

    for (let i = 0; i < this.NODE_COUNT; i++) {
      this.createNodeSync();
    }

    useLogger().warn("" + this.nodes.length);
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

  private *createNode() {
    const audioRef = createRef<Audio>();
    const audioNode = <Audio ref={audioRef} src={"/audio/bark1.wav"} play={false}/>
    yield this.add(audioNode);
    this.nodes.push(audioRef);

    useLogger().warn("created new node");

    return audioRef;
  }

  private createNodeSync() {
    const audioRef = createRef<Audio>();
    const audioNode = <Audio ref={audioRef} src={"/audio/bark1.wav"} play={false}/>
    this.add(audioNode);
    this.nodes.push(audioRef);

    useLogger().warn("created new node");
  }

  private *replaceNode(index: number, source: string) {
    useLogger().warn("replacing node " + index + " with " + source);
    const audioRef = createRef<Audio>();
    const audioNode = <Audio ref={audioRef} src={source} play={true}/>
    yield this.add(audioNode);
    this.nodes[index]().remove();
    this.nodes[index] = (audioRef);

    return audioRef;
  }

  private *addAndPlay(source: string) {
    const audioRef = yield* this.createNode();

    yield audioRef().src(source);
    
    yield audioRef().play();
  }

  public getRandomOffset() {
    const sample = Math.random();
    return Math.floor(sample * this.sources.length);
  }
}