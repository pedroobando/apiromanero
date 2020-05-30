export const enumTipo = {short: 's', long: 'l' }

export function _mdiaSemanaString(dSem, tipo) {
  const semanashort = ['Dom','Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  const semanalong = ['Domingo','Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  return tipo == 's' ? semanashort[dSem]: semanalong[dSem];
}

export function _mesString(mMes, tipo) {
  const messhort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
  const meslong = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return tipo == 's' ? messhort[mMes]: meslong[mMes];
}

export function _mdateObject(valueEnt)
{
  const _xstamps = new Date(valueEnt);
  const optionTime = {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true};
  return {
    date: _xstamps.toDateString(),
    mdate: `${_mdiaSemanaString(_xstamps.getDay(), enumTipo.short)}, ${_xstamps.getDate()} ${_mesString(_xstamps.getMonth(), enumTipo.short)}, ${_xstamps.getFullYear()}`,
    time: _xstamps.toLocaleTimeString('en-US',optionTime), // _xstamps.toTimeString()
    stamps: valueEnt
  }
}