/**
 * Props for `useSVGDocument` hook
 */
interface ISVGDocumentProps {
  /**
   * `height` property of `<svg>` and `<foreignObject>` in the final SVG markup
   */
  height: string

  /**
   * `width` property of `<svg>` and `<foreignObject>` in the final SVG markup
   */
  width: string
}

/**
 * XML namespace urls
 */
interface IXMLNamespaces {
  /**
   * SVG namespace url
   */
  svg: string

  /**
   * XHTML namespace url
   */
  xhtml: string
}

/**
 * Elements present in the SVG document
 */
interface ISVGElements {
  /**
   * Document's root element
   */
  svg: Element

  /**
   * The `<foreignObject>` element needed in SVG to use/render content from a
   * different XML namespace
   */
  foreignObject: Element

  /**
   * A `<div>` element from the HTML namespace
   *
   * If the elements from HTML are the direct children of the `<foreignObject>`
   * element, then they will need to have a namespace assigned to all of them
   * separately. To prevent that, this `<div>` is used
   */
  div: Element
}

/**
 * Creates an SVG document
 *
 * @param {ISVGDocumentProps} props
 * @returns {XMLDocument} the generated SVG document
 */
export const useSVGDocument = (props: ISVGDocumentProps): XMLDocument => {
  // namespace urls stored in an object to make the code more readable, cleaner
  // and slightly easier to change the namespace urls if ever needed
  const xmlns: IXMLNamespaces = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml'
  }

  // xml document
  const svgDocument = document.implementation.createDocument(xmlns.svg, 'svg')

  // the elements of the svg document
  const elements: ISVGElements = {
    svg: svgDocument.querySelector('svg') as SVGSVGElement,
    foreignObject: svgDocument.createElementNS(xmlns.svg, 'foreignObject'),
    div: svgDocument.createElementNS(xmlns.xhtml, 'div')
  }

  // if `<svg>` is present in the document...
  if (elements.svg) {
    // ...then append the `<div>` to the `<foreignObject>`, and the
    // `<foreignObject>` to the `<svg>` element

    // set a class on the `<div>` to be able to find it by its class name
    elements.div.className = 'html-root'

    // set important attributes to make the image visible
    elements.foreignObject.setAttribute('height', props.height)
    elements.svg.setAttribute('height', props.height)
    elements.foreignObject.setAttribute('width', props.width)
    elements.svg.setAttribute('width', props.width)

    // append the `<div>` to the `<foreignObject>`
    elements.foreignObject.appendChild(elements.div)
    // append the `<foreignObject>` to the `<svg>` element
    elements.svg.appendChild(elements.foreignObject)
  } else {
    // ...else throw an error
    throw new Error(`error: couldn't find tag <svg> in generated XML document`)
  }

  return svgDocument
}
