/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

export interface Row {
  name: string;
  age: number;
  shirtSize: 'S' | 'M' | 'L';
}

export const data: Row[] = [
  {
    name: 'Panchito Green',
    age: 10,
    shirtSize: 'S',
  },
  {
    name: 'Rubia Robker',
    age: 25,
    shirtSize: 'M',
  },
  {
    name: 'Micheil Sappell',
    age: 50,
    shirtSize: 'L',
  },
  {
    name: 'Geoffrey Sprason',
    age: 30,
    shirtSize: 'M',
  },
  {
    name: 'Grissel Rounsefull',
    age: 21,
    shirtSize: 'S',
  },
];
