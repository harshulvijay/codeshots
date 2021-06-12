import type { UseStore } from 'idb-keyval'
import { createStore } from 'idb-keyval'
import {
  getStoreKeys,
  insert,
  readKeyFromStore,
  removeKeyFromStore
} from './indexedDb'

/**
 * IndexedDB Store for caching themes
 */
export const themesCacheStore: UseStore = createStore(
  `app-db`,
  `themes-cache-store`
)

/**
 * Checks if `theme` has already been cached or not
 *
 * @param {string} key the key to test
 * @returns {Promise<boolean>} `true` if theme is present in the cache;
 * `false` otherwise
 */
export const themeInCache = async (key: string): Promise<boolean> => {
  // read `key` from the cache
  const result = await readKeyFromStore<boolean>(key, themesCacheStore)

  return !!result
}

/**
 * Caches a theme
 *
 * @param {string} dir subdirectory under which the theme's definition file
 * is present
 * @param {string} theme theme's name
 * @param {T} themeObject theme's definiton
 * @returns {Promise<string>} IndexedDB key of the cached theme
 */
export const cacheTheme = async <T,>(
  dir: string,
  theme: string,
  themeObject: T
): Promise<string> => {
  // generate the key
  const key = `${dir}/${theme}`

  // insert
  await insert<T>(key, themeObject, themesCacheStore)

  return key
}

/**
 * Gets a theme from the cache
 *
 * @param {string} key the key of the theme to read
 * @returns {Promise<T | undefined>} theme's definition
 */
export const getThemeFromCache = async <T,>(
  key: string
): Promise<T | undefined> => {
  // read the theme from the cache
  const theme: Promise<T | undefined> = readKeyFromStore<T>(
    key,
    themesCacheStore
  )

  return theme
}

/**
 * Clears the theme cache
 */
export const clearThemesCache = async (): Promise<void> => {
  // get all the keys from the cache store
  const themesList = await getStoreKeys(themesCacheStore)

  // iterate and remove each key from the cache store
  for (const theme in themesList)
    await removeKeyFromStore(theme, themesCacheStore)
}
