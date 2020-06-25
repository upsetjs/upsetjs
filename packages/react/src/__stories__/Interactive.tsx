/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { UpSetProps } from '../interfaces';
import React from 'react';
import { ISetLike } from '@upsetjs/model';
import UpSetJS from '../UpSetJS';
import VennDiagram from '../venn/VennDiagram';
import KarnaughMap from '../kmap/KarnaughMap';

export function InteractiveUpSetJS<T>(props: UpSetProps<T>) {
  const [selection, setSelection] = React.useState(null as ISetLike<T> | null);
  return <UpSetJS selection={selection} onHover={setSelection} {...props} />;
}

export function InteractiveVennDiagram<T>(props: UpSetProps<T>) {
  const [selection, setSelection] = React.useState(null as ISetLike<T> | null);
  return <VennDiagram selection={selection} onHover={setSelection} {...props} />;
}

export function InteractiveKarnaughMap<T>(props: UpSetProps<T>) {
  const [selection, setSelection] = React.useState(null as ISetLike<T> | null);
  return <KarnaughMap selection={selection} onHover={setSelection} {...props} />;
}
