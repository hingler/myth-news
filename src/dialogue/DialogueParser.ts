import { useLogger } from "@revideo/core";
import { HeadlineEvent } from "./event/HeadlineEvent";
import { IBaseEvent } from "./event/IBaseEvent";
import { ImageEvent } from "./event/ImageEvent";
import { PauseEvent } from "./event/PauseEvent";
import { TextEvent } from "./event/TextEvent";
import { TransitionEvent } from "./event/TransitionEvent";
import { VideoEvent } from "./event/VideoEvent";
import { VideoStopEvent } from "./event/VideoStopEvent";
import { BroadcastInfo, SceneInfo } from "./parser/SceneInfo";
import { SceneEvent } from "./event/SceneEvent";


export class DialogueParser {
  public parseDom(content: string) : BroadcastInfo {
    let parser = new DOMParser();
  
    let tree = parser.parseFromString(content, "text/xml");
    let broadcast = tree.getElementsByTagName("broadcast")[0];
    let doc: Element;
    if (broadcast == null) {
      doc = tree.getElementsByTagName("doc")[0];
    } else {
      doc = broadcast.getElementsByTagName("doc")[0];
    }
  
    if (doc == null) {
      return null;
    }
    
    let broadcastInfo = this.parseHeader(broadcast);
    broadcastInfo.events = this.parseContent(doc);

    return broadcastInfo;
  }

  private parseHeader(broadcastNode: Element | null) : BroadcastInfo {
    let res = new BroadcastInfo();
    let headElement = broadcastNode?.getElementsByTagName("head")[0];

    let title = this.getChildContent(headElement, "title", "Myths and Stories News");
    let duration = this.getChildAttribute(headElement, "title", "duration", "2.7");
    let music = this.getChildAttribute(headElement, "bgm", "src", "/audio/newsflash.m4a");

    res.title = title;
    res.titleDuration = parseFloat(duration);
    res.musicSrc = music;

    return res;
  }

  private getChildContent(root: Element | null, tagName: string, initial: string) : string {
    return root?.getElementsByTagName(tagName)[0]?.textContent ?? initial;
  }

  private getChildAttribute(root: Element | null, tagName: string, attributeName: string, initial: string) : string {
    return root?.getElementsByTagName(tagName)[0]?.getAttribute(attributeName) ?? initial;
  }

  // parses a content node (containing some number of events)
  private parseContent(contentElem: Element) : Array<IBaseEvent> {
    let ce = contentElem.children;
    let res: Array<IBaseEvent> = [];
    for (let i = 0; i < ce.length; i++) {
      let elem = ce[i];
      let event = this.parseContentTag(elem);
      if (event != null) {
        res.push(event);
      }
    }

    return res;
  }

  // parses a single content tag as an event
  private parseContentTag(elem: Element) : IBaseEvent {
    switch (elem.nodeName.toLowerCase()) {
      case "img":
        return this.parseImg(elem);
      case "pause":
        return this.parsePause(elem);
      case "text":
        return this.parseText(elem);
      case "headline":
        return this.parseHeadline(elem);
      case "video":
        return this.parseVideo(elem);
      case "video-stop":
        return this.parseVideoStop(elem);
      case "transition":
        return this.parseTransition(elem);
      case "scene":
        return this.parseScene(elem);
      default:
        return null;
    }
  }

  private parseScene(scene: Element) : IBaseEvent {
    let info = new SceneInfo();
    info.tag = scene.getAttribute("tag") ?? "interview";

    info.descriptors = {};

    let header = scene.getElementsByTagName("head")[0];
    let content = scene.getElementsByTagName("content")[0];
    if (header != null) {
      // parse head
      // tack onto descriptors

      if (content != null) {
        info.events = this.parseContent(content);
      }
    } else {
      // assume no header, no content tag
      info.events = this.parseContent(scene);
    }

    

    return new SceneEvent(info);
  }
  
  private parseImg(e: Element) : IBaseEvent {
    let src: string = e.attributes.getNamedItem("src")?.value ?? "";
    let caption: string = e.attributes.getNamedItem("caption")?.value ?? "";

    return new ImageEvent(src, caption);
  }

  private parsePause(e: Element) : IBaseEvent {
    let duration = e.attributes.getNamedItem("duration")?.value ?? "1.0";
    return new PauseEvent(parseFloat(duration) ?? 1.0);
  }

  private parseText(e: Element) : IBaseEvent {
    let content = e.textContent;
    let speed = e.getAttribute("speed") ?? "1.0";
    return new TextEvent(content, parseFloat(speed));
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