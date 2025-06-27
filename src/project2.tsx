import { Audio, brightness, FILTERS, Img, Layout, makeScene2D, Node, Rect, Scene2D, Txt, TxtProps } from "@revideo/2d";
import { all, createRef, linear, makeProject, tween, useScene, waitFor } from "@revideo/core";
import { DialogueBox } from "./dialogue/DialogueBox";
import { DogSpeech } from "./dog/DogSpeech";
import { DialogueParser } from "./dialogue/DialogueParser";
import { IBaseEvent } from './dialogue/event/IBaseEvent';
import { VideoPlayer } from "./video/VideoPlayer";

import "./css/test.css"
import { SimpleAudioPlayer } from "./context/impl/SimpleAudioPlayer";
import { SimpleColorOverlay } from "./context/impl/SimpleColorOverlay";
import { SimpleTextHandle } from "./context/impl/SimpleTextHandle";
import { SimpleNewsContext } from "./context/impl/SimpleNewsContext";
import { NewsroomScene } from "./scene/NewsroomScene";
import { INewsScene } from "./scene/INewsScene";
import { SceneEvent } from "./dialogue/event/SceneEvent";
import { SceneInfo } from "./dialogue/parser/SceneInfo";
import { BroadcastRunner } from "./scene/BroadcastRunner";
import { SimpleSceneFactory } from "./scene/SimpleSceneFactory";
import moment from "moment";

const baseTitle : TxtProps = {
  fill: "#9BEDF0",
  textWrap: true,
  textAlign: "center",
  stroke: "#3E3AA7",
  strokeFirst: true,
  lineWidth: 15
}

const titleStyle = {
  fontSize: 140,
  ...baseTitle
}

const subtitleStyle : TxtProps = {
  fontSize: 90,
  ...baseTitle
}

const dateStyle : TxtProps = {
  fontSize: 60,
  ...baseTitle
}

function fetchSynchronously(url: string) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, false); // 'false' makes the request synchronous
  xhr.send();

  if (xhr.status === 200) {
    return xhr.responseText;
  } else {
    throw new Error(`Request failed with status ${xhr.status}`);
  }
}

const scene = makeScene2D('scene', function* (view) {
  const audioRef = createRef<Audio>();
  const titleRef = createRef<Txt>();
  const fadeRef = createRef<Rect>();

  const headlineRef = createRef<Txt>();

  const dialogue = useScene().variables.get("dialogue", "/dialogue/testdialogue.xml");
  const content = fetchSynchronously(dialogue());
  const g = new DialogueParser();
  const broadcastInfo = g.parseDom(content);
  const events = broadcastInfo.events;

  // base node
  // generify "audioplayer" to a thing with handles and shit
  // (ex. for music)
  view.add(
    <Audio src={broadcastInfo.musicSrc} ref={audioRef}/>
  )

  const sceneRoot = createRef<Node>();
  const playerRef = createRef<SimpleAudioPlayer>();

  yield view.add(<Node ref={sceneRoot}></Node>);
  // base node

  view.add(
    <Rect fill={"#000000"} ref={fadeRef} opacity={.5} size={['100%', '100%']}/>
  )

  // base node

  const layoutRef = createRef<Layout>();
  view.add(<Layout direction={"column"} layout ref={layoutRef} position={[-1080, 0]} />)
  layoutRef().add(
    <Txt ref={titleRef} text={broadcastInfo.title} fontFamily={"Comic Sans MS"} position={[0, 0]}
    {...titleStyle}
    />
  );

  const d = moment().format("MMMM Do, YYYY");

  layoutRef().add(
    <Txt.i fontFamily={"Comic Sans MS"} {...dateStyle} marginTop={32}>June 25th, 2025</Txt.i>
  );

  // base node?
  view.add(
    <Layout layout position={[0, 720]} margin={32}>
      <Txt ref={headlineRef} {...subtitleStyle} text={""} position={[0, 720]} opacity={1.0}/>
    </Layout>
  )

  yield view.add(
    <SimpleAudioPlayer ref={playerRef} />
  );

  let context = new SimpleNewsContext(
    new SimpleColorOverlay(fadeRef),
    playerRef,
    new SimpleTextHandle(headlineRef)
  );

  let scene : INewsScene = new NewsroomScene();
  // interview scene
  // root ref so we can just lob off the whole thing
  // or just purge sceneRoot of all its children
  let runner = new BroadcastRunner(sceneRoot, new SimpleSceneFactory(), context);
  yield audioRef().play();
  yield* runner.initializeScene(scene);



  let titleAnim = layoutRef().position([-35, 0], .1, linear)
    .to([35, 0], broadcastInfo.titleDuration, linear)
    .to([1080, 0], 0.1, linear)

  let opacityAnim = fadeRef().opacity(0.5, broadcastInfo.titleDuration).to(0.0, 0.2);


  yield* all(titleAnim, opacityAnim);

  yield* runner.runBroadcast(broadcastInfo);

  yield* waitFor(0.5);
});

const dialogue_path = "/res/09/dialogue_09.xml"

export default makeProject({
  scenes: [scene],
  variables: { dialogue: dialogue_path },
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