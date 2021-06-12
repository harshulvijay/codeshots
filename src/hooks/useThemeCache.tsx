import type { RefObject } from 'preact'
import { getStoreKeys } from '../utils/indexedDb'
import { getThemeFromCache, themesCacheStore } from '../utils/themesCache'
import { useRefFn } from './useRefFn'

/**
 * Fetches cached themes and returns them as a `RefObject`
 *
 * @returns {RefObject<Record<string, T | any>>} cache
 */
export const useThemeCache = <T,>(): RefObject<Record<string, T | any>> =>
  useRefFn<Record<string, T | any>>(() => {
    const fn = async () => {
      // get the keys from the cache store
      const themesCacheKeys = await getStoreKeys(themesCacheStore)
      // an object that stores the cached themes
      const cachedThemes: Record<string, T> = {}

      // if there are cached themes...
      if (themesCacheKeys.length > 0) {
        // ... then create an object with their definitions and return it

        for (const key of themesCacheKeys) {
          // convert the key to string
          const keyString = key.toString()
          // get just the theme's name
          const keyWithoutDir: string = keyString.split('/').slice(-1)[0]

          // get the theme from the cache
          const cachedTheme: T | undefined = await getThemeFromCache<T>(
            keyString
          )

          // store the cached theme in the `cachedThemes` object
          if (cachedTheme) cachedThemes[keyWithoutDir] = cachedTheme
        }
      }

      return cachedThemes
    }

    return fn()
  })
