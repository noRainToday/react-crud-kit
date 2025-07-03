// Type checking utility functions

/**
 * Check if value is undefined
 */
export const isUndefined = (val: unknown): val is undefined =>
  val === undefined;

/**
 * Check if value is null
 */
export const isNull = (val: unknown): val is null => val === null;

/**
 * Check if value is a number
 */
export const isNumber = (val: unknown): val is number =>
  typeof val === "number";

/**
 * Check if value is a string
 */
export const isString = (val: unknown): val is string =>
  typeof val === "string";

/**
 * Check if value is a boolean
 */
export const isBoolean = (val: unknown): val is boolean =>
  typeof val === "boolean";

/**
 * Check if value is an object
 */

export function isObject(val: unknown): val is Record<string, any> {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

/**
 * Check if value is an array
 */
export const isArray = Array.isArray;

/**
 * Check if value is a date
 */
export const isDate = (val: unknown): val is Date => val instanceof Date;

/**
 * Check if value is empty (null, undefined, empty string, empty array or empty object)
 */
export const isEmpty = (val: unknown): boolean => {
  if (isNull(val) || isUndefined(val)) return true;
  if (isString(val) || isArray(val)) return val.length === 0;
  if (isObject(val)) return Object.keys(val).length === 0;
  return false;
};
