/**
 * Build paginated info
 * @param {number} totalCount total items
 * @param {Object} options pagination options
 * @param {Object} options.limit limit
 * @param {Object} options.offset limit
 * @returns {Object} paginatedInfo
 */
export function buildPaginatedInfo(totalCount, options) {
  const { limit, offset } = options

  // the 'count' method of massivejs returns a string...
  totalCount =
    typeof totalCount === 'string' ? parseInt(totalCount) : totalCount

  const pageCount = Math.ceil(totalCount / limit)
  const page = Math.ceil(offset / limit) + 1

  return {
    totalItems: totalCount,
    itemsPerPage: limit,
    pageCount,
    page,
    lastPage: page >= pageCount,
  }
}

/**
 * Build OpenAPI route description
 * @param {string} description route description
 * @param {Object[]} [errors] route possibile errors
 * @param {string} [permission] route permission
 * @param {string} [api] route error identifier
 * @param {string} [publicApi] defines if the route is public
 * @returns string
 */
export function buildRouteFullDescription(params) {
  const {
    description,
    errors = [],
    api,
    permission,
    publicApi = false,
  } = params

  let fullDescription = `${description} \n\n ${
    publicApi ? '_Public_' : '_Private_'
  } _API._ \n\n\ `
  const apiErrors = errors.filter(item => item.apis.includes(api))

  if (apiErrors.length > 0) {
    const formattedErrors = apiErrors
      .map(
        item => `- ${item.statusCode} - ${item.code}: ${item.description} \n\n`
      )
      .sort()

    fullDescription += ` **Custom errors**: \n\n ${formattedErrors.join(' ')}`
  } else {
    fullDescription += ` **This api doesn't expose custom errors.** \n\n`
  }

  if (permission) {
    fullDescription += `**Required permission**: *${permission}*.`
  } else {
    fullDescription += `**No permission required to consume the api**.`
  }

  return fullDescription
}
