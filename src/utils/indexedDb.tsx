import type { UseStore } from 'idb-keyval'
import { del, get, keys, set } from 'idb-keyval'

/**
 * Sets `key` as `object` in `store`
 *
 * @param {string} key the key to store `object` as
 * @param {T} object the object to store
 * @param {UseStore} store the IndexedDB Store
 */
export const insert = async <T,>(
  key: string,
  object: T,
  store: UseStore
): Promise<void> => await set(key, object, store)

/**
 * Returns the keys present in `store`
 *
 * @param {UseStore} store the IndexedDB Store
 * @returns {Promise<IDBArrayKey>} the keys
 */
export const getStoreKeys = async (store: UseStore): Promise<IDBArrayKey> =>
  keys(store)

/**
 * Returns the value stored at `key` in `store`
 *
 * @param {string} key the key to read from `store`
 * @param {UseStore} store the IndexedDB Store
 * @returns {Promise<T | undefined>} the value stored at `key`
 */
export const readKeyFromStore = async <T,>(
  key: string,
  store: UseStore
): Promise<T | undefined> => (store ? get(key, store) : undefined)

/**
 * Removes `key` from `store`
 *
 * @param {string} key the key to remove from `store`
 * @param {UseStore} store the IndexedDB Store
 */
export const removeKeyFromStore = async (
  key: string,
  store: UseStore
): Promise<void> => del(key, store)
