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
    let scenes = doc.getElementsByTagName("scene");

    if (scenes.length == 0) {
      broadcastInfo.scenes = [ this.parseDocAsScene(doc) ];
    } else {

      let res : Array<SceneInfo> = [];
      for (let i = 0; i < scenes.length; i++) {
        res.push(this.parseScene(scenes[i]));
      }

      broadcastInfo.scenes = res;
    }

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

  // parses the doc itself as an individual scene
  private parseDocAsScene(rootDoc: Element | null) {
    let res = new SceneInfo();
    res.tag = "";
    res.descriptors = {};
    res.content = this.parseContent(rootDoc);

    return res;
  }

  // parse a single scene element
  private parseScene(root: Element) {
    let res = new SceneInfo();
    res.tag = root.getAttribute("tag") ?? "";

    res.descriptors = {};

    let header = root.getElementsByTagName("head");
    if (header.length > 0) {
      // parse head
      // tack onto descriptors
    }

    let content = root.getElementsByTagName("content");
    if (content.length > 0) {
      // parse content
      res.content = this.parseContent(content[0]);
      
    }

    return res;
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
      default:
        return null;
    }
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