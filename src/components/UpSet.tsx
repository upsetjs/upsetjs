import React, { PropsWithChildren } from 'react';
import { ExtraStyles } from '../theme';
import { ISet, generateSetIntersections, ISets } from '../data';
import { scaleLinear, scaleBand, range } from 'd3-scale';

export type UpSetSizeProps = {
  width: number;
  height: number;
  margin?: number;
};

export type UpSetDataProps<T> = {
  sets: ReadonlyArray<ISet<T>>;
  intersections?: ReadonlyArray<ISet<T>>;
  selection?: ISet<T>;
  onSelectionChanged?(selection?: ISet<T>): void;
};

export type UpSetStyleProps = {};

export type UpSetProps<T> = UpSetDataProps<T> & UpSetSizeProps & UpSetStyleProps & ExtraStyles;

function generateScales(sets: ISets<any>, intersections: ISets<any>, margin: number) {
  return {
    sets: {
      x: scaleLinear()
        .domain([0, sets.reduce((acc, d) => Math.max(acc, d.cardinality), 0)])
        .range([margin.sets.w, 0]),
      y: scaleBand()
        .domain(sets.map(d => d.name))
        .range([0, margin.sets.h])
        .padding(margin.padding),
    },
    intersections: {
      x: scaleBand()
        .domain(intersections.map(d => d.name))
        .range([0, margin.intersections.w])
        .padding(margin.padding),
      y: scaleLinear()
        .domain([0, intersections.reduce((acc, d) => Math.max(acc, d.cardinality), 0)])
        .range([margin.intersections.h, 0]),
    },
  };
}

function SetChart<T>({}: PropsWithChildren<{}>) {
  return <g></g>;
}

function SetAxis({}: PropsWithChildren<{}>) {
  return <g></g>;
}

function IntersectionChart<T>({}: PropsWithChildren<{}>) {
  return <g></g>;
}

function IntersectionAxis({}: PropsWithChildren<{}>) {
  return <g transform={`translate(0,${margin.sets.h})`}></g>;
}

function Labels<T>({}: PropsWithChildren<{}>) {
  return <g></g>;
}

function UpSetChart({}: PropsWithChildren<{}>) {
  return <g transform={`translate(${margin.labels.w}, 0))`}></g>;
}

export default function UpSet<T>({
  className,
  style,
  children,
  width,
  height,
  margin = 20,
  sets,
  intersections = generateSetIntersections(sets),
}: PropsWithChildren<UpSetProps<T>>) {
  const scales = generateScales(sets, intersections, margin);

  return (
    <svg className={className} style={style} width={width} height={height}>
      <g transform={`translate(${margin},${margin})`}>
        <g transform={`translate(${margin.sets.w + margin.labels.w},0)`}>
          <SetChart />
          <SetAxis />
          <line
            x1={0}
            x2={margin.intersections.w}
            y1={margin.intersections.h + 1}
            y2={margin.intersections.h + 1}
            style={{ stroke: 'black' }}
          />
          <text
            style={{ textAnchor: 'middle' }}
            transform={`translate(${-30}, ${margin.intersections.h / 2})rotate(-90)`}
          >
            Intersection Size
          </text>
        </g>
        <g transform={`translate(0,${margin.intersections.h})`}>
          <IntersectionChart />
          <IntersectionAxis />
          <text style={{ textAnchor: 'middle' }} transform={`translate(${margin.sets.w / 2}, ${margin.sets.h + 30})`}>
            Set Size
          </text>
        </g>
        <g transform={`translate(${margin.sets.w},${margin.intersections.h})`}>
          <Labels />
          <UpSetChart />
        </g>
      </g>
      {children}
    </svg>
  );
}
