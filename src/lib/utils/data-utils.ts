/**
 * Universal Search function - Inatafuta neno kwenye array ya objects yoyote kwa kina (recursive).
 * * @template T - Aina ya object iliyopo kwenye array.
 * @param {T[]} data - Array ya data unayotaka kutafutia.
 * @param {string} searchTerm - Neno unalotafuta.
 * @param {Set<any>} [seen=new Set()] - (Internal) Inazuia circular reference issues.
 * @returns {T[]} - Array ya matokeo yaliyochujwa.
 * * @example
 * const results = functionSearch(staffList, "john");
 */
export const functionSearch = <T>(
  data: T[],
  searchTerm: string,
  seen = new Set<any>()
): T[] => {
  if (!searchTerm || !Array.isArray(data)) return data;

  const lowerTerm = searchTerm.toLowerCase();

  return data.filter((item) => {
    /**
     * Helper ya ku-flatten object kwa usalama.
     * Inatumia Set kuzuia circular references (kama Object A ina link na Object B na B ina link na A).
     */
    const flattenObject = (obj: any): string => {
      if (obj === null || obj === undefined) return "";

      // Zuia circular reference
      if (typeof obj === 'object') {
        if (seen.has(obj)) return "";
        seen.add(obj);
      }

      let str = "";
      for (const key in obj) {
        const value = obj[key];

        if (typeof value === "object" && value !== null) {
          str += flattenObject(value) + " ";
        } else if (value !== null && value !== undefined) {
          str += String(value).toLowerCase() + " ";
        }
      }
      return str;
    };

    // Tunapoweka filter, tunafuta 'seen' kwa kila item mpya ili search iwe accurate
    const searchString = flattenObject(item);
    seen.clear();

    return searchString.includes(lowerTerm);
  });
};



type SortDirection = 'asc' | 'desc';

/**
 * Husaidia kuchimbua thamani kutoka kwenye object kwa kutumia path (mfano: "user.firstName").
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};


/**
* Universal Sort - Inapanga data yoyote kwa ufunguo wowote (hata ulio ndani).
* * @template T - Aina ya object.
* @param {T[]} data - Array ya data.
* @param {string} path - Field unayotaka kupangia (mfano: "user.lastName" au "joiningDate").
* @param {SortDirection} direction - 'asc' au 'desc'.
* * @example
* const sorted = universalSort(staffList, "user.firstName", "asc");
*/
export const universalSort = <T>(
  data: T[],
  path: string,
  direction: SortDirection = 'asc'
): T[] => {
  return [...data].sort((a, b) => {
    let valA = getNestedValue(a, path);
    let valB = getNestedValue(b, path);

    if (valA == null) return 1;
    if (valB == null) return -1;
    if (valA instanceof Date) valA = valA.getTime();
    if (valB instanceof Date) valB = valB.getTime();

    if (typeof valA === 'string' && typeof valB === 'string') {
      return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};