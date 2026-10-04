export class CommandBuffer {
  entries = [];

  record(actorId, command) {
    this.entries.push({ actorId, command });
    console.log(this.entries);
  }

  get length() {
    return this.entries.length;
  }
}
