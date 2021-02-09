/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren, useRef, useLayoutEffect, useState } from 'react';
import { clsx } from '../utils';

const MultilineText = /*!#__PURE__*/ React.memo(function MultilineText({
  width,
  text,
  dy,
  x,
  style,
  className,
}: {
  width: number;
  text: React.ReactNode;
  x?: string | number;
  dy: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<SVGTSpanElement>(null);
  const [lines, setLines] = useState<string[]>(typeof text === 'string' ? [text] : []);

  // update state upon text update
  useLayoutEffect(() => {
    if (typeof text === 'string') {
      setLines([text]);
    } else {
      setLines([]);
    }
  }, [text]);

  useLayoutEffect(() => {
    if (
      !ref.current ||
      ref.current.childElementCount > 0 ||
      typeof text !== 'string' ||
      typeof ref.current.getComputedTextLength !== 'function'
    ) {
      // already multi lines
      return;
    }
    const len = ref.current.getComputedTextLength();
    const lines: string[] = [];
    let lineWidth = width;
    let start = 0;
    // compute line splits
    const p = ref.current.getStartPositionOfChar(0);
    while (len > lineWidth) {
      p.x = lineWidth;
      const num = ref.current.getCharNumAtPosition(p);
      const space = text.lastIndexOf(' ', num);
      if (space < start) {
        break;
      }
      lines.push(text.slice(start, space + 1));
      const used = ref.current.getEndPositionOfChar(space + 1).x;
      start = space + 1;
      // new line with in the used part + a new line
      lineWidth = used + width;
    }
    lines.push(text.slice(start));
    setLines(lines);
  }, [ref, text, width]);

  if (!text) {
    return null;
  }
  return (
    <tspan ref={ref} dy={dy} style={style} x={x} className={className}>
      {lines.length > 1
        ? lines.map((l, i) => (
            <tspan key={l} x={0} dy={i > 0 ? '1.2em' : dy}>
              {l}
            </tspan>
          ))
        : text}
    </tspan>
  );
});

export default /*!#__PURE__*/ React.memo(function UpSetTitle({
  width,
  descriptionWidth = width,
  style,
}: PropsWithChildren<{
  width: number;
  descriptionWidth?: number;
  style: {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    styles: { title?: React.CSSProperties; description?: React.CSSProperties };
    classNames: { title?: string; description?: string };
  };
}>) {
  if (!style.title && !style.description) {
    return null;
  }
  return (
    <text>
      <MultilineText
        text={style.title}
        width={width}
        dy="10px"
        className={clsx(`titleTextStyle-${style.id}`, style.classNames.title)}
        style={style.styles.title}
      />
      <MultilineText
        x={0}
        width={descriptionWidth}
        dy={style.title ? '2em' : '10px'}
        text={style.description}
        className={clsx(`descTextStyle-${style.id}`, style.classNames.description)}
        style={style.styles.description}
      />
    </text>
  );
});
