import type { Ref } from 'preact/hooks'
import { useLayoutEffect } from 'preact/hooks'

/**
 * Props for `useCanvasRenderer` hook
 */
interface ICanvasRendererProps {
  /**
   * Reference to the `<canvas>` to be drawn on
   */
  canvasRef: Ref<HTMLCanvasElement>

  /**
   * Reference to the `<image>` to be drawn
   */
  imageRef: Ref<HTMLImageElement>

  /**
   * Function callback that runs **after** the image has finished drawing
   *
   * You may use arrow functions if you don't care about the value of `this`
   *
   * @param {CanvasRenderingContext2D} context the `<canvas>`'s `context`
   */
  postDrawCb?: (context: CanvasRenderingContext2D) => void

  /**
   * Used as the value of `this` when calling `postDrawCb`
   */
  thisVal?: ThisParameterType<any>
}

/**
 * Renders an `<image>` on a `<canvas>`
 *
 * @param {ICanvasRendererProps} props
 */
export const useCanvasRenderer = (props: ICanvasRendererProps): void => {
  // run `useLayoutEffect`s cb if either `canvasRef` or `imageRef` changes
  useLayoutEffect(() => {
    // destructure all the props
    const { canvasRef, imageRef, postDrawCb, thisVal } = props

    // if `canvasRef.current` isn't `undefined`/`null`...
    if (canvasRef.current) {
      // ...then get the 2d rendering context from the `<canvas>`
      const context = canvasRef.current.getContext('2d')

      // if the `context` is not `undefined`/`null`...
      if (context) {
        // ...then render everything once the `<image>` has loaded
        imageRef.current.onload = () => {
          // clear the `<canvas>`
          const { height, width } = canvasRef.current
          context.clearRect(0, 0, width, height)

          // draw the image on the `<canvas>`
          context.drawImage(imageRef.current, 0, 0)

          // run the user-defined callback function
          postDrawCb && postDrawCb.call(thisVal, context)
        }
      }
    }
  }, [props.canvasRef, props.imageRef])
}
