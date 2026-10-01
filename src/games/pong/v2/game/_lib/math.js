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
