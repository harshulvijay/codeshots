/**
 * Props for `useSVGImage` hook
 */
interface ISVGImageProps {
  /**
   * The XML document to use while generating the data url for the image
   */
  document: XMLDocument
}

/**
 * Creates a data url for the given SVG markup
 *
 * @param {ISVGImageProps} props
 * @returns {string} the generated data url
 */
export const useSVGImage = (props: ISVGImageProps): string => {
  // create a new `XMLSerializer`
  const serializer = new XMLSerializer()

  // serialize the xml document passed as a prop to a string
  const svgString = serializer.serializeToString(props.document)
  // encode the string to base64
  const svgStringBase64 = btoa(svgString)

  // create a data url for the image
  const imgUrl = `data:image/svg+xml;charset=utf-8;base64,${svgStringBase64}`

  return imgUrl
}
