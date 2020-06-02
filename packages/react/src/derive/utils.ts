/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

export function generateId(_args?: any) {
  return `upset-${Math.random().toString(36).slice(4)}`;
}
