import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {
  currentMessage?: string;

  constructor() { }
}
