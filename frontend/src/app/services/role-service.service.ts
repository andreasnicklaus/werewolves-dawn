import { Injectable } from '@angular/core';
import ROLES from 'src/app/data/roles.json';
import {Role} from "../interfaces/role";

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {

  constructor() { }

  getAllRoles(): Role[] {
    return ROLES
  }

  getRoleInfo(roleName: string): Role|undefined {
    return ROLES.find(role => role.name === roleName)
  }
}
