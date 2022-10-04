import { IQuestLine } from "../../features/interfaces/interfaces";
import { RepositoryError } from "../../util/errors/RepositoryError";
import { QuestLineRepo } from "./QuestLineRepo"

describe('QuestLine Repository', () => {
  test('Should successfully retrieve main questline', async () => {
    const dummyQuestline: IQuestLine = {
      id: 'uuid4',
      title: 'Em busca da procura 4',
      description: 'Questline description',
      type: 'main',
      timecap: '2592000000',
      xp: 25
    }

    const { record } = await QuestLineRepo.findMainQuestLine();

    expect(record).toMatchObject(dummyQuestline);
  })

  test('Should successfully retrieve every active questlines', async () => {
    const dummyQuestLineBodyParts = {
      description: 'Questline description',
      state: 'active', 
      timecap: '2592000000',
      finished_at: null
    };
    const { records } = await QuestLineRepo.findAllActiveQuestLines();

    expect(records.length).toBeGreaterThanOrEqual(4);
    records.forEach(record => expect(record).toMatchObject(dummyQuestLineBodyParts))
  });

  test('Should successfully retrieve all finished questlines', async () => {
    const dummyQuestLineBodyParts = {
      description: 'Questline description',
      type: 'main',
      state: 'finished', 
      timecap: '2592000000',
      xp: 25
    };
    const { records } = await QuestLineRepo.findAllFinishedQuestLines();

    expect(records.length).toBeGreaterThanOrEqual(2);
    records.forEach(record => expect(record).toMatchObject(dummyQuestLineBodyParts));
  })

  test('Should successfully retrieve the specified questline by id', async () => {
    const dummyQuestline = {
      id: 'uuid4',
      title: 'Em busca da procura 4',
      description: 'Questline description',
      type: 'main'
    }

    const { record } = await QuestLineRepo.findOneQuestLine(dummyQuestline.id);
    expect(record).toMatchObject(dummyQuestline)
  });

  test('Should successfully retrieve the specified questline by title', async () => {
    const dummyQuestline = {
      id: 'uuid2',
      title: 'Em busca da procura 2',
      description: 'Questline description',
      type: 'practice'
    }

    const { record } = await QuestLineRepo.findOneQuestLineByTitle(dummyQuestline.title);
    expect(record).toMatchObject(dummyQuestline)
  });

  test('Should successfully retrieve finished questlines in date range', async () => {
    const beginning = '2022-07-03 00:00:00';
    const ending = '2022-07-03 23:59:00';
    const { records } = await QuestLineRepo.findFineshedQuestLineInDateRange(beginning, ending);

    records.forEach(record => expect(new Date(record.finished_at).toLocaleDateString('sv')).toBe(new Date(ending).toLocaleDateString('sv')))
  })

  test('Should succesfully create a questline', async () => {
    const dummyQuestline: IQuestLine = {
      title: 'New Questline',
      description: 'QuestLine description',
      type: 'practice',
      timecap: '2592000000',
      xp: null
    }

    await QuestLineRepo.createNewQuestLine(dummyQuestline);
    
    const { record } = await QuestLineRepo.findOneQuestLineByTitle(dummyQuestline.title);

    expect(record).toMatchObject(dummyQuestline);
  });

  test('Should throw RepositoryError if try to create main questline while one already active', async () => {
    const dummyQuestline: IQuestLine = {
      title: 'New Questline',
      description: 'QuestLine description',
      type: 'main',
      timecap: '2592000000',
      xp: 25
    }

    const sut = async () => await QuestLineRepo.createNewQuestLine(dummyQuestline)

    expect(sut()).rejects.toThrow(new RepositoryError('There is a main quest line activated already'));
  })

  test('Should throw RepositoryError if an invalid property is passed as argument', async () => {
    const dummyQuestline: IQuestLine = {
      id:'uuid-currentlyInvalidParameter',
      title: 'New Questline',
      description: 'QuestLine description',
      type: 'main',
      timecap: '2592000000',
      xp: 25
    }

    const sut = async () => await QuestLineRepo.createNewQuestLine(dummyQuestline)

    expect(sut()).rejects.toThrow(new RepositoryError('An invalid questline_property was issued.'));
  })

  test('Should succesfully finish questline', async () => {
    const dummyQuestline: IQuestLine = {
      id: 'uuid6',
      title: 'Questline to finish',
      description: 'Questline description',
      type: 'practice',
      timecap: '2592000000',
      state: 'finished',
      xp: null
    }

    await QuestLineRepo.finishQuestLine(dummyQuestline.id);
    const { record } = await QuestLineRepo.findOneQuestLine(dummyQuestline.id);
    
    expect(record).toMatchObject(dummyQuestline);
  });

  test('Should succesfully invalidate questline', async () => {
    const dummyQuestline: IQuestLine = {
      id: 'uuid8',
      title: 'Questline to invalidate',
      description: 'Questline description',
      type: 'practice',
      timecap: '2592000000',
      state: 'invalidated',
      xp: null
    }

    await QuestLineRepo.invalidateQuestLine(dummyQuestline.id);
    const { record } = await QuestLineRepo.findOneQuestLine(dummyQuestline.id);

    expect(record).toMatchObject(dummyQuestline);
  });

  test('Should successfully delete questline', async () => {
    const dummyIdentifier = 'uuid7';
    await QuestLineRepo.deleteQuestline(dummyIdentifier)
    const { records } = await QuestLineRepo.findOneQuestLine(dummyIdentifier);

    expect(records.length).toBe(0)
  });
});