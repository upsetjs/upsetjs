---
title: Jupyter Widget
---

[![Open in NBViewer][nbviewer]][nbviewer-url] [![Open in Binder][binder]][binder-j-url] [![Open API Docs][docs]][docs-j-url] [![Open Example][example]][example-j-url]

A Jupyter Widget wrapper is located at [upsetjs_jupyter_widget](https://github.com/upsetjs/upsetjs_jupyter_widget).

```bash
pip install upsetjs_jupyter_widget
jupyter labextension install @jupyter-widgets/jupyterlab-manager@3.0.0-alpha.0
```

```python
from upsetjs_jupyter_widget import UpSetJSWidget
```

```python
w = UpSetJSWidget[str]()
w.from_dict(dict(one = ['a', 'b', 'c', 'e', 'g', 'h', 'k', 'l', 'm'], two = ['a', 'b', 'd', 'e', 'j'], three = ['a', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm']))
w
```

![upset_from_dict](https://user-images.githubusercontent.com/4129778/79368564-e4715d00-7f4f-11ea-92f5-23ee89b5332f.png)

[nbviewer]: https://img.shields.io/badge/NBViewer-open-blue?logo=jupyter
[nbviewer-url]: https://nbviewer.jupyter.org/github/upsetjs/upsetjs_jupyter_widget/blob/master/examples/introduction.ipynb
[binder]: https://mybinder.org/badge_logo.svg
[binder-j-url]: https://mybinder.org/v2/gh/upsetjs/upsetjs_jupyter_widget/master?urlpath=lab/tree/examples/introduction.ipynb
[docs]: https://img.shields.io/badge/API-open-blue
[docs-j-url]: https://upset.js.org/api/jupyter
[example]: https://img.shields.io/badge/Example-open-red
[example-j-url]: https://upset.js.org/integrations/jupyter
