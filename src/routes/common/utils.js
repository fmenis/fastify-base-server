/**
 * Trim target object fields (in place)
 * @param {string[]} fields fields to trim
 * @param {Object[]} obj target object
 * @returns target object
 */
export function trimObjectFields(fields, obj) {
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (value && fields.includes(key)) {
      if (Array.isArray(value)) {
        obj[key] = value.map(item => item.trim())
      } else {
        obj[key] = obj[key].trim()
      }
    }
  }
  return obj
}
