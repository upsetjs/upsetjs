---
title: R/RMarkdown/RShiny
---

[![CRAN][cran-image]][cran-url] [![Open in Binder][binder]][binder-r-url] [![open docs][docs]][docs-r-url] [![open example][example]][example-r-url]

A R wrapper using [HTMLWidgets](https://www.htmlwidgets.org/) is located at [upset_r](https://github.com/upsetjs/upsetjs_r). The API follows the building pattern using the chaining operator `%>%`.
In contrast to the original UpsetR implementation it focusses on the UpSet plot itself only. However it supports interactivity either using custom Shiny events or HTMLWidgets Crosstalk. See also Shiny examples.

```R
# CRAN version
install.packages('upsetjs')
# or
devtools::install_url("https://github.com/upsetjs/upsetjs_r/releases/latest/download/upsetjs.tar.gz")
library(upsetjs)
```

```R
listInput <- list(one = c(1, 2, 3, 5, 7, 8, 11, 12, 13), two = c(1, 2, 4, 5, 10), three = c(1, 5, 6, 7, 8, 9, 10, 12, 13))
upsetjs() %>% fromList(listInput) %>% interactiveChart()
```

![List Input Example](https://user-images.githubusercontent.com/4129778/79375541-10dda700-7f59-11ea-933a-a3ffbca1bfd2.png)

see also [Basic.Rmd](https://github.com/upsetjs/upsetjs_r/main/vignettes/basic.Rmd)

[example]: https://img.shields.io/badge/Example-open-red
[example-r-url]: https://upset.js.org/integrations/r/articles/basic
[cran-image]: https://img.shields.io/cran/v/upsetjs
[cran-url]: https://www.rdocumentation.org/packages/upsetjs
[docs]: https://img.shields.io/badge/API-open-blue
[docs-r-url]: https://upset.js.org/integrations/r
[binder]: https://mybinder.org/badge_logo.svg
[binder-r-url]: https://mybinder.org/v2/gh/upsetjs/upsetjs_r/master?urlpath=rstudio
