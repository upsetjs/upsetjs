---
title: Data
---

`UpSetJS` requires sets and optionally combinations of sets as input. There are some utility function to help creating the required data structures:

- `extractSets<T extends { sets: string[] }>(elements: readonly T[]): ISet<T>[]`
  given an array of elements where each is having a property called `.sets` containing a list of set names in which this element is part of. e.g. `{ sets: ['Blue Hair', 'Female']}`. The return value is a list of sets in the required data structures and having a `.elems` with an array of the input elements.
- `asSets<T, S extends { name: string; elems: readonly T[] }>(sets: readonly S[]): (S & ISet<T>)[]`
  extends the given basic set objects (`name` and `elems`) with the required attributes for `UpSetJS`
- `generateCombinations<T>(sets: ISets<T>, { type = 'intersection', min = 0, max = Infinity, empty = false } = {}): ISetCombination<T>[]`
  one needs to generate the list of the combinations to show in case of customized sorting or filtering. This function takes the array of sets as input and computed all possible set intersections (aka. power set). The options allow to limit the generation to skip `empty` set combinations or enforce a minimum/maximum amount of sets in the set combinations. There are three types: `intersection` to generate set intersections, `union` for set unions, and `distinctIntersection` for set intersections that do not appear in any other set
