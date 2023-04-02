import { readFileSync } from 'fs'
import { join, resolve } from 'path'

/**
 * Trim target object fields (in place)
 * @param {string[]} fields fields to trim
 * @param {Object[]} obj target object
 * @returns {object} target object with trimmed values
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

/**
 * Parse package.json and get the semver of the project
 * @description warning: sync method, blocks the event loop
 * @returns {string} server version
 */
export function getServerVersion() {
  const { version } = JSON.parse(readFileSync(join(resolve(), 'package.json')))
  return version
}
