/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

// import 'jest';
import React from 'react';
import { createVegaSpec } from './exportVegaLite';
import { render } from '@testing-library/react';
import { UpSetJS } from '../UpSetJS';
import { extractSets, generateCombinations } from '@upsetjs/model';
import got from '../__stories__/data/got.json';

describe('createVegaSpec', () => {
  const sets = extractSets(got);
  const combinations = generateCombinations(sets);
  test('basic render', () => {
    const { container } = render(<UpSetJS sets={sets} combinations={combinations} width={600} height={400} />);
    const spec = createVegaSpec(container.querySelector('svg')!, 'Test');
    expect(spec).toHaveProperty('title');
  });

  test('selection render', () => {
    const { container } = render(<UpSetJS sets={sets} width={600} height={400} selection={sets[0]} />);

    const spec = createVegaSpec(container.querySelector('svg')!, 'Test');
    expect(spec).toHaveProperty('title');
  });
  test('selection combination render', () => {
    const { container } = render(
      <UpSetJS sets={sets} combinations={combinations} width={600} height={400} selection={combinations[0]} />
    );

    const spec = createVegaSpec(container.querySelector('svg')!, 'Test');
    expect(spec).toHaveProperty('title');
  });

  test('query render', () => {
    const { container } = render(
      <UpSetJS sets={sets} width={600} height={400} queries={[{ name: 'test', color: 'green', set: sets[0] }]} />
    );

    const spec = createVegaSpec(container.querySelector('svg')!, 'Test');
    expect(spec).toHaveProperty('title');
  });

  test('queries render', () => {
    const { container } = render(
      <UpSetJS
        sets={sets}
        width={600}
        height={400}
        queries={[
          { name: 'test', color: 'green', set: sets[0] },
          { name: 'test2', color: 'red', set: sets[2] },
        ]}
      />
    );

    const spec = createVegaSpec(container.querySelector('svg')!, 'Test');
    expect(spec).toHaveProperty('title');
  });

  test('query and onHover render', () => {
    const { container } = render(
      <UpSetJS
        sets={sets}
        width={600}
        height={400}
        onHover={() => null}
        queries={[{ name: 'test', color: 'green', set: sets[0] }]}
      />
    );

    const spec = createVegaSpec(container.querySelector('svg')!, 'Test');
    expect(spec).toHaveProperty('title');
  });

  test('query and selection render', () => {
    const { container } = render(
      <UpSetJS
        sets={sets}
        width={600}
        height={400}
        selection={sets[1]}
        queries={[{ name: 'test', color: 'green', set: sets[0] }]}
      />
    );

    const spec = createVegaSpec(container.querySelector('svg')!, 'Test');
    expect(spec).toHaveProperty('title');
  });
});
