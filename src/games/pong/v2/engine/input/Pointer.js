/**
 * Pointer state for one tick. Browser events write to it, game code reads
 * it during tick(), and endTick() rolls it over for the next tick.
 */
export class Pointer {
  move = { pos: { x: 0, y: 0 }, prevPos: { x: 0, y: 0 } };
  click = { pos: { x: 0, y: 0 }, prevPos: { x: 0, y: 0 } };
  bIsHeld = false;
  bWasPressed = false;
  bWasReleased = false;
  #bFirstMove = true;

  /** Movement since the last tick. */
  get delta() {
    return {
      x: this.move.pos.x - this.move.prevPos.x,
      y: this.move.pos.y - this.move.prevPos.y,
    };
  }

  setMovePos(x, y) {
    this.move.pos.x = x;
    this.move.pos.y = y;

    if (!this.#bFirstMove) return;

    this.move.prevPos.x = x;
    this.move.prevPos.y = y;
    this.#bFirstMove = false;
  }

  setClickPos(x, y) {
    this.click.prevPos.x = this.click.pos.x;
    this.click.prevPos.y = this.click.pos.y;
    this.click.pos.x = x;
    this.click.pos.y = y;
  }

  onClicked(x, y) {
    this.setMovePos(x, y);
    this.setClickPos(x, y);
    this.bIsHeld = true;
    this.bWasPressed = true;
  }

  onReleased(x, y) {
    this.setMovePos(x, y);
    this.bIsHeld = false;
    this.bWasReleased = true;
  }

  /** Focus lost or the browser cancelled the pointer: let go without a position */
  cancel() {
    if (this.bIsHeld) this.bWasReleased = true;
    this.bIsHeld = false;
  }

  endTick() {
    this.move.prevPos.x = this.move.pos.x;
    this.move.prevPos.y = this.move.pos.y;
    this.bWasPressed = false;
    this.bWasReleased = false;
  }
}
