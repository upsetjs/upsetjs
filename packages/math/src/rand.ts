/**
 * @upsetjs/math
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

export function rand(seed = Date.now()) {
  // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}
