import { forwardRef, Ref } from 'preact/compat'
import type { FnComp, FnCompRetType } from '../../interfaces'
import style from './background.module.scss'

/**
 * Props for `<Background>`
 */
interface IBackgroundProps {
  [key: string]: any
}

/**
 * The app's background
 *
 * @param {IBackgroundProps} props
 * @param {Ref<HTMLDivElement>} ref forwarded `Ref` to the background `div`
 * @returns the background `div`
 */
export const Background: FnComp<IBackgroundProps> = forwardRef(
  (props: IBackgroundProps, ref?: Ref<HTMLDivElement>): FnCompRetType => {
    return (
      <div class={style.bgContainer} ref={ref} {...props}>
        {/* The beautiful wave SVG 😍 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 700"
          class={style.bgImg}
        >
          <path d="M1440 0v350c-23.644 23.066-47.288 46.132-73 75-25.712 28.868-53.49 63.538-79 19-25.51-44.538-48.748-168.285-72-208-23.252-39.715-46.516 4.602-70 36s-47.19 49.879-67 43c-19.81-6.879-35.728-39.116-60-3s-56.9 140.585-84 151c-27.1 10.415-48.671-73.226-69-102s-39.415-2.683-64 39-54.67 98.958-82 68-51.907-150.15-79-169c-27.093-18.85-56.703 62.644-76 75-19.297 12.356-28.28-44.425-52-38-23.72 6.425-62.173 76.056-85 108-22.827 31.944-30.026 26.203-54 17s-64.722-21.866-94-72c-29.278-50.134-47.085-137.737-70-164-22.915-26.263-50.939 8.814-77 57S82.84 391.482 61 405c-21.84 13.518-41.42-20.74-61-55V0z" />
        </svg>
      </div>
    )
  }
)
