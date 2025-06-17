import { Gradient, Layout, Node, NodeProps, Rect, RectProps, Txt } from "@revideo/2d";
import { createRef, tween } from "@revideo/core";

export class DialogueBox extends Rect {
  private readonly textRef = createRef<Txt>();
  private readonly layoutRef = createRef<Layout>();

  public constructor(props?: RectProps) {
    super(props);

    let g = new Gradient({
      fromY: -240,
      toY: 240,
      stops: [
        {offset: 0, color: '#c0c0c0e0'},
        {offset: 1, color: '#c0c0c0c0'}
      ]
    });

    this.add(
      <Rect layout size={["100%", "25%"]} bottom={this.bottom} fill={g} radius={32}>
        <Txt ref={this.textRef} size={['100%', '100%']} margin={[64, 64]} fontSize={64} textWrap={true}>
          asdasdasdasd <Txt.i>asdasd</Txt.i>
        </Txt>
      </Rect>
    )
  }

  public *speak(text: string) {
    let anim_time = text.length / 30;

    yield* tween(anim_time, (value) => {
      let state = value * text.length;
      let pre = text.substring(0, state);
      let post = text.substring(state);
      this.textRef().children(
        <>
          {pre}<Txt opacity={0.0}>{post}</Txt>
        </>
      )
      this.textRef().opacity(0.8);
    });
  }
}