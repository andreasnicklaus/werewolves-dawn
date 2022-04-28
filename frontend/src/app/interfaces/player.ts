import {Role} from "./role";

export interface Player {
  uuid: string;
  name: string;
  role?: Role;
  vote?: string;
}
