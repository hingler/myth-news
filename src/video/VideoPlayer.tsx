import { blur, brightness, Node, NodeProps, Video, Layout } from '@revideo/2d';
import { createRef, Reference, useLogger, useScene } from "@revideo/core";

export class VideoPlayer extends Layout {

  private readonly videoFG: Reference<Video> = createRef<Video>();
  private readonly videoBG: Reference<Video> = createRef<Video>();

  public constructor(props: NodeProps) {
    super(props);

    this.add(
      <Layout>
        <Video minHeight={"100%"} minWidth={"100%"} src={"/video/puffer.mov"} ref={this.videoBG} playbackRate={1.0} opacity={0.0} volume={0.0} filters={[ blur(16), brightness(0.5) ]}/>
        <Video maxHeight={"100%"} maxWidth={"100%"} src={"/video/puffer.mov"} ref={this.videoFG} playbackRate={1.0} opacity={0.0} volume={0.0}/>
      </Layout>
    )
  }

  public *playVideo(src: string, volume: number) {
    yield* this.stopVideo();
    this.videoFG().src(src);
    this.videoBG().src(src);

    this.videoBG().setVolume(0.0);
    this.videoFG().setVolume(volume);

    let video_res = this.videoFG().size();

    useLogger().warn(video_res.toString());
    useLogger().warn(useScene().getSize().toString());

    let size = useScene().getSize();

    let scale_fac = Math.min(size.x / video_res.x, size.y / video_res.y);
    this.videoFG().scale([scale_fac, scale_fac]);

    this.videoFG().opacity(1.0);
    this.videoBG().opacity(1.0);

    this.videoFG().play();
    this.videoBG().play();
  }

  public *stopVideo() {
    this.videoFG().pause();
    this.videoBG().pause();

    this.videoFG().opacity(0.0);
    this.videoBG().opacity(0.0);
  }
}