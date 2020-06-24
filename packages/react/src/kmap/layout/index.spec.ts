/// <reference types="jest"/>
import { bounds, setLabels, generate } from '.';

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
  });
});

describe('setLabels', () => {
  test('1', () => {
    // A A
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
    //  A A
    //B
    //B
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
    //   A   A
    //B
    //B
    //  C C C C
    const b = setLabels(3, {
      width: 220,
      height: 140,
      labelHeight: 20,
    });

    const c = 10;
    expect(b).toHaveLength(3);
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
      y: 25 + 20,
    });
    expect(b[1].notText[0]).toEqual({
      x: c,
      y: 75 + 20,
    });
    expect(b[2].hor).toBe(true);
    expect(b[2].text).toHaveLength(2);
    expect(b[2].notText).toHaveLength(2);
    expect(b[2].text[0]).toEqual({
      x: 25 + 20,
      y: c + 20 + 100,
    });
    expect(b[2].text[1]).toEqual({
      x: 125 + 20,
      y: c + 20 + 100,
    });
    expect(b[2].notText[0]).toEqual({
      x: 75 + 20,
      y: c + 20 + 100,
    });
    expect(b[2].notText[1]).toEqual({
      x: 175 + 20,
      y: c + 20 + 100,
    });
  });
  test('4', () => {
    //   A   A
    //          D
    //B
    //          D
    //
    //          D
    //B
    //          D
    //  C C C C
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
    expect(b[2].text[1]).toEqual({
      x: 125 + 20,
      y: c + 20 + 200,
    });
    expect(b[2].notText[0]).toEqual({
      x: 75 + 20,
      y: c + 20 + 200,
    });
    expect(b[2].notText[1]).toEqual({
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
    expect(b[3].text[1]).toEqual({
      x: c + 20 + 200,
      y: 25 + 100 + 20,
    });
    expect(b[3].notText[0]).toEqual({
      x: c + 20 + 200,
      y: 75 + 20,
    });
    expect(b[3].notText[1]).toEqual({
      x: c + 20 + 200,
      y: 75 + 100 + 20,
    });
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
    //  1 n1
    //2
    //n2
    const b = generate(
      [1, 2, 3],
      ([] as number[][]).concat([[1, 2, 3], [1, 2], [2, 3], [2]], [[1, 3], [1], [3], []]),
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
