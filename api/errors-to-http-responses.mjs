import { ERROR_CODES } from '../common/errors.mjs'

function HttpResponse(status, error) {
    this.status = status
    this.body = {
        code: error.code,
        error: error.description
    }
}

export default function(error) {
    switch(error.code) {
        case ERROR_CODES.INVALID_ARGUMENT: return new HttpResponse(400, error)
        case ERROR_CODES.NOT_FOUND: return new HttpResponse(404, error)
        case ERROR_CODES.USER_NOT_FOUND: return new HttpResponse(401, error)
        case ERROR_CODES.NOT_AUTHORIZED: return new HttpResponse(401, error)
        default: return new HttpResponse(500, "Internal server error.")
    }
}

