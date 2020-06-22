/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import { UpSetAddon as UpSetAddonImpl, ISetLike } from '@upsetjs/react';

export declare type UpSetReactElement = any;

export declare type UpSetAddon<T> = UpSetAddonImpl<ISetLike<T>, T, UpSetReactElement>;
export declare type UpSetAddons<T> = readonly UpSetAddon<T>[];
