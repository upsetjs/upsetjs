/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { UpSetJS, UpSetProps } from './UpSetJS';
import { VennDiagram as VennDiagramImpl } from './venn/VennDiagram';
import { VennDiagramProps } from './interfaces';

export * from './exporter';
export * from './UpSetJS';
export * from './fillDefaults';
export * from '@upsetjs/model';
export * from './dump';
export { createVennDiagramLayoutFunction } from './venn/layout/vennDiagramLayout';
export { createVennJSAdapter } from './venn/layout/vennjsAdapter';

export * as propValidators from './validators';

/**
 * UpSetJS main pure functional stateless React component, the generic argument T refers to the type of the elements
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
export default UpSetJS as <T>(p: UpSetProps<T> & React.RefAttributes<SVGSVGElement>) => React.ReactElement;

/**
 * UpSetJS main pure functional stateless React component, the generic argument T refers to the type of the elements
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
export const VennDiagram = VennDiagramImpl as <T>(
  p: VennDiagramProps<T> & React.RefAttributes<SVGSVGElement>
) => React.ReactElement;
