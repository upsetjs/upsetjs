/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { downloadUrl } from './exportSVG';
import { DARK_BACKGROUND_COLOR } from '../defaults';

export function exportVegaLite(svg: SVGSVGElement, { title = 'UpSet' }: { title?: string } = {}) {
  const resolveStyle =
    (svg.getComputedStyle || svg.ownerDocument?.defaultView?.getComputedStyle) ?? window.getComputedStyle;
  const theme = svg.dataset.theme;
  const styleId = Array.from(svg.classList)
    .find((d) => d.startsWith('root-'))!
    .slice('root-'.length);

  const sets: { name: string; cardinality: number; selection?: number }[] = Array.from(
    svg.querySelectorAll<HTMLElement>('[data-upset=sets] [data-cardinality]')
  )
    .map((set) => {
      return {
        name: set.querySelector(`text.setTextStyle-${styleId}`)!.textContent!,
        cardinality: Number.parseInt(set.dataset.cardinality!, 10),
      };
    })
    .reverse();
  const barLabelOffset = -Number.parseInt(svg.querySelector(`.sBarTextStyle-${styleId}`)!.getAttribute('dx')!, 10);
  const color = resolveStyle(svg.querySelector(`.fillPrimary-${styleId}`)!).fill;
  const fillNotMember = resolveStyle(svg.querySelector(`.fillNotMember-${styleId}`)!).fill;
  const textColor = resolveStyle(svg.querySelector('text')!).fill;
  const csName = svg.querySelector(`.cChartTextStyle-${styleId}`)!.textContent!;
  const setName = svg.querySelector(`.sChartTextStyle-${styleId}`)!.textContent!;

  const combinations: { name: string; cardinality: number; selection?: number; sets: string[] }[] = Array.from(
    svg.querySelectorAll<HTMLElement>('[data-upset=cs] [data-cardinality]')
  ).map((set) => {
    return {
      name: set.querySelector(`text.hoverBarTextStyle-${styleId}`)!.textContent!,
      cardinality: Number.parseInt(set.dataset.cardinality!, 10),
      sets: Array.from(set.querySelectorAll<HTMLElement>(`.fillPrimary-${styleId} > title`)).map((n) => n.textContent!),
    };
  });

  const translateX = (v: Element) => Number.parseInt(v.getAttribute('transform')!.match(/(\d+),/)![1], 10);
  const translateY = (v: Element) => Number.parseInt(v.getAttribute('transform')!.match(/,(\d+)/)![1], 10);
  const base = svg.querySelector('[data-upset=base]')!;
  const padding = translateX(base);
  // combination axis block
  const setWidth = translateX(svg.querySelector('[data-upset=csaxis]')!);
  // axisline
  const csWidth = Number.parseInt(base.querySelector('g')!.firstElementChild!.children[1]!.getAttribute('x2')!, 10);
  // set axis block
  const csHeight = translateY(svg.querySelector('[data-upset=setaxis]')!);
  // set label clip path
  const labelWidth = Number.parseInt(svg.querySelector('defs rect')!.getAttribute('width')!, 10);
  const setHeight = Number.parseInt(svg.querySelector('defs rect')!.getAttribute('height')!, 10);

  const radius = Number.parseInt(svg.querySelector('[data-cardinality] circle')!.getAttribute('r')!, 10);

  const hasPrimarySelection = svg.querySelector('[data-upset=sets-s] [data-cardinality]') != null;
  const hasQuery = svg.querySelector('[data-upset=sets-q] [data-cardinality]') != null;
  const hasSelection = hasPrimarySelection || hasQuery;

  let selectionColor = 'orange';
  if (hasSelection) {
    // inject the selection data
    Array.from(
      svg.querySelectorAll<HTMLElement>(
        `[data-upset=sets-${hasPrimarySelection ? 's]' : 'q]:first-of-type'} [data-cardinality]`
      )
    ).forEach((elem) => {
      // since artificially reversed
      const i = sets.length - Number.parseInt(elem.dataset.i!, 10) - 1;
      sets[i].selection = Number.parseInt(elem.dataset.cardinality!, 10);
    });
    Array.from(
      svg.querySelectorAll<HTMLElement>(
        `[data-upset=cs-${hasPrimarySelection ? 's]' : 'q:first-of-type'} [data-cardinality]`
      )
    ).forEach((elem) => {
      const i = Number.parseInt(elem.dataset.i!, 10);
      combinations[i].selection = Number.parseInt(elem.dataset.cardinality!, 10);
    });
    selectionColor = resolveStyle(
      svg.querySelector<HTMLElement>(`[data-upset=sets-${hasPrimarySelection ? 's' : 'q'}] [data-cardinality]`)!
    ).fill;
  }
  const highlightedCombination = Number.parseInt(
    svg.querySelector<HTMLElement>('[data-upset=cs-ss]')?.dataset.i ?? '-1',
    10
  );

  const filter =
    highlightedCombination >= 0
      ? {
          field: 'partOf',
          oneOf: [1, 2],
        }
      : {
          field: 'partOf',
          equal: 1,
        };

  // part of: 0 ... negative list, 1 ... positive set list, 2, ... positive and selected
  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    title,
    datasets: {
      sets,
      combinations: combinations
        .map((c, i) =>
          Object.assign({}, c, {
            partOf: highlightedCombination === i ? 2 : 1, // has set list
            nsets: [''],
          })
        )
        .concat(
          combinations.map((c) => ({
            name: c.name,
            cardinality: c.cardinality,
            // no selection!
            partOf: 0, // has not set list for full dots
            sets: [''],
            nsets: sets.filter((s) => !c.sets.includes(s.name)).map((s) => s.name),
          }))
        ),
    },
    vconcat: [
      {
        hconcat: [
          {
            mark: 'bar',
            width: setWidth + labelWidth - 40, // for the axis of the set chart
            height: csHeight,
          },
          {
            width: csWidth,
            height: csHeight,
            data: {
              name: 'combinations',
            },
            transform: [
              {
                filter,
              },
            ],
            layer: [
              {
                mark: {
                  type: 'bar',
                  tooltip: true,
                },
              },
              {
                mark: {
                  type: 'text',
                  align: 'center',
                  baseline: 'bottom',
                  dy: -barLabelOffset,
                },
                encoding: {
                  text: { field: 'cardinality', type: 'quantitative' },
                },
              },
              hasSelection && {
                mark: {
                  type: 'bar',
                  fill: selectionColor,
                  tooltip: true,
                },
                encoding: {
                  y: {
                    field: 'selection',
                    type: 'quantitative',
                  },
                },
              },
            ].filter(Boolean),
            encoding: {
              x: { field: 'name', type: 'ordinal', axis: null, sort: null },
              y: {
                field: 'cardinality',
                type: 'quantitative',
                axis: {
                  grid: false,
                },
                title: csName,
              },
            },
          },
        ],
      },
      {
        hconcat: [
          {
            width: setWidth,
            height: setHeight,
            data: {
              name: 'sets',
            },
            layer: [
              {
                mark: {
                  type: 'bar',
                  tooltip: true,
                },
              },
              {
                mark: {
                  type: 'text',
                  align: 'right',
                  baseline: 'middle',
                  dx: -barLabelOffset,
                },
                encoding: {
                  text: { field: 'cardinality', type: 'quantitative' },
                },
              },
              hasSelection && {
                mark: {
                  type: 'bar',
                  fill: selectionColor,
                  tooltip: true,
                },
                encoding: {
                  x: {
                    field: 'selection',
                    type: 'quantitative',
                  },
                },
              },
            ].filter(Boolean),
            encoding: {
              y: { field: 'name', type: 'ordinal', axis: null, sort: null },
              x: {
                field: 'cardinality',
                type: 'quantitative',
                title: setName,
                sort: 'descending',
                axis: {
                  grid: false,
                },
              },
            },
          },
          {
            data: {
              name: 'sets',
            },
            width: labelWidth,
            height: setHeight,
            mark: {
              type: 'text',
              align: 'center',
              baseline: 'middle',
              fontSize: Number.parseInt(resolveStyle(svg.querySelector(`.setTextStyle-${styleId}`)!).fontSize, 10),
            },
            encoding: {
              y: { field: 'name', type: 'ordinal', axis: null, sort: null },
              text: { field: 'name', type: 'ordinal' },
            },
          },
          {
            width: csWidth,
            height: setHeight,
            data: {
              name: 'combinations',
            },
            transform: [
              {
                flatten: ['sets'],
                as: ['has_set'],
              },
              {
                flatten: ['nsets'],
                as: ['has_not_set'],
              },
              {
                calculate: 'datum.has_set+datum.has_not_set',
                as: 'set',
              },
            ],
            layer: [
              {
                mark: {
                  type: 'circle',
                  size: radius * radius * Math.PI, // area
                  tooltip: true,
                },
                encoding: {
                  color: {
                    field: 'partOf',
                    type: 'nominal',
                    legend: null,
                    scale: {
                      range: [fillNotMember, color].concat(highlightedCombination >= 0 ? [selectionColor] : []),
                    },
                  },
                  y: { field: 'set', type: 'ordinal', axis: null, sort: null },
                },
              },
              {
                mark: 'rule',
                transform: [
                  {
                    filter,
                  },
                  {
                    calculate: 'datum.sets[datum.sets.length -1]',
                    as: 'set_end',
                  },
                ],
                encoding: {
                  y: { field: 'sets[0]', type: 'ordinal', axis: null, sort: null },
                  y2: { field: 'set_end' },
                  ...(highlightedCombination < 0
                    ? {}
                    : {
                        color: {
                          field: 'partOf',
                          type: 'nominal',
                          legend: null,
                          scale: {
                            range: [color, selectionColor],
                          },
                        },
                      }),
                },
              },
            ],
            encoding: {
              x: { field: 'name', type: 'ordinal', axis: null, sort: null },
            },
          },
        ],
      },
    ],
    config: {
      padding,
      background: theme === 'dark' ? DARK_BACKGROUND_COLOR : 'white',
      concat: {
        spacing: 0,
      },
      view: {
        stroke: null,
      },
      // scale: {
      //   bandPaddingInner: props.barPadding,
      //   bandPaddingOuter: props.barPadding,
      //   pointPadding: props.barPadding,
      // },
      bar: {
        fill: color,
      },
      circle: {
        opacity: 1,
      },
      rule: {
        stroke: color,
        strokeWidth: Number.parseInt(
          resolveStyle(svg.querySelector(`[data-upset=cs] [data-cardinality] line`)!).strokeWidth,
          10
        ),
      },
      axis: {
        labelColor: textColor,
        labelFontSize: Number.parseInt(resolveStyle(svg.querySelector(`.axisTextStyle-${styleId}`)!).fontSize, 10),
        titleColor: textColor,
        titleFontSize: Number.parseInt(resolveStyle(svg.querySelector(`.cChartTextStyle-${styleId}`)!).fontSize, 10),
      },
      title: {
        color: textColor,
      },
      text: {
        fill: textColor,
        fontSize: Number.parseInt(resolveStyle(svg.querySelector(`.sBarTextStyle-${styleId}`)!).fontSize, 10),
      },
    },
  };

  const url = URL.createObjectURL(
    new Blob([JSON.stringify(spec, null, 2)], {
      type: 'application/json',
    })
  );
  downloadUrl(url, `${title}.json`, svg.ownerDocument!);
  URL.revokeObjectURL(url);
}
