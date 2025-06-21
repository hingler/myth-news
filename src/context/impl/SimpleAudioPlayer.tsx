import { Audio, Node, NodeProps } from "@revideo/2d";
import { IAudioPlayer } from "../IAudioPlayer";
import { createRef, Reference } from "@revideo/core";

export class SimpleAudioPlayer extends Node implements IAudioPlayer {
  private players: Set<Reference<Audio>>;

  public constructor(props: NodeProps) {
    super(props);
    this.players = new Set();
  }

  public *playSample(src: string) {
    this.cullPlayers();
    const audioRef = createRef<Audio>();
    // or: run on thread and make the method sync??
    yield this.add(<Audio ref={audioRef} src={src} play={false}/>);
    yield audioRef().play();
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