CREATE TABLE questlines (
  id VARCHAR PRIMARY KEY,
  title VARCHAR UNIQUE,
  description VARCHAR,
  type VARCHAR,
  state VARCHAR DEFAULT 'active',
  timecap BIGINT,
  created_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  xp INTEGER
);

INSERT INTO questlines (id, title, description, type, state, timecap, created_at, finished_at, xp)
VALUES ('questline-1', 'Quest line 1', 'Nessa questline tenho que fazer tais coisa.', 'main', 'active', 2592000000, '2022-07-08 12:59:06-3', null, 250),
('questline-2', 'Matematica q2', 'Nessa questline tenho que fazer tais coisa.', 'practice', 'active', null, '2022-07-08 12:00:06-3', null, 250),
('questline-3', 'Musica q3', 'Nessa questline tenho que fazer tais coisa.', 'practice', 'active', null, '2022-07-08 12:03:06-3', null, 250),
('questline-4', 'Defesa Pessoal q4', 'Nessa questline tenho que fazer tais coisa.', 'practice', 'active', null, '2022-07-08 12:11:06-3', null, 250);

CREATE TABLE quests (
  id VARCHAR PRIMARY KEY,
  questline_id VARCHAR REFERENCES questlines(id),
  title VARCHAR,
  description VARCHAR,
  type VARCHAR,
  state VARCHAR,
  timecap BIGINT,
  focus_score VARCHAR DEFAULT 0,
  distraction_score VARCHAR DEFAULT 0,
  created_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  xp INTEGER
);

INSERT INTO quests (id, questline_id, title, description, type, state, timecap, focus_score, distraction_score, created_at, finished_at, xp)
VALUES ('quest-1', 'questline-1', 'Fazer aquelas coisas', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-08 13:11:06-3', '2022-07-08 14:18:06-3', 50),
('quest-2', 'questline-1', 'Fazer aquelas coisas 2', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-08 14:30:06-3', '2022-07-08 15:22:06-3', 50),
('quest-3', 'questline-1', 'Fazer aquelas coisas 3', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-08 15:51:06-3', '2022-07-08 16:18:06-3', 50),
('quest-4', 'questline-1', 'Fazer aquelas coisas 4', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'invalidated', 3600000, 6, 3, '2022-07-08 16:21:06-3', '2022-07-08 17:18:06-3', 50),

('quest-5', 'questline-1', 'Fazer aquelas coisas 5', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-09 09:21:06-3', '2022-07-09 10:18:06-3', 50),
('quest-6', 'questline-1', 'Fazer aquelas coisas 6', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-09 11:21:06-3', '2022-07-09 12:18:06-3', 50),
('quest-7', 'questline-1', 'Fazer aquelas coisas 7', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-09 12:21:06-3', '2022-07-09 13:28:06-3', 250),
('quest-8', 'questline-1', 'Fazer aquelas coisas 8', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-09 13:22:06-3', '2022-07-09 14:28:06-3', 250),

('quest-9', 'questline-1', 'Fazer aquelas coisas 6', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-10 11:21:06-3', '2022-07-10 12:18:06-3', 50),
('quest-10', 'questline-1', 'Fazer aquelas coisas 7', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'invalidated', 3600000, 6, 3, '2022-07-10 12:21:06-3', '2022-07-10 13:28:06-3', 250),
('quest-11', 'questline-1', 'Fazer aquelas coisas 8', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-10 13:22:06-3', '2022-07-10 14:28:06-3', 250),

('quest-12', 'questline-1', 'Fazer aquelas coisas 6', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-11 11:21:06-3', '2022-07-11 12:18:06-3', 50),
('quest-13', 'questline-1', 'Fazer aquelas coisas 7', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'invalidated', 3600000, 6, 3, '2022-07-11 12:21:06-3', '2022-07-11 13:28:06-3', 250),
('quest-14', 'questline-1', 'Fazer aquelas coisas 8', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-11 13:22:06-3', '2022-07-11 14:28:06-3', 250),
('quest-15', 'questline-1', 'Fazer aquelas coisas 9', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-11 15:22:06-3', '2022-07-11 16:28:06-3', 250),

('quest-16', 'questline-1', 'Fazer aquelas coisas 1', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-12 08:21:06-3', '2022-07-12 09:28:06-3', 250),
('quest-17', 'questline-1', 'Fazer aquelas coisas 2', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 3600000, 6, 3, '2022-07-12 10:22:06-3', '2022-07-12 11:28:06-3', 250),
('quest-18', 'questline-1', 'Fazer aquelas coisas 3', 'Fazer tal e tal coisa e manter tal e tal coisa mantida.', 'main', 'finished', 5300000, 6, 3, '2022-07-12 11:32:06-3', null, 250);

CREATE TABLE quests_todos (
  id VARCHAR PRIMARY KEY,
  quest_id VARCHAR REFERENCES quests(id),
  description VARCHAR,
  state VARCHAR DEFAULT 'active',
  finished_at TIMESTAMPTZ
);

INSERT INTO quests_todos (id, quest_id, description, state, finished_at)
VALUES ('quest-todo-1', 'quest-1', 'Todo para quest-1 1', 'finished', '2022-07-08 13:14:06-3'),
('quest-todo-2', 'quest-1', 'Todo para quest-1 2', 'finished', '2022-07-08 13:18:06-3'),
('quest-todo-3', 'quest-1', 'Todo para quest-1 3', 'finished', '2022-07-08 13:29:06-3'),
('quest-todo-4', 'quest-2', 'Todo para quest-2 1', 'finished', '2022-07-08 14:35:06-3'),
('quest-todo-5', 'quest-2', 'Todo para quest-2 2', 'finished', '2022-07-08 14:42:06-3'),
('quest-todo-6', 'quest-2', 'Todo para quest-2 3', 'finished', '2022-07-08 14:50:06-3'),
('quest-todo-7', 'quest-3', 'Todo para quest-3 1', 'finished', '2022-07-08 15:52:06-3'),
('quest-todo-8', 'quest-3', 'Todo para quest-3 2', 'invalidated', '2022-07-08 15:53:06-3'),
('quest-todo-9', 'quest-3', 'Todo para quest-3 3', 'invalidated', '2022-07-08 15:54:06-3'),

('quest-todo-10', 'quest-5', 'Todo para quest-5 1', 'finished', '2022-07-08 15:52:06-3'),
('quest-todo-11', 'quest-5', 'Todo para quest-5 2', 'finished', '2022-07-08 15:53:06-3'),
('quest-todo-12', 'quest-5', 'Todo para quest-5 3', 'invalidated', '2022-07-08 15:54:06-3'),
('quest-todo-13', 'quest-6', 'Todo para quest-6 1', 'finished', '2022-07-08 15:52:06-3'),
('quest-todo-14', 'quest-6', 'Todo para quest-6 2', 'finished', '2022-07-08 15:53:06-3'),
('quest-todo-15', 'quest-6', 'Todo para quest-6 3', 'invalidated', '2022-07-08 15:54:06-3'),
('quest-todo-16', 'quest-7', 'Todo para quest-7 1', 'finished', '2022-07-08 15:52:06-3'),
('quest-todo-17', 'quest-7', 'Todo para quest-7 2', 'finished', '2022-07-08 15:53:06-3'),
('quest-todo-18', 'quest-7', 'Todo para quest-7 3', 'invalidated', '2022-07-08 15:54:06-3'),
('quest-todo-19', 'quest-8', 'Todo para quest-7 1', 'finished', '2022-07-08 15:52:06-3'),
('quest-todo-20', 'quest-8', 'Todo para quest-7 2', 'finished', '2022-07-08 15:53:06-3'),
('quest-todo-21', 'quest-8', 'Todo para quest-7 3', 'invalidated', '2022-07-08 15:54:06-3'),
('quest-todo-22', 'quest-8', 'Todo para quest-7 1', 'finished', '2022-07-08 15:52:06-3'),

('quest-todo-23', 'quest-9', 'Todo para quest-7 2', 'finished', '2022-07-08 15:53:06-3'),
('quest-todo-24', 'quest-9', 'Todo para quest-7 3', 'invalidated', '2022-07-08 15:54:06-3'),
('quest-todo-25', 'quest-9', 'Todo para quest-7 1', 'finished', '2022-07-08 15:52:06-3'),
('quest-todo-26', 'quest-9', 'Todo para quest-7 2', 'finished', '2022-07-08 15:53:06-3'),
('quest-todo-27', 'quest-10', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-28', 'quest-10', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-29', 'quest-10', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-30', 'quest-11', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-31', 'quest-11', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),

('quest-todo-32', 'quest-12', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-33', 'quest-12', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-34', 'quest-12', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-35', 'quest-13', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-36', 'quest-13', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-37', 'quest-14', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-38', 'quest-14', 'Todo para quest-7 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-39', 'quest-15', 'Todo para quest-15 1', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-40', 'quest-15', 'Todo para quest-15 2', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-41', 'quest-15', 'Todo para quest-15 3', 'finished', '2022-07-08 15:54:06-3'),

('quest-todo-42', 'quest-16', 'Todo para quest-16 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-43', 'quest-16', 'Todo para quest-16 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-44', 'quest-17', 'Todo para quest-17 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-45', 'quest-17', 'Todo para quest-17 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-46', 'quest-18', 'Todo para quest-18 1', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-47', 'quest-18', 'Todo para quest-18 2', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-48', 'quest-18', 'Todo para quest-18 3', 'finished', '2022-07-08 15:54:06-3'),
('quest-todo-49', 'quest-18', 'Todo para quest-18 4', 'finished', '2022-07-08 15:54:06-3');

CREATE TABLE achievements (
  id VARCHAR PRIMARY KEY,
  questline_id VARCHAR REFERENCES questlines(id),
  title VARCHAR UNIQUE,
  description VARCHAR,
  requirements VARCHAR,
  type VARCHAR,
  completed BOOLEAN DEFAULT false,
  boost INTEGER,
  xp INTEGER,
  finished_at TIMESTAMPTZ
);

CREATE TABLE feats (
  id VARCHAR PRIMARY KEY,
  questline_id VARCHAR REFERENCES questlines(id),
  title VARCHAR UNIQUE,
  description VARCHAR,
  categories VARCHAR,
  tier INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false,
  xp INTEGER,
  finished_at TIMESTAMPTZ
);

INSERT INTO feats (id, questline_id, title, description, categories, tier, completed, xp, finished_at)
VALUES ('feat-1', 'questline-1', 'Feat facil 1', 'Deve ser de tal jeito.', '', 1, true, 25, '2022-07-08 15:54:06-3'),
('feat-2', 'questline-2', 'Feat facil 2', 'Deve ser de tal jeito.', '', 1, false, 25, null),
('feat-3', 'questline-3', 'Feat facil 3', 'Deve ser de tal jeito.', '', 1, false, 25, null),
('feat-4', 'questline-1', 'Feat intermediario 1', 'Deve ser de tal jeito.', '', 2, true, 25, '2022-07-08 15:54:06-3'),
('feat-5', 'questline-2', 'Feat intermediario 2', 'Deve ser de tal jeito.', '', 2, false, 25, null),
('feat-6', 'questline-3', 'Feat intermediario 3', 'Deve ser de tal jeito.', '', 2, false, 25, null),
('feat-7', 'questline-1', 'Feat dificil 1', 'Deve ser de tal jeito.', '', 3, true, 25, '2022-07-08 15:54:06-3'),
('feat-8', 'questline-2', 'Feat dificil 2', 'Deve ser de tal jeito.', '', 3, false, 25, null),
('feat-9', 'questline-3', 'Feat dificil 3', 'Deve ser de tal jeito.', '', 3, false, 25, null);


CREATE TABLE records (
  id VARCHAR PRIMARY KEY,
  questline_id VARCHAR REFERENCES questlines(id),
  title VARCHAR UNIQUE,
  description VARCHAR,
  qtd INTEGER,
  categories VARCHAR,
  tier INTEGER,
  level INTEGER DEFAULT 0,
  xp INTEGER
);

INSERT INTO records (id, questline_id, title, description, qtd, categories, tier, level, xp)
VALUES ('record-1', 'questline-1', 'Record 1', 'Deve ser de tal jeito.', 10 , '', 1, 0, 25),
('record-2', 'questline-2', 'Record 2', 'Deve ser de tal jeito.', 10 , '', 1, 0, 25),
('record-3', 'questline-3', 'Record 3', 'Deve ser de tal jeito.', 10 , '', 2, 0, 25),
('record-4', 'questline-1', 'Record 4', 'Deve ser de tal jeito.', 10 , '', 2, 0, 25),
('record-5', 'questline-2', 'Record 5', 'Deve ser de tal jeito.', 10 , '', 1, 0, 25),
('record-6', 'questline-3', 'Record 6', 'Deve ser de tal jeito.', 10 , '', 3, 0, 25),
('record-7', 'questline-1', 'Record 7', 'Deve ser de tal jeito.', 10 , '', 3, 0, 25),
('record-8', 'questline-2', 'Record 8', 'Deve ser de tal jeito.', 10 , '', 1, 0, 25),
('record-9', 'questline-3', 'Record 9', 'Deve ser de tal jeito.', 10 , '', 3, 0, 25);

CREATE TABLE records_history (
  record_id VARCHAR REFERENCES records(id),
  change VARCHAR(10),
  current_level INTEGER,
  finished_at TIMESTAMPTZ
);

INSERT INTO records_history (record_id, change, current_level, finished_at)
VALUES ('record-1', 'up', 1, '2022-07-17 13:14:06-3'),
('record-5', 'up', 1, '2022-07-17 14:14:06-3');


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

CREATE TABLE pre_made_quests (
  id VARCHAR PRIMARY KEY,
  questline_id VARCHAR REFERENCES questlines(id),
  title VARCHAR,
  description VARCHAR,
  type VARCHAR,
  timecap BIGINT,
  todos VARCHAR,
  xp INTEGER
);

CREATE TABLE missions (
  id VARCHAR PRIMARY KEY,
  questline_id VARCHAR REFERENCES questlines(id),
  title VARCHAR,
  description VARCHAR,
  todos VARCHAR,
  state VARCHAR,
  attempts VARCHAR DEFAULT 0,
  constraints VARCHAR,
  timecap INTEGER,
  stage INTEGER,
  created_at TIMESTAMPTZ,
  start_at TIMESTAMPTZ,
  last_sync TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);