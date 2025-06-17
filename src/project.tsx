import {createSignal, loopFor, makeProject} from '@revideo/core';

import { Audio, Img, makeScene2D, Video, initial, Txt } from '@revideo/2d';
import {all, chain, createRef, waitFor} from '@revideo/core';
import { DogSpeech } from './dog/DogSpeech';

/**
 * The Revideo scene
 */
const scene = makeScene2D('scene', function* (view) {

  // bouncing dog
  // text box

  // thinking: bouncing dog is called 1x per frame
  // animation is local
  // 
  const logoRef = createRef<Img>();
  const dogRef = createRef<DogSpeech>();
  const textref = createRef<Txt>();

  const contentref = createSignal("");

  // view add yield
  // view contains:
  // - onion dog
  // - dialogue

  // how do we make them both stick around, while also delegating workload?
  // - 
  yield view.add(
    <>
      <Video
        src={'https://revideo-example-assets.s3.amazonaws.com/stars.mp4'}
        size={['100%', '100%']}
        play={true}
      />
      <Audio
        src={'https://revideo-example-assets.s3.amazonaws.com/chill-beat.mp3'}
        play={true}
        time={17.0}
      />
    </>,
  );

  // yield view.add(
  //   <DogSpeech initialText={''} ref={dogRef} />
  // )

  // yield* dogRef().speak("hello there! just checking to see if this works!");

  yield* waitFor(1);

  view.add(
    <Img
      width={'1%'}
      ref={logoRef}
      src={
        'https://revideo-example-assets.s3.amazonaws.com/revideo-logo-white.png'
      }
    />,
  );

  view.add(
    <Txt
      ref={textref}
    />
  )
  
  yield textref().text("g");
  yield* textref().text("asdasd", 1);
  // yield* textRef().progress(1.0, 1);

  // yield*: yield the result of chain
  yield* chain(
    all(logoRef().scale(40, 2), logoRef().rotation(360, 2)),
    logoRef().scale(60, 1),
  );

  yield* loopFor(
    5, 
    () => logoRef().scale(60, 0.5).to(40, 0.25)
  );
});

/**
 * The final revideo project
 */
export default makeProject({
  scenes: [scene],
  settings: {
    // Example settings:
    shared: {
      size: {x: 1920, y: 1080},
    },
  },
});
