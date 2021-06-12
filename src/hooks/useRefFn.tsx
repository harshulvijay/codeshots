import type { RefObject } from 'preact'
import { useRef } from 'preact/hooks'

/**
 * Initial value passed to `useRef` in `useRefFn`
 *
 * Extracted out to be able to use for comparison using the `===` operator
 */
const refInitialValue = {}

/**
 * Runs a function lazily and retuns a `Ref`, where `current` has the value of
 * the value returned by the function
 *
 * (from https://github.com/facebook/react/issues/14490#issuecomment-451924162)
 *
 * @param {() => T} init function that returns the value for `ref.current`
 * @returns {Ref<T>} the lazily initiated `Ref`
 */
export const useRefFn = <T extends {}>(init: () => T): RefObject<T> => {
  const ref = useRef<T>(refInitialValue as T)

  // compare `ref.current` with the initial value passed to `useRef`
  // (since it's an object, the references to the empty object need to be same)
  if (ref.current === refInitialValue) {
    // they're equal
    // run `init`
    ref.current = init()
  }

  return ref
}
