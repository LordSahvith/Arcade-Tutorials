import { Pointer } from './Pointer';
import {
  PREVENT_DEFAULT_KEYS,
  DEFAULT_MENU_KEYS,
  DEFAULT_GAME_KEYS,
  DEFAULT_ACTION_KEYS,
} from './config';

export class WebInputManager {
  pressedKeys = new Set();
  justPressedKeys = new Set();
  pointer = new Pointer();
  canvas = null;
  target = null;

  constructor({
    preventDefaultKeys = PREVENT_DEFAULT_KEYS,
    menuKeys = DEFAULT_MENU_KEYS,
    gameKeys = DEFAULT_GAME_KEYS,
    actionKeys = DEFAULT_ACTION_KEYS,
  } = {}) {
    this.preventDefaultKeys = new Set(preventDefaultKeys);
    this.menuKeys = menuKeys;
    this.gameKeys = gameKeys;
    this.actionKeys = actionKeys;
  }

  endTick() {
    this.pointer.endTick();
    this.justPressedKeys.clear();
  }

  attach(target = window, canvas) {
    target.addEventListener('keydown', this.onKeyDown);
    target.addEventListener('keyup', this.onKeyUp);

    if (canvas) {
      this.canvas = canvas;
      canvas.addEventListener('pointermove', this.onPointerMove);
      canvas.addEventListener('pointerdown', this.onPointerDown);
      canvas.addEventListener('pointerup', this.onPointerUp);
      canvas.addEventListener('pointercancel', this.onPointerCancel);
    }

    // clear held keys if the window loses focus, otherwise the paddle keeps moving
    window.addEventListener('blur', this.onBlur);
    this.target = target;
  }

  detach() {
    this.target.removeEventListener('keydown', this.onKeyDown);
    this.target.removeEventListener('keyup', this.onKeyUp);
    if (this.canvas) {
      this.canvas.removeEventListener('pointermove', this.onPointerMove);
      this.canvas.removeEventListener('pointerdown', this.onPointerDown);
      this.canvas.removeEventListener('pointerup', this.onPointerUp);
      this.canvas.removeEventListener('pointercancel', this.onPointerCancel);
      this.canvas = null;
    }
    window.removeEventListener('blur', this.onBlur);
  }

  onBlur = () => {
    this.pressedKeys.clear();
    this.justPressedKeys.clear();
    this.pointer.cancel();
  };

  /**
   * Input from Keyboard / Mouse / Gamepad
   *
   * @param {KeyboardEvent} event
   */
  onKeyDown = event => {
    if (this.preventDefaultKeys.has(event.code)) event.preventDefault();
    if (!event.repeat) this.justPressedKeys.add(event.code);
    this.pressedKeys.add(event.code);
  };

  onKeyUp = event => {
    const code = event.code;
    this.pressedKeys.delete(code);
  };

  toCanvasPos(event) {
    const canvas = this.canvas;
    const rect = canvas.getBoundingClientRect();
    return {
      // scale from CSS pixels to canvas pixels, in case CSS resizes the canvas
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  onPointerMove = event => {
    const { x, y } = this.toCanvasPos(event);
    this.pointer.setMovePos(x, y);
  };

  onPointerDown = event => {
    this.canvas.setPointerCapture(event.pointerId);
    const { x, y } = this.toCanvasPos(event);
    this.pointer.onClicked(x, y);
  };

  onPointerCancel = () => {
    this.pointer.cancel();
  };

  onPointerUp = event => {
    const { x, y } = this.toCanvasPos(event);
    this.pointer.onReleased(x, y);
  };

  /** Returns -1, 0 or 1 from two sets of key codes. */
  axis(negativeCodes, positiveCodes) {
    return (
      (this.anyKeyPressed(positiveCodes) ? 1 : 0) -
      (this.anyKeyPressed(negativeCodes) ? 1 : 0)
    );
  }

  anyKeyPressed(codes) {
    this.#checkCodes(codes, 'anyKeyPressed');
    return codes.some(code => this.pressedKeys.has(code));
  }

  anyWasPressed(codes) {
    this.#checkCodes(codes, 'anyWasPressed');
    return codes.some(code => this.justPressedKeys.has(code));
  }

  wasPressed(code) {
    return this.justPressedKeys.has(code);
  }

  #checkCodes(codes, method) {
    if (!Array.isArray(codes)) {
      throw new Error(
        `${method}: expected an array of key codes, got ${codes}. Check the key name.`
      );
    }
  }
}
