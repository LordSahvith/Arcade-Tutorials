export class CommandBuffer {
  entries = [];

  constructor(maxEntries = 3600) {
    // about a minute at 60 ticks for one pawn
    this.maxEntries = maxEntries;
  }

  record(tick, actorId, command) {
    this.entries.push({ tick, actorId, command });
    if (this.entries.length > this.maxEntries) this.entries.shift();
  }

  clear() {
    this.entries.length = 0;
  }

  toJSON() {
    return this.entries;
  }
}
