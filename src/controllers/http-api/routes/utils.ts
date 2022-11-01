import { BadRequest } from "../../../util/errors/HttpStatusCode";

export function checkForMissingProperties(object:any) {
  Object.keys(object).forEach(key => {
    if (object[key] === undefined) {
      throw new BadRequest(`Property "${key}" is missing`);
    }
    
    if (object[key] && object[key].constructor.name === 'Object')
      checkForMissingProperties(object[key])
  })
}