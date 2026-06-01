import { Gradient, initial, Layout, Node, NodeProps, PossibleCanvasStyle, Rect, RectProps, signal, Txt } from "@revideo/2d";
import { createRef, SignalValue, SimpleSignal, tween } from "@revideo/core";

export class DialogueBox extends Rect {
  private readonly textRef = createRef<Txt>();
  private readonly layoutRef = createRef<Layout>();

  private static readonly g: Gradient = new Gradient({
    fromY: -240,
    toY: 240,
    stops: [
      {offset: 0, color: '#c0c0c0e0'},
      {offset: 1, color: '#c0c0c0c0'}
    ]
  });

  @initial("#000000")
  @signal()
  public readonly color: SimpleSignal<PossibleCanvasStyle>;

  @initial("#000000")
  @signal()
  public readonly textFill: SimpleSignal<PossibleCanvasStyle>;

  @initial("Helvetica")
  @signal()
  public readonly font: SimpleSignal<string>;

  public read_speed: number = 30.0;

  public constructor(props?: RectProps) {
    super(props);

    this.color(DialogueBox.g);

    this.add(
      <Rect layout size={["85%", "25%"]} position={[0, 560]} stroke={"#000000"} lineWidth={4} fill={() => this.color()} radius={32}>
        <Txt ref={this.textRef} size={['100%', '100%']} margin={[64, 64]} fontSize={48} textWrap={true} fill={() => this.textFill()} fontFamily={() => this.font()}>
        </Txt>
      </Rect>
    )
  }

  public *speak(text: string, speed: number = 1.0, fontFamily = "Helvetica") {
    let anim_time = text.length / (this.read_speed * speed);
    this.textRef().fontFamily(fontFamily);

    yield* tween(anim_time, (value) => {
      let state = value * text.length;
      let pre = text.substring(0, state);
      let post = text.substring(state);
      // could configure this with refs
      this.textRef().children(
        <>
          {pre}<Txt opacity={0.0}>{post}</Txt>
        </>
      )
      this.textRef().opacity(0.8);
    });
  }
}
