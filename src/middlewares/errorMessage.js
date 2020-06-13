// eslint-disable-next-line no-underscore-dangle
export default function merrorMessage(errParam) {
  let errMessage = '';
  if (errParam.name === 'MongoError' && errParam.code === 11000) {
    errMessage = `Duplicidad en datos ${errParam.keyValue.login}`;
  }
  return errMessage;
}
