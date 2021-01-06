/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import React from 'react';
import { UpSetJS } from '../UpSetJS';
import { sets } from './data';
import { VennDiagram } from '../venn/VennDiagram';
import { KarnaughMap } from '../kmap/KarnaughMap';
import { ISetLike } from '@upsetjs/model';

const stories = {
  title: 'Introduction',
};
export default stories;

export const Overview = () => {
  const [selection, setSelection] = React.useState(null as ISetLike<any> | null);
  return (
    <div>
      <UpSetJS sets={sets} width={1200} height={400} selection={selection} onHover={setSelection} />
      <VennDiagram sets={sets} width={500} height={430} selection={selection} onHover={setSelection} />
      <KarnaughMap sets={sets} width={700} height={430} selection={selection} onHover={setSelection} />
    </div>
  );
};
