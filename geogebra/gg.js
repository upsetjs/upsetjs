function round3(v) {
  return Math.round(v * 1000) / 1000;
}

function p(v, suffix = '') {
  return {
    [`x${suffix}`]: round3(a.getXcoord(v)),
    [`y${suffix}`]: round3(-a.getYcoord(v)),
  };
}

function circle(v, tv, align, verticalAlign) {
  return {
    cx: round3(a.getXcoord(v)),
    cy: round3(-a.getYcoord(v)),
    r: radius,
    text: p(tv),
    align,
    verticalAlign,
  };
}
function ellipse(rotation, v, tv, align, verticalAlign) {
  return {
    cx: round3(a.getXcoord(v)),
    cy: round3(-a.getYcoord(v)),
    rx: xRadius,
    ry: yRadius,
    rotation,
    text: p(tv),
    align,
    verticalAlign,
  };
}

function arcSliceCircle(arcs, tx, s = [false, false, false], l = [false, false, false]) {
  return {
    ...p(arcs[0], '1'),
    arcs: [
      ...arcs.slice(1).map((a, i) => ({
        rx: radius,
        ry: radius,
        rotation: 0,
        ...p(a, 2),
        sweepFlag: s[i],
        largeArcFlag: l[i],
      })),
      {
        rx: radius,
        ry: radius,
        rotation: 0,
        ...p(arcs[0], 2),
        sweepFlag: s[arcs.length - 1],
        largeArcFlag: l[arcs.length - 1],
      },
    ],
    text: p(tx),
  };
}

function arcSliceEllipse(arcs, tx, rotations, s = [false, false, false], l = [false, false, false]) {
  return {
    ...p(arcs[0], '1'),
    arcs: [
      ...arcs.slice(1).map((a, i) => ({
        rx: xRadius,
        ry: yRadius,
        rotation: rotations[i],
        ...p(a, 2),
        sweepFlag: s[i],
        largeArcFlag: l[i],
      })),
      {
        rx: xRadius,
        ry: yRadius,
        rotation: rotations[arcs.length - 1],
        ...p(arcs[0], 2),
        sweepFlag: s[arcs.length - 1],
        largeArcFlag: l[arcs.length - 1],
      },
    ],
    text: p(tx),
  };
}

function ggbOnInit(m) {
  try {
    run(a);
  } catch (e) {
    console.error(e);
  }
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
