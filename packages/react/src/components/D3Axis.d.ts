import { ScaleLinear, ScaleBand } from 'd3-scale';
import React, { PropsWithChildren } from 'react';
export declare type D3AxisProps = {
    d3Scale: ScaleLinear<any, number> | ScaleBand<any>;
    orient: 'top' | 'bottom' | 'left' | 'right';
    tickSizeInner?: number;
    tickSizeOuter?: number;
    tickPadding?: number;
} & React.SVGProps<SVGGElement>;
export default function D3Axis({ d3Scale: scale, orient, tickSizeInner, tickSizeOuter, tickPadding, ...extras }: PropsWithChildren<D3AxisProps>): JSX.Element;
