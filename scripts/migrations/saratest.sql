CREATE TABLE questlines (
  id VARCHAR PRIMARY KEY,
  title VARCHAR(50) UNIQUE,
  description VARCHAR(500),
  type VARCHAR(16),
  state VARCHAR(16) DEFAULT 'active',
  timecap BIGINT,
  created_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  xp INTEGER
);

INSERT INTO questlines (id, title, description, type, state, timecap, created_at, finished_at, xp) 
  VALUES ('uuid1', 'Em busca da procura 1', 'Questline description', 'main', 'finished', 2592000000, '2022-07-03 15:50:28 GMT-3', '2022-07-03 15:50:28 GMT-3', 25),
  ('uuid2', 'Em busca da procura 2', 'Questline description', 'practice', 'active', 2592000000, '2022-07-03 15:50:28 GMT-3', null, null),
  ('uuid3', 'Em busca da procura 3', 'Questline description', 'main', 'finished', 2592000000, '2022-07-03 15:50:28 GMT-3', '2022-07-03 15:50:28 GMT-3', 25),
  ('uuid4', 'Em busca da procura 4', 'Questline description', 'main', 'active', 2592000000, '2022-07-03 15:50:28 GMT-3', null, 25),
  ('uuid5', 'Questline to update', 'Questline description', 'practice', 'active', 2592000000, '2022-07-03 15:50:28 GMT-3', null, null),
  ('uuid6', 'Questline to finish', 'Questline description', 'practice', 'active', 2592000000, '2022-07-03 15:50:28 GMT-3', null, null),
  ('uuid7', 'Questline to delete', 'Questline description', 'practice', 'active', 2592000000, '2022-07-03 15:50:28 GMT-3', null, null),
  ('questline_fk-id', 'Hackingss', 'Questline description', 'practice', 'active', 2592000000, '2022-07-03 15:50:28 GMT-3', null, null),
  ('uuid8', 'Questline to invalidate', 'Questline description', 'practice', 'active', 2592000000, '2022-07-03 15:50:28 GMT-3', null, null);


CREATE TABLE quests (
  id VARCHAR PRIMARY KEY,
  questline_id VARCHAR REFERENCES questlines(id),
  title VARCHAR(50),
  description VARCHAR(500),
  type VARCHAR(10),
  state VARCHAR(10),
  timecap BIGINT,
  focus_score INTEGER,
  distraction_score INTEGER,
  created_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  xp INTEGER
);

INSERT INTO quests (id, questline_id, title, description, type, state, timecap, focus_score, distraction_score, created_at, finished_at, xp)
VALUES ('uuid1', 'questline_fk-id', 'Dummy quest', 'Quest description', 'main', 'finished', 3600000, 5, 5, '2022-07-03 15:50:28 GMT-3', '2022-07-03 15:50:28 GMT-3', 25),
('uuid2', null, 'Dummy quest', 'Quest description', 'side', 'deferred', 3600000, null, null, '2022-07-03 15:50:28 GMT-3', null, 25),
('uuid3', null, 'Dummy quest', 'Quest description', 'side', 'active', 3600000, null, null, '2022-07-03 15:50:28 GMT-3', null, 25),
('uuid4', null, 'Dummy quest', 'Quest description', 'side', 'deferred', 3600000, null, null, '2022-07-03 15:50:28 GMT-3', null, 25),
('uuid5', null, 'Dummy quest', 'Quest description', 'side', 'deferred', 3600000, null, null, '2022-07-03 15:50:28 GMT-3', null, 25),
('uuid6', null, 'Dummy quest', 'Quest description', 'side', 'deferred', 3600000, null, null, '2022-07-03 15:50:28 GMT-3', null, 25),
('uuid7', 'questline_fk-id', 'Dummy quest', 'Quest description', 'main', 'finished', 3600000, 5, 5, '2022-07-03 15:50:28 GMT-3', '2022-07-03 15:50:28 GMT-3', 25),
('uuid8', 'questline_fk-id', 'Dummy quest', 'Quest description', 'main', 'finished', 3600000, 5, 5, '2022-07-03 15:50:28 GMT-3', '2022-07-03 15:50:28 GMT-3', 25),
('uuid9', 'questline_fk-id', 'Dummy quest', 'Quest description', 'main', 'finished', 3600000, 5, 5, '2022-07-03 15:50:28 GMT-3', '2022-07-03 15:50:28 GMT-3', 25),
('uuid10', 'questline_fk-id', 'Dummy quest', 'Quest description', 'main', 'active', 3600000, null, null, '2022-07-03 15:50:28 GMT-3', null, 25),
('uuid11', null, 'Dummy quest', 'Quest description', 'side', 'finished', 3600000, 5, 5, '2022-07-03 15:50:28 GMT-3', '2022-07-03 15:50:28 GMT-3', 25),
('uuid12', null, 'Dummy quest', 'Quest description', 'side', 'finished', 3600000, 5, 5, '2022-07-03 15:50:28 GMT-3', '2022-07-03 15:50:28 GMT-3', 25);


CREATE TABLE quests_todos (
  id VARCHAR PRIMARY KEY,
  quest_id VARCHAR REFERENCES quests(id),
  description VARCHAR,
  state VARCHAR DEFAULT 'active',
  finished_at TIMESTAMPTZ
);

INSERT INTO quests_todos (id, quest_id, description, state, finished_at)
VALUES ('todoId-01', 'uuid9', 'Descrição de afazer', 'finished', '2022-07-03 15:50:28 GMT-3'),
('todoId-02', 'uuid9', 'Descrição de afazer', 'finished', '2022-07-03 15:50:28 GMT-3'),
('todoId-03', 'uuid9', 'Descrição de afazer', 'finished', '2022-07-03 15:50:28 GMT-3'),
('todoId-04', 'uuid10', 'Descrição de afazer', 'active', '2022-07-03 15:50:28 GMT-3'),
('todoId-05', 'uuid10', 'Descrição de afazer', 'active', '2022-07-03 15:50:28 GMT-3'),
('todoId-06', 'uuid10', 'Descrição de afazer', 'active', '2022-07-03 15:50:28 GMT-3');

CREATE TABLE achievements (
  id VARCHAR PRIMARY KEY,
  questline_id VARCHAR REFERENCES questlines(id),
  title VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR,  
  requirements VARCHAR,
  type VARCHAR(16),
  completed BOOLEAN DEFAULT false,
  boost INTEGER,
  xp INTEGER,
  finished_at TIMESTAMPTZ
  );

INSERT INTO achievements (id, questline_id, title, description, requirements, type, completed, boost, xp, finished_at)
VALUES ('achievId-01', 'questline_fk-id', 'Dummy Achiev 1', 'Achiev description', '["requirements"]', 'achievement', false, 3, 25, null),
('achievId-02', 'questline_fk-id', 'Dummy Achiev 2', 'Achiev description', '["requirements"]', 'achievement', false, 3, 25, null),
('achievId-03', 'questline_fk-id', 'Dummy Achiev 3', 'Achiev description', '["requirements"]', 'achievement', false, 3, 25, null),
('achievId-04', 'questline_fk-id', 'Dummy Achiev to update 1', 'Achiev description', '["requirements"]', 'achievement', false, 3, 25, null),
('achievId-05', 'questline_fk-id', 'Dummy Achiev to update 2', 'Achiev description', '["requirements"]', 'achievement', false, 3, 25, null),
('achievId-06', 'questline_fk-id', 'Dummy Achiev to update 3', 'Achiev description', '["requirements"]', 'achievement', false, 3, 25, null),
('achievId-07', 'questline_fk-id', 'Dummy Achiev to delete', 'Achiev description', '["requirements"]', 'achievement', false, 3, 25, null),
('achievId-08', 'questline_fk-id', 'Dummy Achiev to delete 2', 'Achiev description', '["requirements"]', 'achievement', false, 3, 25, null),
('achievId-09', 'questline_fk-id', 'Dummy Achiev finished', 'Achiev description', '["requirements"]', 'achievement', true, 3, 25, '2022-07-03 15:50:28 GMT-3'),
('achievId-10', 'uuid2', 'Dummy Title 1', 'Achiev description', '["requirements"]', 'title', false, 3, 25, null),
('achievId-11', 'uuid2', 'Dummy Title 2', 'Achiev description', '["requirements"]', 'title', true, 3, 25, '2022-07-03 16:50:28 GMT-3'),
('achievId-12', 'uuid2', 'Dummy Title 3', 'Achiev description', '["requirements"]', 'title', true, 3, 25, '2022-07-03 17:50:28 GMT-3'),
('achievId-13', 'uuid2', 'Dummy Title 4', 'Achiev description', '["requirements"]', 'title', true, 3, 25, '2022-07-03 18:50:28 GMT-3');

CREATE TABLE deeds (
  id VARCHAR PRIMARY KEY,
  questline_id VARCHAR REFERENCES questlines(id),
  title VARCHAR UNIQUE,
  description VARCHAR,
  categories VARCHAR,
  type VARCHAR(10),
  tier INTEGER DEFAULT 1,
  level INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  xp INTEGER,
  finished_at TIMESTAMPTZ
);

INSERT INTO deeds (id, questline_id, title, description, type, tier, level, completed, xp, finished_at)
VALUES ('deedId-01', 'questline_fk-id', 'Dummy Deed 1', 'Deed description', 'deed', 1, 0, false, 25, null),
('deedId-02', 'questline_fk-id', 'Dummy Deed 2', 'Deed description', 'deed', 2, 0, true, 25, '2022-07-03 15:50:28 GMT-3'),
('deedId-03', 'questline_fk-id', 'Dummy Deed 3', 'Deed description', 'record', 3, 8, false, 25, null),
('deedId-04', 'questline_fk-id', 'Dummy Deed 4', 'Deed description', 'deed', 1, 0, true, 25, '2022-07-03 16:50:28 GMT-3'),
('deedId-05', 'questline_fk-id', 'Dummy Deed 5', 'Deed description', 'deed', 2, 0, false, 25, null),
('deedId-06', 'questline_fk-id', 'Dummy Deed 6', 'Deed description', 'deed', 3, 0, false, 25, null),
('deedId-07', 'questline_fk-id', 'Dummy Deed 7', 'Deed description', 'deed', 3, 0, false, 25, null),
('deedId-08', 'questline_fk-id', 'Dummy Deed 08', 'Deed description', 'record', 3, 8, false, 25, null);

CREATE TABLE passive_skills (
  id VARCHAR PRIMARY KEY,
  title VARCHAR UNIQUE,
  description VARCHAR,
  type VARCHAR DEFAULT 'passive',
  boost INTEGER,
  stage INTEGER DEFAULT 0,
  state VARCHAR(10) DEFAULT 'sleep'
);

CREATE TABLE passive_skills_history (
  passive_skill_id VARCHAR REFERENCES passive_skills(id),
  change VARCHAR(10),
  current_level INTEGER,
  finished_at TIMESTAMPTZ
);

INSERT INTO passive_skills (id, title, description, boost, stage, state)
VALUES ('passiveId-01', 'Dummy PassiveSkill 1', 'PassiveSkill description', 3, 0, 'sleep'),
('passiveId-02', 'Dummy PassiveSkill 2', 'PassiveSkill description', 2, 0, 'sleep'),
('passiveId-03', 'Dummy PassiveSkill 3', 'PassiveSkill description', 3, 8, 'sleep'),
('passiveId-04', 'Dummy PassiveSkill 4', 'PassiveSkill description', 1, 0, 'sleep'),
('passiveId-05', 'Dummy PassiveSkill 5', 'PassiveSkill description', 2, 0, 'sleep'),
('passiveId-06', 'Dummy PassiveSkill 6', 'PassiveSkill description', 3, 0, 'sleep'),
('passiveId-07', 'Dummy PassiveSkill 7', 'PassiveSkill description', 3, 0, 'sleep');

INSERT INTO passive_skills_history (passive_skill_id, change, current_level, finished_at)
VALUES ('passiveId-01', 'up', 1, '2022-07-03 15:50:28 GMT-3'),
('passiveId-01', 'same', 1, '2022-07-03 15:50:28 GMT-3'),
('passiveId-01', 'up', 2, '2022-07-03 15:50:28 GMT-3');


CREATE TABLE supplements (
  id VARCHAR PRIMARY KEY, 
  name VARCHAR, 
  qtd BIGINT, 
  consumed_at TIMESTAMPTZ
);

INSERT INTO supplements (id, name, qtd, consumed_at)
VALUES ('suppl-uuid1', 'Free Time', 3600000, '2022-07-03 15:50:28 GMT-3'),
('suppl-uuid2', 'Free Time', 3600000, '2022-07-04 15:50:28 GMT-3'),
('suppl-uuid3', 'Free Time', 3600000, '2022-07-05 15:50:28 GMT-3');