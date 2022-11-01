import defaultMiddlewares from './middlewares/defaultMiddlewares';
import NotesAPIRoutes from './routes/NotesAPIRoutes';
import FlashcardsAPIRoutes from './routes/FlashcardsAPIRoutes';
import StatsAPIRoutes from './routes/LevelingAPIRoutes';
import FeatsAPIRoutes from './routes/FeatsAPIRoutes';
import RecordsAPIRoutes from './routes/RecordsAPIRoutes';
import QuestsAPIRoutes from './routes/QuestsAPIRoutes';

export default [
  ...defaultMiddlewares,
  ...NotesAPIRoutes,
  ...FlashcardsAPIRoutes,
  ...QuestsAPIRoutes,
  ...FeatsAPIRoutes,
  ...RecordsAPIRoutes,
  ...StatsAPIRoutes
]