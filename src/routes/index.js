// Importing routes
import userRoutes from './user.route';
import conductorRoutes from './conductor.route';
import vehiculoRouter from './vehiculo.route';
import productoRouter from './producto.route';
import documentoRouter from './documento.route';

export default function index(app) {
  // routes apps
  // app.use('/login', loginRoutes);
  app.use('/api/vehiculos', vehiculoRouter);
  app.use('/api/productos', productoRouter);
  app.use('/api/documentos', documentoRouter);
  app.use('/api/conductores', conductorRoutes);
  app.use('/api/users', userRoutes);
}
