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

function arcSliceCircle(sets, arcs, tx, s = [], l = [], mode = '', ref = []) {
  return {
    sets,
    ...p(arcs[0], '1'),
    arcs: [
      ...arcs.slice(1).map((a, i) => ({
        mode: mode[i] === 'o' ? 'o' : 'i',
        ref: ref[i] || 0,
        ...p(a, 2),
        sweep: s[i] === true,
        large: l[i] === true,
      })),
      {
        mode: mode[arcs.length - 1] === 'o' ? 'o' : 'i',
        ref: ref[arcs.length - 1] || 0,
        ...p(arcs[0], 2),
        sweep: s[arcs.length - 1] === true,
        large: l[arcs.length - 1] === true,
      },
    ],
    text: p(tx),
  };
}

function arcSliceEllipse(sets, arcs, tx, refs, s = [false, false, false], l = [false, false, false]) {
  arcs = Array.isArray(arcs) ? arcs : arcs.split(',').map((d) => d.trim());
  return {
    sets,
    ...p(arcs[0], '1'),
    arcs: [
      ...arcs.slice(1).map((a, i) => ({
        ref: refs[i],
        mode: sets.includes(refs[i]) ? 'i' : 'o',
        ...p(a, 2),
        sweep: s[i],
        large: l[i],
      })),
      {
        ref: Math.floor(refs[arcs.length - 1]),
        mode: sets.includes(refs[arcs.length - 1]) ? 'i' : 'o',
        ...p(arcs[0], 2),
        sweep: s[arcs.length - 1],
        large: l[arcs.length - 1],
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
    width: 800,
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
