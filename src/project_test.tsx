import { Layout, makeScene2D, Rect, Txt } from "@revideo/2d";
import { NewsroomScene } from "./scene/NewsroomScene";
import { INewsScene } from "./scene/INewsScene";
import { BroadcastRunner } from "./scene/BroadcastRunner";
import { createRef, makeProject } from "@revideo/core";
import { SimpleSceneFactory } from "./scene/SimpleSceneFactory";
import { SimpleColorOverlay } from "./context/impl/SimpleColorOverlay";
import { SimpleTextHandle } from "./context/impl/SimpleTextHandle";
import { SimpleNewsContext } from "./context/impl/SimpleNewsContext";
import { SimpleAudioPlayer } from "./context/impl/SimpleAudioPlayer";
import { InterviewScene } from "./scene/InterviewScene";
import { HoroscopeScene } from "./scene/HoroscopeScene";

const scene = makeScene2D("scene", function* (view) {
  // interview scene
  // root ref so we can just lob off the whole thing
  // or just purge sceneRoot of all its children

  const headlineRef = createRef<Txt>();
  const playerRef = createRef<SimpleAudioPlayer>();
  const fadeRef = createRef<Rect>();

  view.add(
    <Layout layout position={[0, 720]} margin={32}>
      <Txt ref={headlineRef} text={""} position={[0, 720]} opacity={1.0}/>
    </Layout>
  )

  yield view.add(
    <SimpleAudioPlayer ref={playerRef} />
  );

  yield view.add(
    <Rect fill={"#000000"} ref={fadeRef} opacity={.5} size={['100%', '100%']}/>
  )

  let context = new SimpleNewsContext(
    new SimpleColorOverlay(fadeRef),
    playerRef,
    new SimpleTextHandle(headlineRef)
  );

  let scene : INewsScene = new HoroscopeScene(
    context,
    ["very soon, you will hear a buzzer.", "please consider this."],
    [1, 19, 33, 35, 42, 57]
  );

  let ref = createRef<Layout>();
  yield view.add(<Layout ref={ref} />);
  let runner = new BroadcastRunner(ref, new SimpleSceneFactory(), context);
  yield* runner.initializeScene(scene);
})

export default makeProject({
  scenes: [scene],
  settings: {
    // Example settings:
    shared: {
      size: {x: 1080, y: 1920}
    },

    rendering: {
      fps: 60
    },

    preview: {
      fps: 20
    }
  },
});