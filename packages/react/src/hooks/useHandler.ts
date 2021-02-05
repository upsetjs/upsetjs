import { useMemo } from 'react';
import { wrap } from '../components/utils';
import type { UpSetSelectionProps } from '../interfaces';

export default function useHandler(p: UpSetSelectionProps) {
  const onClick = p.onClick;
  return useMemo(
    () => ({
      hasClick: onClick != null,
      hasHover: p.onHover != null,
      onClick: wrap(onClick),
      onMouseEnter: wrap(p.onHover),
      onContextMenu: wrap(p.onContextMenu),
      onMouseLeave: p.onHover ? (evt: React.MouseEvent) => p.onHover!(null, evt.nativeEvent, []) : undefined,
      onMouseMove: wrap(p.onMouseMove),
      reset: (evt: React.MouseEvent<SVGElement>) => (onClick ? onClick(null, evt.nativeEvent, []) : null),
    }),
    [onClick, p.onHover, p.onContextMenu, p.onMouseMove]
  );
}

export declare type Handlers = ReturnType<typeof useHandler>;
