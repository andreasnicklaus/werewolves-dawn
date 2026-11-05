export class Subscribable {
  subscribers: Object[] = [];

  subscribe(callbacks: Object): () => void {
    this.subscribers.push(callbacks);
    return () => {
      const idx = this.subscribers.indexOf(callbacks);
      if (idx !== -1) this.subscribers.splice(idx, 1);
    };
  }

  unsubscribe(callbacks: Object) {
    const idx = this.subscribers.indexOf(callbacks);
    if (idx !== -1) this.subscribers.splice(idx, 1);
  }

  publish(publishFn: Function) {
    // Iterate over a snapshot so subscribers can unsubscribe during publish.
    [...this.subscribers].forEach((cb) => publishFn(cb));
  }
}
