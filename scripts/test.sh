#!/bin/bash

export NODE_ENV=dev
export SERVER_PORT=3001
export DB_PORT=3003
# export PGUSER="zero"
# export PGHOST="localhost"
# export PGDATABASE="saratest"
# export PGPASSWORD="193746"
# export PGPORT=5432

#source ./scripts/prepare-dev.sh

npx jest --runInBand 
#/src/repositories/leveling/SkillsRepo.test.ts
#src/controllers/http-api/routes/leveling/inbox/InboxAPIRoutes.test.ts src/features/leveling/Inbox.test.ts src/repositories/leveling/InboxRepo.test.ts
#src/features/leveling/Pills.test.ts 
#/src/repositories/leveling/PillsRepo.test.ts
#src/controllers/http-api/routes/leveling/quests/QuestsAPIRoutes.test.ts src/features/leveling/Quests.test.ts src/controllers/http-api/routes/leveling/quests/QuestsAPIRoutes.test.ts 
#
#src/controllers/http-api/routes/leveling/questlines/QuestlinesAPIRoutes.test.ts 
#src/features/leveling/Questlines.test.ts 
#/src/repositories/leveling/QuestlinesRepo.test.ts