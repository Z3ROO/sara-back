import { QuestTodos } from "./QuestTodosRepo";

describe('Quest To-dos', () => {
  test('Should successfully retrieve one todo.', async () => {
    const dummyTodo = {
      id: 'todoId-01',
      quest_id: 'uuid9',
      description: 'Descrição de afazer',
    }
    const { record } = await QuestTodos.findOneQuestTodo(dummyTodo.id);

    expect(record).toMatchObject(dummyTodo);
  });

  test('Should successfully retrieve all todos of a specified quest.', async () => {
    const dummyQuestIdentifier = 'uuid9'
    const dummyTodoBodyPart = {
      quest_id: dummyQuestIdentifier,
      description: 'Descrição de afazer',
    };
    const { records } = await QuestTodos.findAllQuestTodos(dummyQuestIdentifier);

    expect(records.length).toBeGreaterThanOrEqual(3);
    records.forEach((record) => {
      expect(record).toMatchObject(dummyTodoBodyPart);
    });
  });

  test('Should successfully retrieve all finished todos.', async () => {
    const dummyTodoBodyPart = {
      description: 'Descrição de afazer'
    }

    const { records } = await QuestTodos.findAllFinishedTodos();

    expect(records.length).toBeGreaterThanOrEqual(3);
    records.forEach((record) => {
      expect(record).toMatchObject(dummyTodoBodyPart);
    })
  });

  test('Should successfully create batch of todos.', async () => {
    const dummyQuestIdentifier = 'uuid10';
    const dummyBatchOfTodos = [
      'Descrição de afazer',
      'Descrição de afazer',
      'Descrição de afazer'
    ];
    const dummyTodoBodyPart = {
      description: 'Descrição de afazer'
    }
    await QuestTodos.createBatchOFTodos(dummyQuestIdentifier, dummyBatchOfTodos);
    const { records } = await QuestTodos.findAllQuestTodos(dummyQuestIdentifier);

    expect(records.length).toBeGreaterThanOrEqual(3);
    records.forEach((record) => {
      expect(record).toMatchObject(dummyTodoBodyPart)
    });
  });

  test('Should successfully invalidate to-do.', async () => {
    const dummyQuestIdentifier = 'uuid10';
    const dummyTodoIdentifier = 'todoId-06';
    await QuestTodos.invalidateQuestTodo(dummyQuestIdentifier, dummyTodoIdentifier);
    const { record } = await QuestTodos.findOneQuestTodo(dummyTodoIdentifier)

    expect(record.state).toBe('invalidated')
  });

  test('Should successfully finish to-do.', async () => {
    const dummyQuestIdentifier = 'uuid10';
    const dummyTodoIdentifier = 'todoId-05';
    await QuestTodos.finishQuestTodo(dummyQuestIdentifier, dummyTodoIdentifier);
    const { record } = await QuestTodos.findOneQuestTodo(dummyTodoIdentifier);

    const todaysDate = new Date().toLocaleDateString('sv');

    expect(record.state).toBe('finished');
    expect(new Date(record.finished_at).toLocaleDateString('sv')).toContain(todaysDate);
  });
})