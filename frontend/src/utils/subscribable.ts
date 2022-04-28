export class Subscribable {
  subscribers: Object[] = [];

  subscribe(callbacks: Object) {
    this.subscribers.push(callbacks)
  }

  unsubscribe(callbacks: Object) {
    this.subscribers.splice(this.subscribers.indexOf(callbacks), 1)
  }

  publish(publishFn: Function) {
    this.subscribers.forEach(cb => publishFn(cb))
  }
}
