/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike, UpSetQueries } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { clsx } from '../../utils';
import { UpSetSelection } from '../../components/interfaces';
import { mergeColor } from '../../components/utils';
import SelectionPattern from '../../venn/components/SelectionPattern';
import { KarnaughMapDataInfo } from '../derive/deriveKarnaughDataDependent';
import { VennDiagramSizeInfo } from '../../venn/derive/deriveVennSizeDependent';
import { VennDiagramStyleInfo } from '../../venn/derive/deriveVennStyleDependent';

export default function KMapCell<T>({
  d,
  i,
  style,
  elemOverlap,
  selected,
  h,
}: PropsWithChildren<{
  i: number;
  d: ISetLike<T>;
  selected: boolean;
  elemOverlap: null | ((s: ISetLike<T>) => number);
  selectionName?: string;
  style: VennDiagramStyleInfo;
  data: KarnaughMapDataInfo<T>;
  size: VennDiagramSizeInfo;
  queries: UpSetQueries<T>;
  qs: readonly ((s: ISetLike<T>) => number)[];
  h: UpSetSelection;
}>) {
  const o = elemOverlap ? elemOverlap(d) : 0;
  const fillFullSelection = (o === d.cardinality && d.cardinality > 0) || selected;
  const className = clsx(
    `arc-${style.id}`,
    o === 0 && !selected && `arcP-${style.id}`,
    fillFullSelection && `fillSelection-${style.id}`,
    style.classNames.set
  );
  const id = `upset-${style.id}-${i}`;
  // const secondary = elemOverlap != null || h.onMouseLeave != null;
  // const qsOverlaps = qs.map((q) => q(d));
  const tooltip = '';
  return (
    <g>
      <SelectionPattern
        id={id}
        v={o === 0 ? 0 : o / d.cardinality}
        suffix={`Selection-${style.id}`}
        bgFill={d.color}
        fill={!style.selectionColor ? d.color : undefined}
        styleId={style.id}
      />
      <rect
        onMouseEnter={h.onMouseEnter(d, [])}
        onMouseLeave={h.onMouseLeave}
        onClick={h.onClick(d, [])}
        onContextMenu={h.onContextMenu(d, [])}
        onMouseMove={h.onMouseMove(d, [])}
        className={className}
        style={mergeColor(
          style.styles.set,
          o > 0 && o < d.cardinality ? `url(#${id})` : !fillFullSelection || !style.selectionColor ? d.color : undefined
        )}
      >
        {style.tooltips && <title>{tooltip}</title>}
      </rect>
      {/* <text
        x={text.x}
        y={text.y}
        className={clsx(
          `${d.type === 'set' ? 'set' : 'value'}TextStyle-${style.id}`,
          `pnone-${style.id}`
          // circle.align === 'left' && `startText-${style.id}`,
          // circle.align === 'right' && `endText-${style.id}`
        )}
      >
        {title}
      </text> */}
    </g>
  );
}
