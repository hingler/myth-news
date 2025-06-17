import { Audio, brightness, FILTERS, Img, Layout, makeScene2D, Rect, Scene2D, Txt, TxtProps } from "@revideo/2d";
import { all, createRef, linear, makeProject, tween, useScene, waitFor } from "@revideo/core";
import { DialogueBox } from "./dialogue/DialogueBox";
import { DogSpeech } from "./dog/DogSpeech";
import { DialogueParser } from "./dialogue/DialogueParser";
import { IBaseEvent } from './dialogue/event/IBaseEvent';
import { DialogueViewer } from "./dialogue/DialogueViewer";

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
  const dialogueRef = createRef<DialogueBox>();
  const dogRef = createRef<DogSpeech>();
  const imageRef = createRef<Img>();
  const audioRef = createRef<Audio>();
  const titleRef = createRef<Txt>();
  const fadeRef = createRef<Rect>();

  const headlineRef = createRef<Txt>();

  view.add(
    <Audio src="/audio/newsflash.m4a" ref={audioRef}/>
  )

  view.add(
    <Img ref={imageRef} position={[0, -240]} height={1440} opacity={1.0} src={"/news/backdrop.png"} filters={[ brightness(0.5) ]}/>
  )

  view.add(
    <Img ref={imageRef} position={[220, -250]} size={[600,450]} src={"/news/pukeko.jpg"} opacity={0.0}/>
  )

  view.add(
    <DogSpeech ref={dogRef} left={[-200, 150]} scale={1.2}/>
  )

  view.add(
    <Img src={"/dog/newsstand.png"} size={[2560, 1440]} position={[0, 300]}/>
  )

  view.add(
    <DialogueBox ref={dialogueRef} size={['100%', '100%']} opacity={0.0}/>
  )

  view.add(
    <Rect fill={"#000000"} ref={fadeRef} opacity={.5} size={['100%', '100%']}/>
  )

  view.add(
    <Txt ref={titleRef} text={"Myths and Stories News"} fontFamily={"Comic Sans MS"} position={[-1080, 0]}
    {...titleStyle}
    />
  );

  view.add(
    <Txt ref={headlineRef} {...subtitleStyle} text={"dasdasd"} position={[0, 720]} opacity={0.0}/>
  )

  yield audioRef().play();


  let titleAnim = titleRef().position([-35, 0], .1, linear).to([35, 0], 2.7, linear).to([1080, 0], 0.1, linear)
  let opacityAnim = fadeRef().opacity(0.5, 2.7).to(0.0, 0.2);

  yield* all(titleAnim, opacityAnim);

  
  const dialogue = useScene().variables.get("dialogue", "/dialogue/testdialogue.xml");
  const content = fetchSynchronously(dialogue());
  console.log(content);
  const g = new DialogueParser();
  const events = g.parseDom(content);

  const viewer = new DialogueViewer(dogRef, dialogueRef, imageRef, headlineRef);

  console.log(events);

  for (let i = 0; i < events.length; i++) {
    yield* viewer.handleEvent(events[i]);
  }

  yield* tween(1.5, (value) => {
    audioRef().setVolume((1.0 - value) * 0.75 + 0.25);
  })
});

const dialogue_path = "/dialogue/dialogue_01.xml"

export default makeProject({
  scenes: [scene],
  variables: { dialogue: dialogue_path },
  settings: {
    // Example settings:
    shared: {
      size: {x: 1080, y: 1920}
    },

    rendering: {
      fps: 30
    },

    preview: {
      fps: 20
    }
  },
});