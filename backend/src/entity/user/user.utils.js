function validateHeaderFormat(header) {
  return !!(
    header &&
    header.Authorization &&
    header.Authorization.length &&
    header.Authorization[0] &&
    header.Authorization[0].split
  )
}

function enrichBody(event, userFound) {
  const { body } = event
  const method = event.httpMethod

  if (body) {
    if (method === 'POST') {
      body.createdBy = String(userFound._id)
    }

    if (method === 'DELETE') {
      body.deletedBy = String(userFound._id)
    }

    body.lastUpdatedBy = String(userFound._id)
  }
  event.user = userFound.toObject()
  event.body = body
}

module.exports = {
  validateHeaderFormat,
  enrichBody
}
