/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import type { UpSetAddon as UpSetAddonImpl, ISetLike } from '@upsetjs/react';

export declare type UpSetReactElement = any;

export type UpSetReactElementComponentChild =
  | UpSetReactElement
  | object
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined;
export type UpSetReactElementComponentChildren = UpSetReactElementComponentChild[] | UpSetReactElementComponentChild;

export declare type UpSetAddon<T> = UpSetAddonImpl<ISetLike<T>, T, UpSetReactElement>;
export declare type UpSetAddons<T> = readonly UpSetAddon<T>[];
