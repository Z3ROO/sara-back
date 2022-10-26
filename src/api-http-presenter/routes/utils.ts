export function checkForMissingProperties(object:any) {
  Object.keys(object).forEach(key => {
    if (object[key] === undefined) {
      throw new Error('Properties missing: '+key);
    }
    
    if (object[key].constructor.name === 'Object')
      checkForMissingProperties(object[key])
  })
}