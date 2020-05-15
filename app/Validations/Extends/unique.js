const unique = {
  async: true,
  
  compile (args) {
    if (args.length !== 2) {
      throw new Error('Unique rule needs the table and column name') 
    }


    console.log("Validation Extend: ", args);
    

    return args 
  },
  
  async validate (data, field, args, config) {
  }
}

module.exports = {
  unique
}