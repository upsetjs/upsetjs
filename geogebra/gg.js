function round3(v) {
  return Math.round(v * 1000) / 1000;
}

function p(v, suffix = '') {
  return {
    [`x${suffix}`]: round3(a.getXcoord(v)),
    [`y${suffix}`]: round3(-a.getYcoord(v)),
  };
}

function circle(v, tv, align) {
  return {
    cx: round3(a.getXcoord(v)),
    cy: round3(-a.getYcoord(v)),
    r: radius,
    text: p(tv),
    align,
  };
}

function arcSliceCircle(c1, c2, c3, tx, s = [false, false, false], l = [false, false, false]) {
  return {
    ...p(c1, '1'),
    arcs: [
      {
        rx: radius,
        ry: radius,
        rotation: 0,
        ...p(c2, 2),
        sweepFlag: s[0],
        largeArcFlag: l[0],
      },
      {
        rx: radius,
        ry: radius,
        rotation: 0,
        ...p(c3, 2),
        sweepFlag: s[1],
        largeArcFlag: l[1],
      },
      {
        rx: radius,
        ry: radius,
        rotation: 0,
        ...p(c1, 2),
        sweepFlag: s[2],
        largeArcFlag: l[2],
      },
    ],
    text: p(tx),
  };
}

function ggbOnInit() {
  run(a);
}

const ggbApp = new GGBApplet(
  {
    id: 'a',
    width: 1600,
    height: 900,
    showMenuBar: true,
    showAlgebraInput: true,
    showToolBar: false,
    showToolBarHelp: false,
    showResetIcon: false,
    enableLabelDrags: false,
    enableShiftDragZoom: true,
    enableRightClick: false,
    errorDialogsActive: false,
    useBrowserForJS: true,
    preventFocus: false,
    language: 'en',
  },
  true
);
window.addEventListener('load', function () {
  ggbApp.inject('ggb-element');
});
