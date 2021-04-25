import { PointIcon } from './PointIcons';

const serializer = new XMLSerializer();

export class IconProcessor {
  /**
   * Create an image element with specified characteristics.
   *
   * Here we could use URL.createObjectURL() instead of base64 data uri, but it is not a great optimization and
   * it does not render well with openlayers when changing icon.
   *
   * @param icon
   * @param size
   * @param color
   */
  public static prepare(icon: PointIcon, size: number, color: string): HTMLImageElement {
    const { svg } = mountSvg(icon.contentSvg);

    // We set size. Viewbox attribute is set in icons (see tests).
    svg.setAttribute('width', `${size}`);
    svg.setAttribute('height', `${size}`);

    // We set colors
    const children = svg.getElementsByTagName('*');
    for (let i = 0; i < children.length; i++) {
      const child = children.item(i);
      if (!child || !(child instanceof SVGElement)) {
        continue;
      }

      if (child.style.fill && child.style.fill !== 'none') {
        child.style.fill = color;
      }
      if (child.style.color && child.style.color !== 'none') {
        child.style.color = color;
      }
    }

    // We MUST use XML serializer here, otherwise SVG will not render
    const serialized = btoa(serializer.serializeToString(svg));

    const image = document.createElement('img');
    image.src = `data:image/svg+xml;base64,${serialized}`;
    image.width = size;
    image.height = size;

    return image;
  }
}

export function mountSvg(svgContent: string): { support: HTMLDivElement; svg: SVGElement } {
  const support = document.createElement('div');
  support.innerHTML = svgContent;
  const svg = support.querySelector('svg') as SVGElement | undefined;
  if (!svg) {
    throw new Error('Invalid svg icon');
  }
  return { support, svg };
}
