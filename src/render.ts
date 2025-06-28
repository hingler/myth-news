import {renderVideo} from '@revideo/renderer';
import { readFile } from "fs/promises"

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

async function render() {
  console.log('Rendering video...');

  // This is the main function that renders the video
  
  const dialogue_path = "./public/res/fortune/fortune_01.xml"
  const content = ((await readFile(dialogue_path)).toString());
  const file = await renderVideo({
    projectFile: './src/project2.tsx',
    variables: { dialogue: dialogue_path, dialogue_content: content },
    settings: {logProgress: true},
  });

  console.log(`Rendered video to ${file}`);
}

render();
