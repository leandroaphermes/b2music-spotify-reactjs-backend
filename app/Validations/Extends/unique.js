const { getValue, skippable } = use('indicative-utils')

const Database = use('Database')

const unique = {
  async: true,
  
  compile (args) {
    if (args.length !== 2) {
      throw new Error('Unique rule needs the table and column name') 
    }
    return args 
  },
  
  async validate (data, field, args, config) {
  
    const fieldValue = getValue(data, field)

    if (skippable(fieldValue, field, config)) {
      return true
    }

    const user = await Database
      .table(args[0])
      .where(args[1], fieldValue)
      .first()

    if (user) {
      return false
    }
    
    return true
  }

}

module.exports = unique