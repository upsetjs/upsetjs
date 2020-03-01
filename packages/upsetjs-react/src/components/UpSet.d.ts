import React, { PropsWithChildren } from 'react';
import { ExtraStyles } from '../theme';
import { ISet, ISets, IIntersectionSet, IIntersectionSets } from '../data';
export declare type UpSetSizeProps = {
    width: number;
    height: number;
    /**
     * padding within the svg
     * @default 20
     */
    padding?: number;
    /**
     * padding argument for scaleBand
     * @default 0.1
     */
    barPadding?: number;
    /**
     * width ratios for different plots
     * [set chart, set labels, intersection chart]
     * @default [0.25, 0.1, 0.65]
     */
    widthRatios?: [number, number, number];
    /**
     * height ratios for different plots
     * [intersection chart, set chart]
     * @default [0.6, 0.4]
     */
    heightRatios?: [number, number];
};
export declare type UpSetDataProps<T> = {
    /**
     * the sets to visualize
     */
    sets: ISets<T>;
    /**
     * the intersections to visualize by default all intersections
     */
    intersections?: IIntersectionSets<T>;
};
export declare type UpSetSelectionProps<T> = {
    selection?: ISet<T> | IIntersectionSet<T> | null;
    onSelectionChanged?(selection: ISet<T> | IIntersectionSet<T> | null): void;
};
export declare type UpSetStyleProps = {
    setName?: string | React.ReactNode;
    intersectionName?: string | React.ReactNode;
    selectionColor?: string;
    alternatingBackgroundColor?: string;
    color?: string;
    notMemberColor?: string;
    labelStyle?: React.CSSProperties;
    setLabelStyle?: React.CSSProperties;
    setNameStyle?: React.CSSProperties;
    axisStyle?: React.CSSProperties;
    intersectionNameStyle?: React.CSSProperties;
};
export declare type UpSetProps<T> = UpSetDataProps<T> & UpSetSizeProps & UpSetStyleProps & ExtraStyles;
export default function UpSet<T>({ className, style, children, width, height, padding: margin, barPadding, sets, intersections, selection, onSelectionChanged, intersectionName, setName, selectionColor, color, notMemberColor, alternatingBackgroundColor, labelStyle, setLabelStyle, intersectionNameStyle, setNameStyle, axisStyle, widthRatios, heightRatios, }: PropsWithChildren<UpSetProps<T> & UpSetSelectionProps<T>>): JSX.Element;
export declare function InteractiveUpSet<T>(props: PropsWithChildren<UpSetProps<T>>): JSX.Element;
