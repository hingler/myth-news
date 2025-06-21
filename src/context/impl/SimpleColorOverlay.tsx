import { Color, PossibleColor, Reference } from "@revideo/core";
import { IColorOverlay } from "../IColorOverlay";
import { Rect } from "@revideo/2d";

export class SimpleColorOverlay implements IColorOverlay {
  private readonly rect: Reference<Rect>;

  public constructor(rect: Reference<Rect>) {
    this.rect = rect;
  }

  public getOpacity() { return this.rect().opacity() }
  public getColor() : Color { return this.rect().fill() }

  public setOpacity(opac: number) { this.rect().opacity(opac); }
  public setColor(color: PossibleColor) { this.rect().fill(color); }
}