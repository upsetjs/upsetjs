/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { UpSetProps, VennDiagramProps, KarnaughMapProps } from '../interfaces';
import React from 'react';
import { ISetLike } from '@upsetjs/model';
import UpSetJS from '../UpSetJS';
import VennDiagram from '../venn/VennDiagram';
import KarnaughMap from '../kmap/KarnaughMap';

export function InteractiveUpSetJS<T>(props: UpSetProps<T>) {
  const [selection, setSelection] = React.useState(null as ISetLike<T> | null);
  return <UpSetJS selection={selection} onHover={setSelection} {...props} />;
}

export function InteractiveVennDiagram<T>(props: VennDiagramProps<T>) {
  const [selection, setSelection] = React.useState(null as ISetLike<T> | null);
  return <VennDiagram selection={selection} onHover={setSelection} {...props} />;
}

export function InteractiveKarnaughMap<T>(props: KarnaughMapProps<T>) {
  const [selection, setSelection] = React.useState(null as ISetLike<T> | null);
  return <KarnaughMap selection={selection} onHover={setSelection} {...props} />;
}
