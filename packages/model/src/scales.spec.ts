import 'jest';
import { linearScale, logScale, bandScale } from './scales';

describe('linear', () => {
  test('base', () => {
    expect(typeof linearScale).toBe('function');
  });
});

describe('log', () => {
  test('base', () => {
    expect(typeof logScale).toBe('function');
  });
});

describe('band', () => {
  test('base', () => {
    expect(typeof bandScale).toBe('function');
  });
});
