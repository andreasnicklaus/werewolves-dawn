import {Role} from "./role";
import {Player} from "./player";

export interface WerewolfGame {
  myName: string;
  roomCode: string;
  numberofMiddleRoles: number;
  playerList: Player[];
  roles?: Role[];
  middleRoles: Role[];
}
