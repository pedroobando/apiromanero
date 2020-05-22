// Importing routes
import conductorRoutes from './conductor.route';
import userRoutes from './user.route';

export default function (app) {
  // routes apps
  // app.use('/login', loginRoutes);
  app.use('/api/conductores', conductorRoutes);
  app.use('/api/users', userRoutes);
}
