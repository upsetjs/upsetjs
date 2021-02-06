---
title: Tableau
---

## Installation

1. Download the extension description file at [upsetjs.trex](https://upset.js.org/integrations/tableau/upsetjs.trex)
1. Create a new dashboard and show at least one sheet in the dashboard
1. Follow [https://tableau.github.io/extensions-api/docs/trex_overview.html](https://tableau.github.io/extensions-api/docs/trex_overview.html) and choose the downloaded file
1. Use the `configure` button or the `configure` menu entry to specify the input data

**Notes**

Due to the restrictions of the dashboard extension system, you need to have at least one sheet in the dashboard that is showing the target data. For example, as in the Game of Thrones dataset one a bar chart showing the number of words spoken per character. The extension is then linked to this sheet and will get its data and selection from it. Similarly, the extension will set the selection in this sheet which then can propagate it to other sheets using dashboard actions.

## Example

see https://github.com/upsetjs/upsetjs_tableau_extension/examples/got.twb
