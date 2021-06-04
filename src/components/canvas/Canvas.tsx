import type { ComponentChildren } from 'preact'
import { render } from 'preact'
import { useLayoutEffect, useRef } from 'preact/hooks'
import { useCanvasRenderer, useSVGDocument, useSVGImage } from '../../hooks'
import type { FnComp, FnCompRetType } from '../../interfaces'

/**
 * Props for `<Canvas>`
 */
interface ICanvasProps {
  [key: string]: any

  /**
   * `height` of the `<canvas>`
   */
  height: string

  /**
   * `width` of the `<canvas>`
   */
  width: string

  /**
   * Runs after the image has finished drawing
   */
  postDraw?: (context: CanvasRenderingContext2D) => void

  /**
   * Children
   */
  children: ComponentChildren
}

/**
 * Renders the children onto a `<canvas>` as an image
 *
 * @param {ICanvasProps} props
 * @returns {VNode} the `<canvas>` element with the rendered image
 */
export const Canvas: FnComp<ICanvasProps> = (
  props: ICanvasProps
): FnCompRetType => {
  // destructure the props
  const { height, width, postDraw } = props

  // create refs for `<canvas>` and `<image>`
  const canvasRef = useRef<HTMLCanvasElement>(undefined)
  const imageRef = useRef<HTMLImageElement>(new Image())

  // create a new svg document
  const svgDocument = useSVGDocument({
    height,
    width
  })

  // no dependencies because we don't want to run this more than once
  useLayoutEffect(() => {
    // set the `height` and `width` of the `<canvas>`
    canvasRef.current.setAttribute('height', height)
    canvasRef.current.setAttribute('width', width)
  }, [])

  // run the callback when either `canvasRef` or `imageRef` changes
  useLayoutEffect(() => {
    // select the `<div>` with class `html-root` in the svg document
    const divHtmlRoot = svgDocument.querySelector('.html-root')

    // if the `<div>` is found...
    if (divHtmlRoot) {
      // ...then render the children in the selected `<div>`
      render(<>{props.children}</>, divHtmlRoot)
    }

    // create the data url for the svg image
    const imgDataUrl = useSVGImage({
      document: svgDocument
    })

    // set the `<image>`'s `src` to the data url of the svg image
    imageRef.current.src = imgDataUrl
  }, [canvasRef, imageRef])

  // render the `<image>` on the `<canvas>`
  useCanvasRenderer({
    canvasRef,
    imageRef,
    postDrawCb: postDraw
  })

  // forward the rest of the props
  return <canvas {...props} ref={canvasRef} />
}
