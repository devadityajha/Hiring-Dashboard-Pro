import Fuse from "fuse.js";
import { useMemo } from "react";

/**
 * Generic Fuse.js hook.
 * @param {Array}  data     – source array
 * @param {Array}  keys     – Fuse key definitions  e.g. ["name", { name:"content", weight:1 }]
 * @param {string} query    – search string
 * @param {Object} options  – optional Fuse overrides
 */
export function useFuseSearch(data, keys, query, options = {}) {
  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys,
        threshold: 0.35,
        includeScore: true,
        ...options,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  return useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query]);
}
