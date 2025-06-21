import { Color, PossibleColor } from "@revideo/core";

export interface IColorOverlay {
  getOpacity() : number;
  setOpacity(opac: number) : void;
  
  getColor() : Color;
  setColor(color: PossibleColor) : void;
}