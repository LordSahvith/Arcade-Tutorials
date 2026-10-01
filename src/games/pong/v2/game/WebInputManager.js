const GAME_KEYS = new Set(["ArrowUp", "ArrowDown", "Space"]);

export class WebInputManager {
  constructor() {
    this.pressedKeys = new Set();
    this.pointer = {
      pos: {
        x: 0,
        y: 0,
      },
      prevPos: {
        x: 0,
        y: 0,
      },
      lastClickPos: {
        x: 0,
        y: 0,
      },
      bIsDown: false,
    };
    this.canvas = null;
  }

  endTick() {
    this.pointer.prevPos = { ...this.pointer.pos };
  }

  attach(target = window, canvas) {
    target.addEventListener("keydown", this.onKeyDown);
    target.addEventListener("keyup", this.onKeyUp);

    if (canvas) {
      this.canvas = canvas;
      canvas.addEventListener("pointermove", this.onPointerMove);
      canvas.addEventListener("pointerdown", this.onPointerDown);
      canvas.addEventListener("pointerup", this.onPointerUp);
      canvas.addEventListener("pointercancel", this.onPointerUp);
    }

    // clear held keys if the window loses focus, otherwise the paddle keeps moving
    window.addEventListener("blur", this.onBlur);
    this.target = target;
  }

  detach() {
    this.target.removeEventListener("keydown", this.onKeyDown);
    this.target.removeEventListener("keyup", this.onKeyUp);
    if (this.canvas) {
      this.canvas.removeEventListener("pointermove", this.onPointerMove);
      this.canvas.removeEventListener("pointerdown", this.onPointerDown);
      this.canvas.removeEventListener("pointerup", this.onPointerUp);
      canvas.addEventListener("pointercancel", this.onPointerUp);
      this.canvas = null;
    }
    window.removeEventListener("blur", this.onBlur);
  }

  onBlur = () => {
    this.pressedKeys.clear();
    this.pointer.bIsDown = false;
  };

  /**
   * Input from Keyboard / Mouse / Gamepad
   *
   * @param {KeyboardEvent} event
   */
  onKeyDown = (event) => {
    if (GAME_KEYS.has(event.code)) event.preventDefault();
    this.pressedKeys.add(event.code);
  };

  onKeyUp = (event) => {
    const code = event.code;
    this.pressedKeys.delete(code);
  };

  setPointerPos(event) {
    const canvas = this.canvas;
    const rect = canvas.getBoundingClientRect();
    // scale from CSS pixels to canvas pixels, in case CSS resizes the canvas
    this.pointer.pos.x =
      (event.clientX - rect.left) * (canvas.width / rect.width);
    this.pointer.pos.y =
      (event.clientY - rect.top) * (canvas.height / rect.height);
  }

  onPointerMove = (event) => {
    this.setPointerPos(event);
  };

  onPointerDown = (event) => {
    this.setPointerPos(event);
    this.canvas.setPointerCapture(event.pointerId);
    this.pointer.lastClickPos = { ...this.pointer.pos };
    this.pointer.bIsDown = true;
  };

  onPointerUp = () => {
    this.pointer.bIsDown = false;
  };

  /** Returns -1, 0 or 1 from two sets of key codes. */
  axis(negativeCodes, positiveCodes) {
    return (
      (this.anyKeyPressed(positiveCodes) ? 1 : 0) -
      (this.anyKeyPressed(negativeCodes) ? 1 : 0)
    );
  }

  anyKeyPressed(codes) {
    for (const code of codes) {
      if (this.pressedKeys.has(code)) return true;
    }
    return false;
  }
}
