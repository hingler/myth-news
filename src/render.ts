import {renderVideo} from '@revideo/renderer';

async function render() {
  console.log('Rendering video...');

  // This is the main function that renders the video
  const dialogue_path = "/dialogue/dialogue_01.xml"
  const file = await renderVideo({
    projectFile: './src/project2.tsx',
    variables: { dialogue: dialogue_path },
    settings: {logProgress: true},
  });

  console.log(`Rendered video to ${file}`);
}

render();
