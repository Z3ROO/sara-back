import defaultMiddlewares from './middlewares/defaultMiddlewares';
import NotesAPIRoutes from './routes/NotesAPIRoutes';
import FlashcardsAPIRoutes from './routes/FlashcardsAPIRoutes';
import StatsAPIRoutes from './routes/LevelingAPIRoutes';

export default [
  ...defaultMiddlewares,
  ...NotesAPIRoutes,
  ...FlashcardsAPIRoutes,
  ...StatsAPIRoutes
]