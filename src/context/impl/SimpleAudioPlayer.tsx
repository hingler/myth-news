import { Audio, Node, NodeProps } from "@revideo/2d";
import { IAudioPlayer } from "../IAudioPlayer";
import { createRef, Reference } from "@revideo/core";
import { IAudioHandle } from "../IAudioHandle";
import { SimpleAudioHandle } from "./SimpleAudioHandle";

export class SimpleAudioPlayer extends Node implements IAudioPlayer {
  private players: Set<Reference<Audio>>;
  private mappedPlayers: Map<IAudioHandle, Reference<Audio>>;

  public constructor(props: NodeProps) {
    super(props);
    this.players = new Set();
    this.mappedPlayers = new Map();
  }

  public *playSample(src: string) {
    this.cullPlayers();
    const audioRef = createRef<Audio>();
    // or: run on thread and make the method sync??
    yield this.add(<Audio ref={audioRef} src={src} play={true}/>);
  }

  public *stop() {
    for (const p of this.players) {
      p().pause();
    }
  }

  public getHandle(src: string) : IAudioHandle {
    const audioRef = createRef<Audio>();
    // or: run on thread and make the method sync??
    this.add(<Audio ref={audioRef} src={src} play={false}/>);
    return new SimpleAudioHandle(audioRef);
  }

  public freeHandle(handle: IAudioHandle) {
    if (this.mappedPlayers.has(handle)) {
      let r = this.mappedPlayers.get(handle);

      handle.pause();
      r().remove();
      this.mappedPlayers.delete(handle);
    }
  }

  private cullPlayers() {
    let completes : Array<Reference<Audio>> = [];
    this.players.forEach(a => {
      if (a().completion() >= 0.999) {
        completes.push(a);
      }
    })

    completes.forEach(a => {
      a().remove();
      this.players.delete(a);
    });
  }
}
