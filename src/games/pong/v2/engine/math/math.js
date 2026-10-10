export function lerp(a, b, alpha) {
  return a + (b - a) * alpha;
}

/**
 * Constrain `value` to the inclusive range [min, max].
 *
 * @param {Number} value
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value;
}

export function randomSign() {
  return Math.random() < 0.5 ? -1 : 1;
}

export function getRandomInt(min, max) {
  // Validate inputs
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Both min and max must be numbers.');
  }
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('Both min and max must be integers.');
  }
  if (min > max) {
    throw new Error('Min cannot be greater than max.');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
