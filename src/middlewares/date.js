export const enumTipo = { short: 's', long: 'l' };

// eslint-disable-next-line no-underscore-dangle
export function _mdiaSemanaString(dSem, tipo) {
  const semanashort = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  const semanalong = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  return tipo === 's' ? semanashort[dSem] : semanalong[dSem];
}

// eslint-disable-next-line no-underscore-dangle
export function _mesString(mMes, tipo) {
  const messhort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
  const meslong = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  return tipo === 's' ? messhort[mMes] : meslong[mMes];
}

// eslint-disable-next-line no-underscore-dangle
export function _mdateObject(valueEnt) {
  const xstamps = new Date(valueEnt);
  const optionTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  return {
    date: xstamps.toDateString(),
    mdate: `${_mdiaSemanaString(xstamps.getDay(), enumTipo.short)}, ${xstamps.getDate()} ${_mesString(
      xstamps.getMonth(),
      enumTipo.short,
    )}, ${xstamps.getFullYear()}`,
    time: xstamps.toLocaleTimeString('en-US', optionTime),
    stamps: valueEnt,
  };
}
