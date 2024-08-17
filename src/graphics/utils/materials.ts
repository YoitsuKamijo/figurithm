import { MeshBasicMaterial } from "three";
import {
  CANCEL_COLOR,
  ERROR_COLOR,
  PRIMARY_COLOR,
  SUCCESS_COLOR,
} from "../constants";

export const DARK_MATERIAL = new MeshBasicMaterial({ color: 0x000000 });
export const GREEN_MATERIAL = new MeshBasicMaterial({ color: SUCCESS_COLOR });
export const GLOW_MATERIAL = new MeshBasicMaterial({ color: PRIMARY_COLOR });
export const RED_MATERIAL = new MeshBasicMaterial({ color: ERROR_COLOR });
export const ORANGE_MATERIAL = new MeshBasicMaterial({ color: CANCEL_COLOR });
