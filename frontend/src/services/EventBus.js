class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    (this.listeners[event] ||= []).push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(fn => fn !== callback);
    };
  }

  emit(event, payload) {
    (this.listeners[event] || []).forEach(fn => fn(payload));
  }
}

export default new EventBus();
