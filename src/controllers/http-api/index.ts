import defaultMiddlewares from './middlewares/defaultMiddlewares';
import NotesAPIRoutes from './routes/NotesAPIRoutes';
import FlashcardsAPIRoutes from './routes/FlashcardsAPIRoutes';
import StatsAPIRoutes from './routes/LevelingAPIRoutes';
import FeatsAPIRoutes from './routes/leveling/FeatsAPIRoutes';
import RecordsAPIRoutes from './routes/leveling/RecordsAPIRoutes';
import QuestsAPIRoutes from './routes/leveling/quests/QuestsAPIRoutes';
import PillsAPIRoutes from './routes/leveling/pills/PillsAPIRoutes';
import QuestlinesAPIRoutes from './routes/leveling/questlines/QuestlinesAPIRoutes';
import InboxAPIRoutes from './routes/leveling/inbox/InboxAPIRoutes';

export default [
  ...defaultMiddlewares,
  ...NotesAPIRoutes,
  ...FlashcardsAPIRoutes,
  ...QuestlinesAPIRoutes,
  ...QuestsAPIRoutes,
  ...FeatsAPIRoutes,
  ...RecordsAPIRoutes,
  ...StatsAPIRoutes,
  ...PillsAPIRoutes,
  ...InboxAPIRoutes
]