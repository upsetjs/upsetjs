import { ISets, ISetCombinations } from '@upsetjs/model';
import { UpSetProps } from '../components/config';

export function exportVegaLite<T>(sets: ISets<T>, combinations: ISetCombinations<T>, props: Required<UpSetProps<any>>) {
  /*
  TODO: sizes, colors
  */
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    datasets: {
      sets: sets.map((set) => ({ name: set.name, cardinality: set.cardinality })),
      combinations: combinations
        .map((c) => ({
          name: c.name,
          cardinality: c.cardinality,
          p: 1, // has set list
          nsets: [''],
          sets: sets.filter((s) => c.sets.has(s)).map((s) => s.name),
        }))
        .concat(
          combinations.map((c) => ({
            name: c.name,
            cardinality: c.cardinality,
            p: 0, // has not set list for full dots
            sets: [''],
            nsets: sets.filter((s) => !c.sets.has(s)).map((s) => s.name),
          }))
        ),
    },
    vconcat: [
      {
        hconcat: [
          {
            mark: 'bar',
            width: 270,
            height: 200,
          },
          {
            data: {
              name: 'combinations',
            },
            transform: [
              {
                filter: {
                  field: 'p',
                  equal: 1,
                },
              },
            ],
            layer: [
              {
                mark: {
                  type: 'bar',
                },
              },
              {
                mark: {
                  type: 'text',
                  align: 'center',
                  baseline: 'bottom',
                  dy: -props.barLabelOffset,
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
                title: props.combinationName,
              },
            },
          },
        ],
      },
      {
        hconcat: [
          {
            data: {
              name: 'sets',
            },
            layer: [
              {
                mark: {
                  type: 'bar',
                },
              },
              {
                mark: {
                  type: 'text',
                  align: 'right',
                  baseline: 'middle',
                  dx: -props.barLabelOffset,
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
                title: props.setName,
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
            width: 100,
            mark: {
              type: 'text',
              align: 'center',
              baseline: 'middle',
              fontSize: props.fontSizes.setLabel,
            },
            encoding: {
              y: { field: 'name', type: 'ordinal', axis: null, sort: null },
              text: { field: 'name', type: 'ordinal' },
            },
          },
          {
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
                  size: 100, // TODO
                },
                encoding: {
                  color: {
                    field: 'p',
                    type: 'nominal',
                    legend: null,
                    scale: {
                      range: ['gray', 'black'],
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
                      field: 'p',
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
      concat: {
        spacing: 0,
      },
      view: {
        stroke: null,
      },
      scale: {
        bandPaddingInner: props.barPadding,
        bandPaddingOuter: props.barPadding,
        pointPadding: props.barPadding,
      },
      bar: {
        fill: props.color,
      },
      rule: {
        stroke: props.color,
        strokeWidth: 5, // TODO
      },
      axis: {
        labelFontSize: props.fontSizes.axisTick,
        titleColor: props.textColor,
        titleFontSize: props.fontSizes.chartLabel,
      },
      text: {
        fill: props.textColor,
        fontSize: props.fontSizes.barLabel,
      },
    },
  };
}
