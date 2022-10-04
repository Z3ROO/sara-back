import { IQuest } from "../../features/interfaces/interfaces";
import { RepositoryError } from "../../util/errors/RepositoryError";
import { QuestRepo } from "./QuestRepo"

describe('Quests Repository', () => {
  test('Should successfully retrieve main quest', async () => {
    const dummyQuest: IQuest = {
      id: 'uuid10',
      questline_id: 'questline_fk-id',
      title: 'Dummy quest',
      description: 'Quest description',
      type: 'main',
      state: 'active',
      timecap: '3600000'
    }
    const { record } = await QuestRepo.findMainQuest();

    expect(record).toMatchObject(dummyQuest);
  });

  test('Should successfully retrieve one specified quest by id', async () => {
    const dummySideQuest: IQuest = {
      id: 'uuid2',
      questline_id: null,
      title: 'Dummy quest',
      description: 'Quest description',
      type: 'side',
      state: 'deferred',
      timecap: '3600000'
    }

    const { record } = await QuestRepo.findOneQuest(dummySideQuest.id);

    expect(record).toMatchObject(dummySideQuest);
  });

  test('Should successfully retrieve active sidequest', async () => {
    const dummySideQuest: IQuest = {
      id: 'uuid3',
      questline_id: null,
      title: 'Dummy quest',
      description: 'Quest description',
      type: 'side',
      state: 'active',
      timecap: '3600000'
    }

    const { record } = await QuestRepo.findActiveSideQuest();

    expect(record).toMatchObject(dummySideQuest);
  });

  test('Should successfully retrieve every sidequest', async () => {
    const dummyQuestBodyPart: IQuest = {
      questline_id: null,
      title: 'Dummy quest',
      description: 'Quest description',
      type: 'side',
      timecap: '3600000'
    }

    const { records } = await QuestRepo.findAllSideQuests();

    expect(records.length).toBeGreaterThanOrEqual(5);
    records.forEach(record => {
      expect(record).toMatchObject(dummyQuestBodyPart);
    });
  });

  test('Should successfully retrieve every finished quest', async () => {
    const dummyQuestBodyPart = {
      title: 'Dummy quest',
      description: 'Quest description',
      timecap: '3600000'
    }

    const { records } = await QuestRepo.findAllFinishedQuests();

    expect(records.length).toBeGreaterThanOrEqual(4);
    records.forEach(record => {
      expect(record).toMatchObject(dummyQuestBodyPart);
    });
  });

  test('Should successfully retrieve every finished main quest', async () => {
    const dummyQuestBodyPart = {
      title: 'Dummy quest',
      description: 'Quest description',
      timecap: '3600000',
      type: 'main'
    }

    const { records } = await QuestRepo.findAllFinishedMainQuests();

    expect(records.length).toBeGreaterThanOrEqual(4);
    records.forEach(record => {
      expect(record).toMatchObject(dummyQuestBodyPart);
    });
  });

  test('Should successfully retrieve every finished side quest', async () => {
    const dummyQuestBodyPart = {
      title: 'Dummy quest',
      description: 'Quest description',
      timecap: '3600000',
      type: 'side'
    }

    const { records } = await QuestRepo.findAllFinishedSideQuests();

    expect(records.length).toBeGreaterThanOrEqual(2);
    records.forEach(record => {
      expect(record).toMatchObject(dummyQuestBodyPart);
    });
  });

  test('Should successfully retrieve every finished quest in date range', async () => {
    const dummyQuestBodyParts = {
      title: 'Dummy quest',
      description: 'Quest description',
      state: 'finished',
      timecap: '3600000',
      focus_score: 5,
      distraction_score: 5
    };
    const beginning = '2022-07-03 15:50:28 GMT-3';
    const ending = '2022-07-03 15:50:28 GMT-3';
    const { records } = await QuestRepo.findAllFinishedQuestsInDateRange(beginning, ending);
    
    expect(records.length).toBeGreaterThanOrEqual(4);
    records.forEach(record => expect(record).toMatchObject(dummyQuestBodyParts))
  });

  test('Should successfully create a new quest', async () => {
    const dummyQuest: IQuest = {
      questline_id: 'questline_fk-id',
      title: 'Dummy quest',
      description: 'Quest description',
      type: 'side',
      timecap: '3600000'
    }

    await QuestRepo.deleteQuest('uuid6');

    await QuestRepo.insertNewQuest(dummyQuest)
    const {records} = await QuestRepo.findAllSideQuests();

    expect(records.length).toBe(5);
  });

  test('Should throw Repository Error if try to create main or practice quest when one of them already exists', async () => {
    const dummyQuest: IQuest = {
      questline_id: 'fk_uuid',
      title: 'Dummy quest',
      description: 'Quest description',
      type: 'main',
      timecap: '3600000'
    }

    const sut = async () => await QuestRepo.insertNewQuest(dummyQuest)

    await expect(sut()).rejects.toThrow(new RepositoryError('An active main quest already exists'));
  });

  test('Should throw Repository Error if try to create more than 5 side quests', async () => {
    const dummyQuest: IQuest = {
      questline_id: null,
      title: 'Dummy quest',
      description: 'Quest description',
      type: 'side',
      timecap: '3600000'
    }

    const sut = async () => await QuestRepo.insertNewQuest(dummyQuest);

    await expect(sut()).rejects.toThrow(new RepositoryError('Maximum sidequests exceeded'));
  });

  test('Should successfully finish quest', async () => {
    const dummyQuest: IQuest = {
      questline_id: null,
      title: 'Dummy quest',
      description: 'Quest description',
      type: 'side',
      timecap: '3600000'
    };
    const activeSideQuest = await QuestRepo.findActiveSideQuest();
    await QuestRepo.finishQuest(activeSideQuest.record.id, 5, 5);
    await QuestRepo.insertNewQuest(dummyQuest);
    await QuestRepo.activateSideQuest('uuid5');
    
    const { record } = await QuestRepo.findOneQuest(activeSideQuest.record.id);
    
    expect(record.id).toBe(activeSideQuest.record.id);
    expect(record.state).toBe('finished');
    expect(record.focus_score).toBe(5);
    expect(record.distraction_score).toBe(5);
  });

  test('Should throw Repository Error if try to finish a non-active quest', async () => {
    const dummyIdentifier = 'uuid6'
    const sut = async () => await QuestRepo.finishQuest(dummyIdentifier, null, 25);

    await expect(sut()).rejects.toThrow(new RepositoryError('Quest cant be finished.'));
  });

  test('Should successfully activate side quest', async () => {
    const currentActiveSideQuest = await QuestRepo.findActiveSideQuest();
    const dummyIdentifier = 'uuid4';
    console.log(currentActiveSideQuest)
    await QuestRepo.deleteQuest(currentActiveSideQuest.record.id);

    await QuestRepo.activateSideQuest(dummyIdentifier);
    const { record } = await QuestRepo.findActiveSideQuest();
    expect(record.id).toBe(dummyIdentifier);
  });
})