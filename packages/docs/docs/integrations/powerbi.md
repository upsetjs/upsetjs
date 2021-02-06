---
title: PowerBI
---

A [PowerBI Custom Visual](https://powerbi.microsoft.com/en-us/developers/custom-visualization/?cdn=disable) is available for rendering [UpSet.js](https://upset.js.org).

![UpSet.js Report](https://user-images.githubusercontent.com/4129778/80864985-9b771380-8c86-11ea-809c-a4473b32ed3b.png)

see also [Sample PBIX file](https://upset.js.org/integrations/powerbi/got.pbix)

## Installation

Download the latest package from [https://upset.js.org/integrations/powerbi/upsetjs.pbiviz](https://upset.js.org/integrations/powerbi/upsetjs.pbiviz) and install into your PowerBI environment.

## Data Roles

The UpSet.js visual has three data roles:

- `Elements` exactly one grouping with a unique identifier for each row (e.g., a name)
- `Sets` one or more measures or groupings which represent the sets. When it's value at row `i` results in a trueish value (e.g., 1, true, ...) UpSet.js will interpret it that the element at row `i` is part of this set
- `Attributes` zero or more numeric measures that are used to generate boxplots for each set intersection

In addition, the visual supports various styling options including the customization of how the set combinations are generated.

## Interaction

The UpSet.js visual reacts to selections from other widgets by highlighting the elements in its chart. Moreover, when the user **clicks** on an element in the chart, the corresponding set (combination) will be selected.

## Venn Diagram

In addition, there is a sibling extension for rendering Venn and Euler Diagrams:

![Venn Report](https://user-images.githubusercontent.com/4129778/85765896-d6417900-b716-11ea-8b89-8ae01f6456a0.png)

see also [Sample PBIX file](https://upset.js.org/integrations/powerbi/got_venn.pbix)
