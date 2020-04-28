/**
 * @upsetjs/math
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { quantilesType7, fivenum } from './boxplot';

function asc(a: number, b: number) {
  return a - b;
}

const closeTo = (expected: number, precision = 2) => ({
  asymmetricMatch: (actual: number) => Math.abs(expected - actual) < Math.pow(10, -precision) / 2,
});

function asB(q1: number, median: number, q3: number) {
  return {
    q1: closeTo(q1),
    median: closeTo(median),
    q3: closeTo(q3),
  };
}

describe('quantiles', () => {
  it('is a function', () => {
    expect(typeof quantilesType7).toBe('function');
  });
});

describe('fivenum', () => {
  it('is a function', () => {
    expect(typeof fivenum).toBe('function');
  });
});

describe('quantiles and fivenum', () => {
  describe('11', () => {
    const arr = [
      -0.402253,
      -1.4521869,
      0.135228,
      -1.8620118,
      -0.5687531,
      0.4218371,
      -1.1165662,
      0.5960255,
      -0.5008038,
      -0.394178,
      1.3709885,
    ].sort(asc);
    it('type7', () => {
      expect(quantilesType7(arr)).toEqual(asB(-0.84265965, -0.402253, 0.27853255));
    });
    it('fivenum', () => {
      expect(fivenum(arr)).toEqual(asB(-0.84265965, -0.402253, 0.27853255));
    });
  });
  describe('12', () => {
    const arr = [
      1.086657167,
      0.294672807,
      1.462293013,
      0.485641706,
      1.57748264,
      0.827809286,
      -0.397192557,
      -1.222111542,
      1.071236583,
      -1.182959319,
      -0.003749222,
      -0.360759239,
    ].sort(asc);
    it('type7', () => {
      expect(quantilesType7(arr)).toEqual(asB(-0.3698675685, 0.3901572565, 1.075091729));
    });
    it('fivenum', () => {
      expect(fivenum(arr)).toEqual(asB(-0.378975898, 0.3901572565, 1.078946875));
    });
  });

  describe('5', () => {
    const arr = [0, 25, 51, 75, 99].sort(asc);
    it('type7', () => {
      expect(quantilesType7(arr)).toEqual(asB(25, 51, 75));
    });
    it('fivenum', () => {
      expect(fivenum(arr)).toEqual(asB(25, 51, 75));
    });
  });

  describe('strange', () => {
    const arr = [18882.492, 7712.077, 5830.748, 7206.05].sort(asc);
    it('type7', () => {
      expect(quantilesType7(arr)).toEqual(asB(6862.2245, 7459.0635, 10504.68075));
    });
    it('fivenum', () => {
      expect(fivenum(arr)).toEqual(asB(6518.398999999999, 7459.0635, 13297.2845));
    });
  });
});
