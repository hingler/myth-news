import { HeadlineEvent } from "./event/HeadlineEvent";
import { IBaseEvent } from "./event/IBaseEvent";
import { ImageEvent } from "./event/ImageEvent";
import { PauseEvent } from "./event/PauseEvent";
import { TextEvent } from "./event/TextEvent";
import { TransitionEvent } from "./event/TransitionEvent";
import { VideoEvent } from "./event/VideoEvent";
import { VideoStopEvent } from "./event/VideoStopEvent";


export class DialogueParser {
  public parseDom(content: string) : Array<IBaseEvent> {
    let parser = new DOMParser();
  
    let tree = parser.parseFromString(content, "text/xml");
    let root = tree.getElementsByTagName("doc")[0];
  
    if (root == null) {
      return [];
    }
  
    let ce = root.children;
    let res: Array<IBaseEvent> = [];
    for (let i = 0; i < ce.length; i++) {
      let elem = ce[i];
      switch (elem.nodeName.toLowerCase()) {
        case "img":
          res.push(this.parseImg(elem));
          break;
        case "pause":
          res.push(this.parsePause(elem));
          break;
        case "text":
          res.push(this.parseText(elem));
          break;
        case "headline":
          res.push(this.parseHeadline(elem));
          break;
        case "video":
          res.push(this.parseVideo(elem));
          break;
        case "video-stop":
          res.push(this.parseVideoStop(elem));
          break;
        case "transition":
          res.push(this.parseTransition(elem));
          break;
      }
    }
  
    return res;
  }

  
  private parseImg(e: Element) : IBaseEvent {
    let src: string = e.attributes.getNamedItem("src")?.value ?? "";
    let caption: string = e.attributes.getNamedItem("caption")?.value ?? "";

    return new ImageEvent(src, caption);
  }

  private parsePause(e: Element) : IBaseEvent {
    let duration = e.attributes.getNamedItem("duration").value ?? "0.0";
    return new PauseEvent(parseFloat(duration) ?? 0.0);
  }

  private parseText(e: Element) : IBaseEvent {
    let content = e.textContent;
    return new TextEvent(content);
  }

  private parseHeadline(e: Element) : IBaseEvent {
    let content = e.textContent;
    return new HeadlineEvent(content);
  }

  private parseVideo(e: Element) : IBaseEvent {
    let source = e.attributes.getNamedItem("src")?.value ?? "";
    let volume = e.attributes.getNamedItem("volume")?.value ?? "0.0";
    let playbackRate = e.attributes.getNamedItem("playbackRate")?.value ?? "1.0";
    return new VideoEvent(source, parseFloat(volume), parseFloat(playbackRate));
  }

  private parseVideoStop(e: Element) : IBaseEvent { 
    return new VideoStopEvent(); 
  }

  private parseTransition(e: Element) : IBaseEvent {
    let duration = e.attributes.getNamedItem("duration")?.value ?? "0.25";
    let color = e.attributes.getNamedItem("color")?.value ?? "#FFFFFF";
    return new TransitionEvent(parseFloat(duration), color);
  }
};