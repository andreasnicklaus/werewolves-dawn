import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketService } from './websocket.service';
import { Subscribable } from '../../utils/subscribable';
import { WerewolfGame } from '../interfaces/werewolf-game';
import { MessageService } from './message.service';
import { Role } from '../interfaces/role';

const PLAYER_ID_KEY = 'ww.playerId';
const PLAYER_NAME_KEY = 'ww.playerName';
const ROOM_CODE_KEY = 'ww.roomCode';

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

@Injectable({
  providedIn: 'root',
})
export class GameService extends Subscribable {
  game: WerewolfGame | undefined;
  myName: string | undefined;
  myPlayerId: string | undefined;
  currentRoundId: number | undefined;

  constructor(
    private ws: WebsocketService,
    private ms: MessageService,
    private router: Router,
  ) {
    super();
    this.loadSession();
    ws.subscribe({ onmessage: this.handleMessage, onopen: this.handleOpen, ongiveup: this.handleGiveUp });
    if (ws.isConnected() && this.hasSession()) {
      this.rejoin();
    }
  }

  private loadSession(): void {
    try {
      this.myPlayerId = localStorage.getItem(PLAYER_ID_KEY) || undefined;
      this.myName = localStorage.getItem(PLAYER_NAME_KEY) || undefined;
    } catch (e) {
      // ignore storage errors
    }
  }

  private persistSession(name?: string, roomCode?: string): void {
    try {
      if (this.myPlayerId) localStorage.setItem(PLAYER_ID_KEY, this.myPlayerId);
      if (name) localStorage.setItem(PLAYER_NAME_KEY, name);
      if (roomCode) localStorage.setItem(ROOM_CODE_KEY, roomCode);
    } catch (e) {
      // ignore storage errors
    }
  }

  private clearSession(): void {
    this.myPlayerId = undefined;
    this.myName = undefined;
    this.game = undefined;
    this.currentRoundId = undefined;
    try {
      localStorage.removeItem(PLAYER_ID_KEY);
      localStorage.removeItem(PLAYER_NAME_KEY);
      localStorage.removeItem(ROOM_CODE_KEY);
    } catch (e) {
      // ignore storage errors
    }
  }

  private handleOpen = () => {
    if (this.hasSession()) {
      this.rejoin();
    }
  };

  private handleGiveUp = () => {
    this.clearSession();
  };

  private hasSession(): boolean {
    try {
      return !!localStorage.getItem(PLAYER_ID_KEY) && !!localStorage.getItem(ROOM_CODE_KEY);
    } catch (e) {
      return false;
    }
  }

  private isStale(roundId?: number): boolean {
    return (
      roundId !== undefined &&
      this.currentRoundId !== undefined &&
      roundId < this.currentRoundId
    );
  }

  private handleMessage = (msg: any) => {
    const {
      type,
      winnerFriendly,
      roleAfterTheRound,
      uncoveredRole,
      playersWithActions,
      roundId,
      roomCode,
    } = msg;

    if (type === 'rejoinFailed' || type === 'sessionExpired') {
      this.ms.addMessage('Could not rejoin the room');
      this.clearSession();
      this.router.navigate(['/']);
      return;
    }

    // Ignore stale events coming from a previous round.
    if (this.isStale(roundId)) return;

    if (type === 'winnerDetermined') {
      this.ms.addMessage(
        `Winner: ${winnerFriendly ? 'Villagers' : 'Werewolves'}`,
      );
      this.publish((cb: any) => {
        if (cb.onWinnerDetermined)
          cb.onWinnerDetermined(winnerFriendly, roleAfterTheRound);
      });
    } else if (type === 'gameStart') {
      if (roundId !== undefined) this.currentRoundId = roundId;
      this.ms.addMessage('The game starts now!');
      this.publish((cb: any) => {
        if (cb.onGameStart) cb.onGameStart();
      });
    } else if (type === 'NextPlayer') {
      this.publish((cb: any) => {
        if (cb.onNextPlayer) cb.onNextPlayer();
      });
    } else if (type === 'YourTurn') {
      if (roundId !== undefined) this.currentRoundId = roundId;
      this.ms.addMessage(`Your turn, ${this.myName}!`);
      this.publish((cb: any) => {
        if (cb.onYourTurn) cb.onYourTurn(roundId ?? this.currentRoundId);
      });
    } else if (type === 'RoundEnd') {
      this.publish((cb: any) => {
        if (cb.onRoundEnd) cb.onRoundEnd();
      });
      this.ms.addMessage('The round ended!');
    } else if (type === 'UncoveredCard') {
      this.publish((cb: any) => {
        if (cb.onUncoveredCard) cb.onUncoveredCard(uncoveredRole);
      });
      this.ms.addMessage(`You uncovered card: ${uncoveredRole.name}`);
    } else if (type === 'actionPlayers') {
      this.publish((cb: any) => {
        if (cb.onActionPlayerList) cb.onActionPlayerList(playersWithActions);
      });
    } else {
      // GameState or backward-compatible snapshot.
      if (roundId !== undefined) this.currentRoundId = roundId;
      this.game = msg;
      if (roomCode) {
        try {
          localStorage.setItem(ROOM_CODE_KEY, roomCode);
        } catch (e) {}
      }
      if (this.hasSession() && this.router.url !== '/game') {
        this.router.navigate(['/game']);
      }
      this.publish((cb: any) => {
        if (cb.onGameChange) cb.onGameChange(this.game);
      });
    }
  };

  getGame(): WerewolfGame | undefined {
    return this.game;
  }

  join(name: string, roomCode?: string) {
    if (!this.myPlayerId) this.myPlayerId = generateId();
    this.myName = name;
    this.persistSession(name, roomCode);
    this.ws.sendMessage({
      meta: 'join',
      name,
      roomCode,
      playerId: this.myPlayerId,
    });
  }

  rejoin() {
    let playerId = this.myPlayerId;
    let name = this.myName;
    let roomCode: string | null = null;
    try {
      playerId = playerId || localStorage.getItem(PLAYER_ID_KEY) || undefined;
      name = name || localStorage.getItem(PLAYER_NAME_KEY) || undefined;
      roomCode = localStorage.getItem(ROOM_CODE_KEY);
    } catch (e) {}

    if (!playerId || !roomCode) return;

    this.myPlayerId = playerId;
    this.myName = name;
    this.ws.sendMessage({
      meta: 'rejoin',
      name,
      roomCode,
      playerId,
    });
  }

  setupRoles(selectedRoles: Role[]): void {
    this.ws.sendMessage({
      meta: 'setupRoles',
      roles: selectedRoles,
    });
  }

  startGame() {
    this.ws.sendMessage({
      meta: 'startGame',
    });
  }

  vote(uuid: string) {
    console.log('Sending vote for', uuid);
    this.ws.sendMessage({
      meta: 'voteGiven',
      voteFor: uuid,
    });
  }

  leave() {
    this.ws.sendMessage({
      meta: 'leave',
    });
    this.clearSession();
  }

  getOwnRole() {
    return this.getOwnPlayerInfo()?.role;
  }

  getOwnPlayerInfo() {
    if (this.myPlayerId) {
      const found = this.game?.playerList.find((player) => player.uuid === this.myPlayerId);
      if (found) return found;
    }
    return this.game?.playerList.find((player) => player.name === this.myName);
  }

  sendWardenMove(selectedPlayerUUID: string) {
    this.ws.sendMessage({
      meta: 'wardenAction',
      selectedPlayerUUID,
    });
  }

  uncoverMiddleCard(selectedIndex: number) {
    this.ws.sendMessage({
      meta: 'uncoverMiddleCard',
      selectedIndex,
    });
  }

  sendAlphawolfMove(selectedPlayerUUID: string) {
    this.ws.sendMessage({
      meta: 'alphaWolfAction',
      selectedPlayerUUID,
    });
  }

  sendSeeingwolfMove(selectedPlayerUUID: string) {
    this.ws.sendMessage({
      meta: 'seeingWolfAction',
      selectedPlayerUUID,
    });
  }

  sendGhostBusterMove(selectedPlayerUUID: string) {
    this.ws.sendMessage({
      meta: 'ghostBusterAction',
      selectedPlayerUUID,
    });
  }

  sendWitchMove(selectedIndex: number, selectedPlayerUUID: string) {
    this.ws.sendMessage({
      meta: 'witchAction',
      selectedIndex,
      selectedPlayerUUID,
    });
  }

  sendIdiotMove(left: boolean) {
    this.ws.sendMessage({
      meta: 'idiotAction',
      left,
    });
  }

  sendFortuneTellerMove() {
    this.ws.sendMessage({
      meta: 'fortuneTellerAction',
    });
  }

  sendScoutMove(selectedIndex: number) {
    this.ws.sendMessage({
      meta: 'scoutAction',
      selectedIndex,
    });
  }

  sendTurnComplete() {
    this.ws.sendMessage({
      meta: 'turnComplete',
    });
  }
}