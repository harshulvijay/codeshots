import type { RefObject } from 'preact'
import type { Reducer } from 'preact/hooks'
import { useEffect, useLayoutEffect, useReducer, useRef } from 'preact/hooks'
import { cacheTheme, themeInCache } from '../utils/themesCache'
import { useThemeCache } from './useThemeCache'

/**
 * Props for the `useTheme` hook
 */
interface IThemeProps<T> {
  /**
   * The directory where the theme's JSON definition is present
   */
  dir: string

  /**
   * Functions that run after a specific action has completed
   */
  events?: Partial<{
    /**
     * In case of an error
     *
     * @param {Error} error the error that occurred
     */
    error: (error: Error) => void

    /**
     * Runs before the theme starts loading
     */
    loadStart: () => void

    /**
     * Runs after the theme has finished loading
     */
    loadEnd: () => void
  }>

  /**
   * Returns the initial state
   *
   * @param {IThemeState<T>} arg second argument passed to `useReducer`
   * @returns {IThemeState<T>} the initial state
   */
  getInitialState?: (arg: IThemeState<T>) => IThemeState<T>

  /**
   * Inital argument passed to `getInitialState`
   */
  initialState: IThemeState<T>

  /**
   * Returns a new state based on `prevState` and `action`
   */
  reducer: Reducer<IThemeState<T>, IThemeAction<T>>
}

/**
 * Type of the `action` param passed to the reducer function
 */
export interface IThemeAction<T> {
  /**
   * The operation to perform
   */
  op: 'replace' | 'update'

  /**
   * The data to use
   */
  payload: Partial<IThemeState<T>>
}

/**
 * Theme state
 */
export interface IThemeState<T> {
  /**
   * Properties that don't rely on the network to determine
   */
  meta: {
    /**
     * Name of the current theme
     */
    name: string
  }

  /**
   * Current theme's definiton
   */
  data: T | Record<string, any>
}

/**
 * Return type of the `useTheme` hook
 */
type IThemeReturnType<T> = [IThemeState<T>, (action: IThemeAction<T>) => void]

/**
 * Type of the callbacks param for `fetchTheme` in `useTheme`
 */
type IFetchThemeCallbacks<T> = Partial<{
  error: (error: Error) => void
  preFetch: () => void
  postFetch: (themeObject: T) => void
}>

/**
 * Loads and returns a theme state and a dispatch function to update the state
 * from the network/internal cache
 *
 * @param {IThemeProps<T>} props required properties
 * @returns {IThemeReturnType<T>} `state` object and `dispatch` function
 */
export const useTheme = <T extends object>(
  props: IThemeProps<T>
): IThemeReturnType<T> => {
  // get `state` and `dispatch` from `useReducer`
  const [state, dispatch] = useReducer<
    IThemeState<T>,
    IThemeAction<T>,
    IThemeState<T>
  >(
    props.reducer,
    props.initialState,
    // if `props.getInitialState` isn't defined, simply return the state param
    // passed to the function that determines the inital state
    props.getInitialState ?? (state => state)
  )

  // stores previous state so that we can fall back to it in case an error
  // occurs
  const prevStateFallbackRef = useRef<IThemeState<T>>(state)

  // themes cache
  const themesCacheRef: RefObject<Record<string, T | any>> = useThemeCache<T>()

  // fetch the theme from network/cache when `state.meta.name` changes
  useLayoutEffect(() => {
    /**
     * Fetches the theme (`state.meta.name`)
     *
     * @param {IFetchThemeCallbacks} cb the callback functions
     */
    const fetchTheme = async (cb?: IFetchThemeCallbacks<T>) => {
      try {
        // fetch the theme from `themesCacheRef`
        // use `{}` if `themesCacheRef` isn't defined
        const cachedTheme: T = themesCacheRef.current
          ? await themesCacheRef.current[state.meta.name]
          : {}
        // determine if we have to fetch the theme using an XHR request
        const fetchThemeFromNetwork =
          cachedTheme && JSON.stringify(cachedTheme) !== `{}` ? false : true

        if (fetchThemeFromNetwork) {
          // we have to fetch it from the network

          // run the `preFetch` callback function
          cb?.preFetch?.bind(undefined).call(undefined)

          // fetch the theme
          const theme = await fetch(
            `/themes/${props.dir}/${state.meta.name}.json`
          )
          const themeObject = await theme.json()

          // update `state`
          dispatch({
            op: 'update',
            payload: { data: themeObject }
          })

          // run the `postFetch` callback function
          cb?.postFetch?.bind(undefined).call(undefined, themeObject)
        } else {
          // the theme is already in cache

          // run the `preFetch` callback function
          cb?.preFetch?.bind(undefined).call(undefined)

          // update `state` with data from the cache
          dispatch({
            op: 'update',
            payload: { data: cachedTheme }
          })

          // run the `postFetch` callback function
          cb?.postFetch?.bind(undefined).call(undefined, cachedTheme)
        }
      } catch (e) {
        // oops... error encountered

        // run the `error` callback function
        cb?.error?.bind(undefined).call(undefined, e as Error)

        // also log the error to the console
        console.error(e)
      }
    }

    // call `fetchTheme`
    fetchTheme({
      error: error => {
        // oops... error encountered

        // fall back to the previous, non-erroneous state
        dispatch({
          op: 'replace',
          payload: prevStateFallbackRef.current
        })

        // run the `error` event callback function
        props.events?.error?.call(undefined, error)
      },
      postFetch: async themeObject => {
        // update the fallback state
        prevStateFallbackRef.current = { ...state }

        // if `state.data` isn't empty...
        if (Object.keys(state.data).length > 0) {
          // ... get a reference to `themesCacheRef.current`
          const themesCacheCurrentValue = await themesCacheRef.current

          // if `themesCacheRef.current` isn't empty...
          if (themesCacheCurrentValue) {
            // ... set the `state.meta.name` property on
            // `themesCacheRef.current` with the value of `themeObject`
            themesCacheCurrentValue[state.meta.name] = {
              ...themeObject
            }
          }
        }

        // run the `loadEnd` event callback function
        props.events?.loadEnd?.call(undefined)
      },
      preFetch: () => {
        // run the `loadStart` event callback function
        props.events?.loadStart?.call(undefined)
      }
    })
  }, [state.meta.name])

  // update the theme cache in indexeddb when `state.data` changes
  useEffect(() => {
    // check if theme is in cache
    themeInCache(`${props.dir}/${state.meta.name}`).then(value => {
      // if it isn't, then cache it
      !value &&
        JSON.stringify(state.data) !== `{}` &&
        cacheTheme<T>(props.dir, state.meta.name, state.data as T)
    })
  }, [state.data])

  return [state, dispatch]
}
