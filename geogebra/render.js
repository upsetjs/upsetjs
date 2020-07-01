function path(s, refs) {
  if (s.path) {
    return s.path;
  }
  return `M ${s.x1},${s.y1} ${s.arcs
    .map(
      (arc) =>
        `A ${refs[arc.ref].rx || refs[arc.ref].r} ${refs[arc.ref].ry || refs[arc.ref].r} ${
          refs[arc.ref].rotation || 0
        } ${arc.large ? 1 : 0} ${arc.sweep ? 1 : 0} ${arc.x2} ${arc.y2}`
    )
    .join(' ')}`;
}

function render(circles, intersections, bb) {
  const hue = 360 / intersections.length;
  return `
<svg width="300" height="300" viewBox="0 0 300 300">
  <g transform="translate(150,150)scale(10,10)">
    <rect x="${bb.x}" y="${bb.y}" width="${bb.width}" height="${bb.height}" fill="none" stroke="black"></rect>

    ${circles
      .map(
        (c) =>
          `<ellipse rx="${c.rx || c.r}" ry="${c.ry || c.r}" stroke="green" fill="none" transform="translate(${c.cx},${
            c.cy
          })rotate(${c.rotation || 0})"  style="vector-effect: non-scaling-stroke"></ellipse>`
      )
      .join('')}
    ${intersections.map((i, j) => `<path d="${path(i, circles)}" fill="hsl(${j * hue},100%,50%)"></path>`).join('')}
  </g>
  <g transform="translate(150,150)">
    ${circles
      .map(
        (c, i) =>
          `<text x="${c.text.x * 10}" y="${c.text.y * 10}" text-anchor="${c.align}" ${
            c.verticalAlign === 'top' ? 'dominant-baseline="hanging"' : ''
          }>${i}</text>`
      )
      .join('')}
    ${intersections
      .map(
        (c, i) =>
          `<text x="${c.text.x * 10}" y="${c.text.y * 10}" text-anchor="middle" dominant-baseline="central">${
            c.sets
          }</text>`
      )
      .join('')}
  </g>
</svg>`;
}

function dump(circles, intersections, bb) {
  console.log(
    JSON.stringify({
      sets: circles,
      intersections,
      bb,
    })
  );

  document.body.insertAdjacentHTML('beforeend', render(circles, intersections, bb));
  document.body.insertAdjacentHTML(
    'beforeend',
    `<textarea>${JSON.stringify({
      sets: circles,
      intersections,
      bb,
    })}</textarea>`
  );
}
