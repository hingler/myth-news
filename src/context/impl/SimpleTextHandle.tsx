import { Reference } from "@revideo/core";
import { ITextHandle } from "../ITextHandle";
import { Txt } from "@revideo/2d";

export class SimpleTextHandle implements ITextHandle {
  private readonly elem: Reference<Txt>;
  public constructor(elem: Reference<Txt>) {
    this.elem = elem;
  }

  public getContent() : string {
    return this.elem().text();
  }

  public setContent(content: string) {
    this.elem().text(content);
  }
}