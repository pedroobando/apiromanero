
export function _merrorMessage(errParam) {
  let errMessage = {};
  let errValue = 'ss'; // errParam.errors[0].value == null ? '': errParam.errors[0].value;
  if (errParam.name == 'SequelizeValidationError') {
    errMessage = {msg: `El ${errParam.errors[0].path} ${errValue} no es valido, por favor verifique.`}
  }
  if (errParam.name == 'SequelizeUniqueConstraintError') {
    errMessage = {msg: `El ${errParam.errors[0].path} ${errValue} ya esta registrado, por favor ingrese otro.`}
  }
  if (errParam.name == 'MongoError' && errParam.code == 11000 ) {
    errMessage = {msg: `Duplicidad en datos ${errParam.keyValue.login}, por favor verificar.`}
    // errMessage = {msg: errParam}
  }  
  return errMessage;  
}