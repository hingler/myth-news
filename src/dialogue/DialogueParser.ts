import { HeadlineEvent } from "./event/HeadlineEvent";
import { IBaseEvent } from "./event/IBaseEvent";
import { ImageEvent } from "./event/ImageEvent";
import { PauseEvent } from "./event/PauseEvent";
import { TextEvent } from "./event/TextEvent";


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
};