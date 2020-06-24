/// <reference types="jest"/>
import { bounds, setLabels, generate, generateShiftLookup } from '.';

describe('bounds', () => {
  test('1', () => {
    const b = bounds(1, {
      width: 100,
      height: 70,
      labelHeight: 20,
    });
    expect(b.cell).toBe(50);
    expect(b.horizontalSets).toBe(1);
    expect(b.verticalSets).toBe(0);
    expect(b.xOffset).toBe(0);
    expect(b.yOffset).toBe(0);
    expect(b.xBefore).toBe(0);
    expect(b.yBefore).toBe(20);
    expect(b.hCells).toBe(2);
    expect(b.vCells).toBe(1);
  });
  test('2', () => {
    const b = bounds(2, {
      width: 120,
      height: 120,
      labelHeight: 20,
    });
    expect(b.cell).toBe(50);
    expect(b.horizontalSets).toBe(1);
    expect(b.verticalSets).toBe(1);
    expect(b.xOffset).toBe(0);
    expect(b.yOffset).toBe(0);
    expect(b.xBefore).toBe(20);
    expect(b.yBefore).toBe(20);
    expect(b.hCells).toBe(2);
    expect(b.vCells).toBe(2);
  });
  test('3', () => {
    const b = bounds(3, {
      width: 220,
      height: 140,
      labelHeight: 20,
    });
    expect(b.horizontalSets).toBe(2);
    expect(b.verticalSets).toBe(1);
    expect(b.cell).toBe(50);
    expect(b.xOffset).toBe(0);
    expect(b.yOffset).toBe(0);
    expect(b.xBefore).toBe(20);
    expect(b.yBefore).toBe(20);
    expect(b.hCells).toBe(4);
    expect(b.vCells).toBe(2);
  });
  test('4', () => {
    const b = bounds(4, {
      width: 240,
      height: 240,
      labelHeight: 20,
    });
    expect(b.horizontalSets).toBe(2);
    expect(b.verticalSets).toBe(2);
    expect(b.cell).toBe(50);
    expect(b.xOffset).toBe(0);
    expect(b.yOffset).toBe(0);
    expect(b.xBefore).toBe(20);
    expect(b.yBefore).toBe(20);
    expect(b.hCells).toBe(4);
    expect(b.vCells).toBe(4);
  });
  test('5', () => {
    const b = bounds(5, {
      width: 8 * 50 + 20 + 20,
      height: 4 * 50 + 20 + 20 + 20,
      labelHeight: 20,
    });
    expect(b.horizontalSets).toBe(3);
    expect(b.verticalSets).toBe(2);
    expect(b.cell).toBe(50);
    expect(b.xOffset).toBe(0);
    expect(b.yOffset).toBe(0);
    expect(b.xBefore).toBe(20);
    expect(b.yBefore).toBe(40);
    expect(b.hCells).toBe(8);
    expect(b.vCells).toBe(4);
  });
});

describe('setLabels', () => {
  test('1', () => {
    // A nA
    const b = setLabels(1, {
      width: 100,
      height: 70,
      labelHeight: 20,
    });
    const c = 10;
    expect(b).toHaveLength(1);
    expect(b[0].hor).toBe(true);
    expect(b[0].text).toHaveLength(1);
    expect(b[0].notText).toHaveLength(1);
    expect(b[0].text[0]).toEqual({
      x: 25,
      y: c,
    });
    expect(b[0].notText[0]).toEqual({
      x: 75,
      y: c,
    });
  });
  test('2', () => {
    //  A nA
    //B
    //nB
    const b = setLabels(2, {
      width: 120,
      height: 120,
      labelHeight: 20,
    });
    const c = 10;
    expect(b).toHaveLength(2);
    expect(b[0].hor).toBe(true);
    expect(b[0].text).toHaveLength(1);
    expect(b[0].notText).toHaveLength(1);
    expect(b[0].text[0]).toEqual({
      x: 25 + 20,
      y: c,
    });
    expect(b[0].notText[0]).toEqual({
      x: 75 + 20,
      y: c,
    });
    expect(b[1].hor).toBe(false);
    expect(b[1].text).toHaveLength(1);
    expect(b[1].notText).toHaveLength(1);
    expect(b[1].text[0]).toEqual({
      x: c,
      y: 25 + 20,
    });
    expect(b[1].notText[0]).toEqual({
      y: 75 + 20,
      x: c,
    });
  });
  test('3', () => {
    //   A   nA
    //B
    //nB
    //  C nC nC C
    const b = setLabels(3, {
      width: 220,
      height: 140,
      labelHeight: 20,
    });

    const c = 10;
    const shift = 20;
    expect(b).toHaveLength(3);
    expect(b[0].hor).toBe(true);
    expect(b[0].text).toHaveLength(1);
    expect(b[0].notText).toHaveLength(1);
    expect(b[0].text[0]).toEqual({
      x: 50 + shift,
      y: c,
    });
    expect(b[0].notText[0]).toEqual({
      x: 150 + shift,
      y: c,
    });
    expect(b[1].hor).toBe(false);
    expect(b[1].text).toHaveLength(1);
    expect(b[1].notText).toHaveLength(1);
    expect(b[1].text[0]).toEqual({
      x: c,
      y: 25 + shift,
    });
    expect(b[1].notText[0]).toEqual({
      x: c,
      y: 75 + shift,
    });
    expect(b[2].hor).toBe(true);
    expect(b[2].text).toHaveLength(2);
    expect(b[2].notText).toHaveLength(2);
    expect(b[2].text[0]).toEqual({
      x: 25 + shift,
      y: c + shift + 100,
    });
    expect(b[2].notText[0]).toEqual({
      x: 75 + shift,
      y: c + shift + 100,
    });
    expect(b[2].notText[1]).toEqual({
      x: 125 + shift,
      y: c + shift + 100,
    });
    expect(b[2].text[1]).toEqual({
      x: 175 + shift,
      y: c + shift + 100,
    });
  });
  test('4', () => {
    //   A   nA
    //          D
    //B
    //          nD
    //
    //          nD
    //nB
    //          D
    //  C nC nC C
    const b = setLabels(4, {
      width: 240,
      height: 240,
      labelHeight: 20,
    });

    const c = 10;
    expect(b).toHaveLength(4);
    expect(b[0].hor).toBe(true);
    expect(b[0].text).toHaveLength(1);
    expect(b[0].notText).toHaveLength(1);
    expect(b[0].text[0]).toEqual({
      x: 50 + 20,
      y: c,
    });
    expect(b[0].notText[0]).toEqual({
      x: 150 + 20,
      y: c,
    });
    expect(b[1].hor).toBe(false);
    expect(b[1].text).toHaveLength(1);
    expect(b[1].notText).toHaveLength(1);
    expect(b[1].text[0]).toEqual({
      x: c,
      y: 50 + 20,
    });
    expect(b[1].notText[0]).toEqual({
      x: c,
      y: 150 + 20,
    });
    expect(b[2].hor).toBe(true);
    expect(b[2].text).toHaveLength(2);
    expect(b[2].notText).toHaveLength(2);
    expect(b[2].text[0]).toEqual({
      x: 25 + 20,
      y: c + 20 + 200,
    });
    expect(b[2].notText[0]).toEqual({
      x: 75 + 20,
      y: c + 20 + 200,
    });
    expect(b[2].notText[1]).toEqual({
      x: 125 + 20,
      y: c + 20 + 200,
    });
    expect(b[2].text[1]).toEqual({
      x: 175 + 20,
      y: c + 20 + 200,
    });
    expect(b[3].hor).toBe(false);
    expect(b[3].text).toHaveLength(2);
    expect(b[3].notText).toHaveLength(2);
    expect(b[3].text[0]).toEqual({
      x: c + 20 + 200,
      y: 25 + 20,
    });
    expect(b[3].notText[0]).toEqual({
      x: c + 20 + 200,
      y: 75 + 20,
    });
    expect(b[3].notText[1]).toEqual({
      x: c + 20 + 200,
      y: 25 + 100 + 20,
    });
    expect(b[3].text[1]).toEqual({
      x: c + 20 + 200,
      y: 75 + 100 + 20,
    });
  });
  test('5', () => {
    //   A   nA
    //          D
    //B
    //          nD
    //
    //          nD
    //nB
    //          D
    //  C nC nC C
    const b = setLabels(5, {
      width: 8 * 50 + 20 + 20,
      height: 4 * 50 + 20 + 20 + 20,
      labelHeight: 20,
    });
    // 50 cell
    const c = 10;
    expect(b).toHaveLength(5);
    expect(b[0].hor).toBe(true);
    expect(b[0].text).toHaveLength(1);
    expect(b[0].notText).toHaveLength(1);
    expect(b[0].text[0]).toEqual({
      x: 100 + 20,
      y: c,
    });
    expect(b[0].notText[0]).toEqual({
      x: 300 + 20,
      y: c,
    });
    expect(b[2].hor).toBe(true);
    expect(b[2].text).toHaveLength(2);
    expect(b[2].notText).toHaveLength(2);
    expect(b[2].text[0]).toEqual({
      x: 50 + 20,
      y: c + 40 + 200,
    });
    expect(b[2].notText[0]).toEqual({
      x: 150 + 20,
      y: c + 40 + 200,
    });
    expect(b[2].notText[1]).toEqual({
      x: 250 + 20,
      y: c + 40 + 200,
    });
    expect(b[2].text[1]).toEqual({
      x: 350 + 20,
      y: c + 40 + 200,
    });
    expect(b[4].hor).toBe(true);
    expect(b[4].text).toHaveLength(4);
    expect(b[4].notText).toHaveLength(4);
    expect(b[4].text[0]).toEqual({
      x: 25 + 20,
      y: c + 20,
    });
    expect(b[4].notText[0]).toEqual({
      x: 75 + 20,
      y: c + 20,
    });
    expect(b[4].notText[1]).toEqual({
      x: 125 + 20,
      y: c + 20,
    });
    expect(b[4].text[1]).toEqual({
      x: 175 + 20,
      y: c + 20,
    });
    expect(b[4].text[2]).toEqual({
      x: 225 + 20,
      y: c + 20,
    });
    expect(b[4].notText[2]).toEqual({
      x: 275 + 20,
      y: c + 20,
    });
    expect(b[4].notText[3]).toEqual({
      x: 325 + 20,
      y: c + 20,
    });
    expect(b[4].text[3]).toEqual({
      x: 375 + 20,
      y: c + 20,
    });
  });
});

describe('generateShiftLookup', () => {
  test('1', () => {
    const c = generateShiftLookup<number, number[]>([1], 2, 1, (cs, s) => cs.includes(s));
    expect(c).toHaveLength(1);
    expect(c[0]([], [0, 0])).toEqual([1, 0]);
    expect(c[0]([1], [0, 0])).toEqual([0, 0]);
  });
  test('2', () => {
    const c = generateShiftLookup<number, number[]>([1, 2], 2, 2, (cs, s) => cs.includes(s));
    expect(c).toHaveLength(2);
    expect(c[0]([], [0, 0])).toEqual([1, 0]);
    expect(c[1]([], [0, 0])).toEqual([0, 1]);
    expect(c.reduceRight((acc, s) => s([], acc), [0, 0] as [number, number])).toEqual([1, 1]);

    expect(c[0]([1], [0, 0])).toEqual([0, 0]);
    expect(c[1]([1], [0, 0])).toEqual([0, 1]);
    expect(c.reduceRight((acc, s) => s([1], acc), [0, 0] as [number, number])).toEqual([0, 1]);

    expect(c[0]([2], [0, 0])).toEqual([1, 0]);
    expect(c[1]([2], [0, 0])).toEqual([0, 0]);
    expect(c.reduceRight((acc, s) => s([2], acc), [0, 0] as [number, number])).toEqual([1, 0]);

    expect(c[0]([1, 2], [0, 0])).toEqual([0, 0]);
    expect(c[1]([1, 2], [0, 0])).toEqual([0, 0]);
    expect(c.reduceRight((acc, s) => s([1, 2], acc), [0, 0] as [number, number])).toEqual([0, 0]);
  });
  test('3', () => {
    const c = generateShiftLookup<number, number[]>([1, 2, 3], 4, 2, (cs, s) => cs.includes(s));
    expect(c).toHaveLength(3);
    expect(c.reduceRight((acc, s) => s([1, 2, 3], acc), [0, 0] as [number, number])).toEqual([0, 0]);
    expect(c.reduceRight((acc, s) => s([1, 2], acc), [0, 0] as [number, number])).toEqual([1, 0]);

    expect(c[2]([2], [0, 0])).toEqual([1, 0]);
    expect(c[0]([2], [0, 0])).toEqual([3, 0]);
    expect(c[0]([2], [1, 0])).toEqual([2, 0]);
    expect(c.reduceRight((acc, s) => s([2], acc), [0, 0] as [number, number])).toEqual([2, 0]);

    expect(c.reduceRight((acc, s) => s([2], acc), [0, 0] as [number, number])).toEqual([2, 0]);
    expect(c.reduceRight((acc, s) => s([2, 3], acc), [0, 0] as [number, number])).toEqual([3, 0]);
    expect(c.reduceRight((acc, s) => s([1, 3], acc), [0, 0] as [number, number])).toEqual([0, 1]);
    expect(c.reduceRight((acc, s) => s([1], acc), [0, 0] as [number, number])).toEqual([1, 1]);
    expect(c.reduceRight((acc, s) => s([], acc), [0, 0] as [number, number])).toEqual([2, 1]);
    expect(c.reduceRight((acc, s) => s([3], acc), [0, 0] as [number, number])).toEqual([3, 1]);
  });
});

describe('generate', () => {
  test('1', () => {
    const b = generate([1], [1, 0], (cs, s) => cs === s, {
      width: 100,
      height: 70,
      labelHeight: 20,
    });
    expect(b.cell).toBe(50);
    expect(b.c).toHaveLength(2);
    expect(b.c[0]).toEqual({
      x: 0,
      y: 20,
    });
    expect(b.c[1]).toEqual({
      x: 0 + 50,
      y: 20,
    });
  });
  test('2', () => {
    //  1 n1
    //2
    //n2
    const b = generate([1, 2], [[1, 2], [2], [1], []], (cs, s) => cs.includes(s), {
      width: 120,
      height: 120,
      labelHeight: 20,
    });
    expect(b.cell).toBe(50);
    expect(b.c).toHaveLength(4);
    expect(b.c[0]).toEqual({
      x: 20,
      y: 20,
    });
    expect(b.c[1]).toEqual({
      x: 20 + 50,
      y: 20,
    });
    expect(b.c[2]).toEqual({
      x: 20,
      y: 20 + 50,
    });
    expect(b.c[3]).toEqual({
      x: 20 + 50,
      y: 20 + 50,
    });
  });
  test('3', () => {
    //    1    n1
    //2
    //n2
    //   3 n3 n3 3
    const b = generate(
      [1, 2, 3],
      ([] as number[][]).concat([[1, 2, 3], [1, 2], [2], [2, 3]], [[1, 3], [1], [], [3]]),
      (cs, s) => cs.includes(s),
      {
        width: 220,
        height: 140,
        labelHeight: 20,
      }
    );
    expect(b.cell).toBe(50);
    expect(b.c).toHaveLength(8);
    expect(b.c[0]).toEqual({
      x: 20,
      y: 20,
    });
    expect(b.c[1]).toEqual({
      x: 20 + 50,
      y: 20,
    });
    expect(b.c[2]).toEqual({
      x: 20 + 100,
      y: 20,
    });
    expect(b.c[3]).toEqual({
      x: 20 + 150,
      y: 20,
    });
    expect(b.c[4]).toEqual({
      x: 20,
      y: 20 + 50,
    });
    expect(b.c[5]).toEqual({
      x: 20 + 50,
      y: 20 + 50,
    });
    expect(b.c[6]).toEqual({
      x: 20 + 100,
      y: 20 + 50,
    });
    expect(b.c[7]).toEqual({
      x: 20 + 150,
      y: 20 + 50,
    });
  });
});
