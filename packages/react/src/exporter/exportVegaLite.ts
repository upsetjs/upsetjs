import { downloadUrl } from './exportSVG';
import { DARK_BACKGROUND_COLOR } from '../components/defaults';

export function exportVegaLite(node: SVGSVGElement, { title = 'UpSet' }: { title?: string } = {}) {
  /*
  TODO: sizes, colors
  */
  const resolveStyle =
    (node.getComputedStyle || node.ownerDocument?.defaultView?.getComputedStyle) ?? window.getComputedStyle;
  const theme = node.dataset.theme;
  const styleId = Array.from(node.classList)
    .find((d) => d.startsWith('root-'))!
    .slice('root-'.length);
  // const css = node.querySelector('style')!.textContent;

  const sets = Array.from(node.querySelectorAll<HTMLElement>('[data-cardinality][data-type=set]'))
    .map((set) => {
      return {
        name: set.querySelector(`text.setTextStyle-${styleId}`)!.textContent!,
        cardinality: Number.parseInt(set.dataset.cardinality!, 10),
      };
    })
    .reverse();
  const barLabelOffset = -Number.parseInt(node.querySelector(`.sBarTextStyle-${styleId}`)!.getAttribute('dx')!, 10);
  const color = resolveStyle(node.querySelector(`.fillPrimary-${styleId}`)!).fill;
  const fillNotMember = resolveStyle(node.querySelector(`.fillNotMember-${styleId}`)!).fill;
  const textColor = resolveStyle(node.querySelector('text')!).fill;
  const csName = node.querySelector(`.cChartTextStyle-${styleId}`)!.textContent!;
  const setName = node.querySelector(`.sChartTextStyle-${styleId}`)!.textContent!;

  const combinations = Array.from(node.querySelectorAll<HTMLElement>('[data-cardinality]:not([data-type=set])')).map(
    (set) => {
      return {
        name: set.querySelector(`text.hoverBarTextStyle-${styleId}`)!.textContent!,
        cardinality: Number.parseInt(set.dataset.cardinality!, 10),
        sets: Array.from(set.querySelectorAll<HTMLElement>(`.fillPrimary-${styleId} > title`)).map(
          (n) => n.textContent!
        ),
      };
    }
  );

  const translateX = (v: Element) => Number.parseInt(v.getAttribute('transform')!.match(/(\d+),/)![1], 10);
  const translateY = (v: Element) => Number.parseInt(v.getAttribute('transform')!.match(/,(\d+)/)![1], 10);
  const base = node.lastElementChild!;
  const padding = translateX(base);
  // combination axis block
  const setWidth = translateX(base.firstElementChild!.firstElementChild!);
  // axisline
  const csWidth = Number.parseInt(base.firstElementChild!.firstElementChild!.children[1]!.getAttribute('x2')!, 10);
  // set axis block
  const csHeight = translateY(base.firstElementChild!.lastElementChild!);
  // set label clip path
  const labelWidth = Number.parseInt(node.querySelector('defs rect')!.getAttribute('width')!, 10);
  const setHeight = Number.parseInt(node.querySelector('defs rect')!.getAttribute('height')!, 10);

  const radius = Number.parseInt(node.querySelector('[data-cardinality] circle')!.getAttribute('r')!, 10);

  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    title,
    datasets: {
      sets,
      combinations: combinations
        .map((c) => ({
          name: c.name,
          cardinality: c.cardinality,
          partOf: 1, // has set list
          nsets: [''],
          sets: c.sets,
        }))
        .concat(
          combinations.map((c) => ({
            name: c.name,
            cardinality: c.cardinality,
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
                filter: {
                  field: 'partOf',
                  equal: 1,
                },
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
            ],
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
            ],
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
              fontSize: Number.parseInt(resolveStyle(node.querySelector(`.setTextStyle-${styleId}`)!).fontSize, 10),
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
                      range: [fillNotMember, color],
                    },
                  },
                  y: { field: 'set', type: 'ordinal', axis: null, sort: null },
                },
              },
              {
                mark: 'rule',
                transform: [
                  {
                    filter: {
                      field: 'partOf',
                      equal: 1,
                    },
                  },
                  {
                    calculate: 'datum.sets[datum.sets.length -1]',
                    as: 'set_end',
                  },
                ],
                encoding: {
                  y: { field: 'sets[0]', type: 'ordinal', axis: null, sort: null },
                  y2: { field: 'set_end' },
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
          resolveStyle(node.querySelector(`[data-cardinality]:not([data-type=set]) line`)!).strokeWidth,
          10
        ),
      },
      axis: {
        labelColor: textColor,
        labelFontSize: Number.parseInt(resolveStyle(node.querySelector(`.axisTextStyle-${styleId}`)!).fontSize, 10),
        titleColor: textColor,
        titleFontSize: Number.parseInt(resolveStyle(node.querySelector(`.cChartTextStyle-${styleId}`)!).fontSize, 10),
      },
      title: {
        color: textColor,
      },
      text: {
        fill: textColor,
        fontSize: Number.parseInt(resolveStyle(node.querySelector(`.sBarTextStyle-${styleId}`)!).fontSize, 10),
      },
    },
  };

  const url = URL.createObjectURL(
    new Blob([JSON.stringify(spec, null, 2)], {
      type: 'application/json',
    })
  );
  downloadUrl(url, `${title}.json`, node.ownerDocument!);
  URL.revokeObjectURL(url);
}
