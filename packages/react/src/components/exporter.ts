export async function exportSVG(node: SVGSVGElement, type: 'png' | 'svg' = 'png', title = 'UpSet') {
  const clone = node.cloneNode(true) as SVGSVGElement;
  clone.style.backgroundColor = 'white';

  const buttons = clone.querySelector('.exportButtons');
  if (buttons) {
    buttons.remove();
  }

  const b = new Blob([new XMLSerializer().serializeToString(clone)], {
    type: 'image/svg+xml;charset=utf-8',
  });

  const url = URL.createObjectURL(b);
  if (type === 'svg') {
    downloadUrl(url, `${title}.${type}`, node.ownerDocument!);
  } else {
    const purl = await toPNG(url, node);
    downloadUrl(purl, `${title}.${type}`, node.ownerDocument!);
  }
  URL.revokeObjectURL(url);
}

function toPNG(url: string, node: SVGGElement) {
  const canvas = node.ownerDocument!.createElement('canvas');
  const bb = node.getBoundingClientRect();
  canvas.width = bb.width;
  canvas.height = bb.height;
  const ctx = canvas.getContext('2d')!;
  const img = new Image(canvas.width, canvas.height);

  return new Promise<string>((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      resolve(png);
    };
    img.src = url;
  });
}

function downloadUrl(url: string, title: string, doc: Document) {
  const a = doc.createElement('a');
  a.href = url;
  a.style.position = 'absolute';
  a.style.left = '-10000px';
  a.style.top = '-10000px';
  a.download = title;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
