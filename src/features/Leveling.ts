import { UserRepo } from "../repositories/UserRepo";
import { Feats } from "./Feats";
import { IQuest, IQuestline, IStats } from "./interfaces/interfaces";
import { Quest } from "./Quest";
import { Questline } from "./Questline";
import { Records } from "./Records";

export class Leveling {
  public static stats: IStats;
  private static statsTimeline: IStats[];

  public static async init() {
    const user = UserRepo.getUserInfo()

    this.stats = {
      player: user.name,
      level: 0,
      maestria: '',
      xp: 0,
      nextLevelXp: 0,
      lastLevelXp: 0,
      day: new Date(user.startDate),
      todaysHistory: [],
      weekProgress: [
        {status: 0, hours: 0},
        {status: 0, hours: 0},
        {status: 0, hours: 0},
        {status: 0, hours: 0},
        {status: 0, hours: 0},
        {status: 0, hours: 0},
        {status: 0, hours: 0}
      ],
      dayOff: false,
      freeTime: 0,
      debitedHours: 0,
      hashiras: {
        planning: {
          name: 'Planejamento',
          title: 'Noob',
          level: 0,
          score: 0,
          todaysEarnings: 0
        },
        focus: {
          name: 'Foco',
          title: 'Noob',
          level: 0,
          score: 0,
          todaysEarnings: 0
        },
        perseverence: {
          name: 'Perseverança',
          title: 'Noob',
          level: 0,
          score: 0,
          todaysEarnings: 0,
          goal: 0
        }
      }
    };

    await this.eachDay();
  }

  private static async eachDay(yesterday?: Date, timeline?: boolean) {
    if (yesterday) 
      await this.prepareForNewDay(yesterday);
    const today = this.stats.day;
    const todaysFineshedQuests = await Quest.getEveryFinishedQuestOfOneDay(today);
    
    await this.sideEventsOfToday(today);

    for (let index = 0; index < todaysFineshedQuests.length; index++) {
      const quest = todaysFineshedQuests[index];

      const boostXp = quest.type === 'side' ? 0 : await this.calculateQuestBoostXp(quest);
      this.increaseXp(quest.xp + boostXp);
      
      this.stats.todaysHistory.push({
        type: quest.type.charAt(0).toUpperCase()+quest.type.slice(1)+'-quest',
        body: {
          ...quest,
          boostXp
        }
      });
      
      if (quest.type !== 'side')
        this.stats.weekProgress[today.getDay()].hours += this.calculateProductiveHours(quest);

      this.updatePlanningHashira(quest);
      this.updateFocusHashira(quest);
    }

    const todaysFinishedQuestlines = await Questline.getFineshedQuestlinesOfOneDay(today);

    //what if invalidate 2 questlines in one day
    for (let index = 0; index < todaysFinishedQuestlines.length; index++){
      const boostXp = await this.calculateQuestBoostXp(todaysFinishedQuestlines[index]);
      this.increaseXp(todaysFinishedQuestlines[index].xp + boostXp);
      this.stats.todaysHistory.push({
        type: 'Quest Line',
        body: {
          ...todaysFinishedQuestlines[index],
          boostXp
        }
      });

      this.updatePlanningHashiraForQuestline(todaysFinishedQuestlines[index]);
    }

    if (today.toLocaleDateString() === new Date().toLocaleDateString()){
      this.sortTodaysHistory();
      return this.stats;
    }
    else
      return await this.eachDay(today);
  }

  private static async sideEventsOfToday(today: Date) {
    let todaysFeats = (await Feats.getEveryCompleteFeatOfOneDay(today))
      .map(event => ({type: 'Feat', body: event}));
    let todaysRecords = (await Records.getRecordsWithHistoryInOneDay(today))
      .map(event => ({type: 'Record', body: event}));
  
    const sideEventsOfToday = [...todaysFeats, ...todaysRecords];
    this.stats.todaysHistory.push(...sideEventsOfToday);

    const sideEventsXp = sideEventsOfToday.reduce((acc, val) => val.body.xp ? acc+val.body.xp : acc, 0);
    this.increaseXp(sideEventsXp);
  }

  private static sortTodaysHistory() {
    this.stats.todaysHistory = this.stats.todaysHistory.sort((x, y) => {
      if (x.body.finished_at < y.body.finished_at)
        return -1
      else if (x.body.finished_at > y.body.finished_at)
        return +1
      else
        return 0
    });
  }

  private static async prepareForNewDay(yesterday: Date) {
    this.updatePerseverenceHashira(yesterday);

    let today = new Date(yesterday);
    today.setDate(today.getDate() + 1);   

    this.stats.day = today;
    this.stats.todaysHistory = [];
    this.stats.hashiras.planning.todaysEarnings = 0
    this.stats.hashiras.focus.todaysEarnings = 0
    this.stats.hashiras.perseverence.todaysEarnings = 0
    
    if (yesterday.getDay() === 0){
      this.stats.weekProgress = [
        {status: 0, hours: 0},
        {status: 0, hours: 0},
        {status: 0, hours: 0},
        {status: 0, hours: 0},
        {status: 0, hours: 0},
        {status: 0, hours: 0},
        {status: 0, hours: 0}
      ];
      this.stats.dayOff = false;
    }
  }

  private static calculateProductiveHours(quest: IQuest) {
    const questDuration = new Date(quest.finished_at).getTime() - new Date(quest.created_at).getTime();

    return questDuration;
  }

  private static increaseXp(xp: number) {
    this.stats.xp += xp;
    const [level, maestria, nextLevelXp, lastLevelXp] = this.calculateLevel(this.stats.level);
    this.stats.level = level
    this.stats.maestria = maestria
    this.stats.nextLevelXp = nextLevelXp
    this.stats.lastLevelXp = lastLevelXp
  }

  private static calculateLevel(level: number = 0): [number, string, number, number] {
    const lastLevelExpNecessary = Math.pow(4 * (level), 3);
    const nextLevelExpNecessary = Math.pow(4 * (level+1), 3);
    
    if (this.stats.xp >= nextLevelExpNecessary)
      return this.calculateLevel(level+1)
    else if (level < 10)
      return [level, 'Aprendiz', nextLevelExpNecessary, lastLevelExpNecessary]
    else if (level < 20)
      return [level, 'Explorador', nextLevelExpNecessary, lastLevelExpNecessary]
    else if (level < 35)
      return [level, 'Especialista', nextLevelExpNecessary, lastLevelExpNecessary]
    else if (level < 60)
      return [level, 'Mestre', nextLevelExpNecessary, lastLevelExpNecessary]
    else if (level < 100)
      return [level, 'Lenda', nextLevelExpNecessary, lastLevelExpNecessary]
    else if (level >= 100)
      return [level, 'Semi-Deus', nextLevelExpNecessary, lastLevelExpNecessary]
  }

  private static async calculateQuestBoostXp(quest: IQuest|IQuestline) {

    const hashirasBoost = this.calculateHashirasBoost();
    const totalBoost = hashirasBoost;
    
    return ((quest.xp/100) * totalBoost);
  }

  private static calculateHashirasBoost() {
    const planning = this.stats.hashiras.planning.level * 10;
    const focus = this.stats.hashiras.focus.level * 10;
    const perseverence = this.stats.hashiras.perseverence.level * 10;

    return planning + focus + perseverence;
  }

  private static async updatePlanningHashira(quest: any) {
    let todoScore: number, timecapScore: number, planningScore: number;
    const currentScore = this.stats.hashiras.planning.score;

    if (quest.state === 'invalidated'){
      planningScore = -30
    }
    else {
      const questTodos = [];

      const finishedTodosQtd = questTodos.filter(todo => todo.state === 'finished').length;
      const invalidTodosQtd = questTodos.filter(todo => todo.state === 'invalidated').length;
      const invalidTodosRate = Math.round(invalidTodosQtd / finishedTodosQtd * 100);

      if (finishedTodosQtd === 0)
        todoScore = invalidTodosQtd >= 5 ? -10 : -(invalidTodosQtd*2);
      else {
        todoScore = finishedTodosQtd > 5 ? 5 : finishedTodosQtd

        if (invalidTodosRate > 50)
          todoScore = todoScore - (invalidTodosQtd+Math.round(invalidTodosQtd/2));
        
        if (todoScore < -10)
          todoScore = -10;
      }

      const questDuration = new Date(quest.finished_at).getTime() - new Date(quest.created_at).getTime();
      const durationRateOverTimecap = Math.round(questDuration / quest.timecap * 100);

      let timacapScoreReduction = durationRateOverTimecap > 100 ? durationRateOverTimecap - 100 : 100 - durationRateOverTimecap;
          timacapScoreReduction = Math.floor(timacapScoreReduction/10);    
      timecapScore = 5 - timacapScoreReduction;

      planningScore = todoScore + timecapScore;
    }

    let finalScore = planningScore + currentScore
    const [level, title] = await this.definePlanningHashiraLevel(finalScore);    

    this.stats.hashiras.planning.level = level;
    this.stats.hashiras.planning.title = title;
    this.stats.hashiras.planning.score = finalScore;
    this.stats.hashiras.planning.todaysEarnings += planningScore;
  }

  private static async updatePlanningHashiraForQuestline(questline: any) {
    let timecapScore: number, planningScore: number;
    const currentScore = this.stats.hashiras.planning.score;
    
    if (questline.state === 'invalidated')
      planningScore = -30;
    else {
      const questDuration = new Date(questline.finished_at).getTime() - new Date(questline.created_at).getTime();
      const durationRateOverTimecap = Math.round(questDuration / questline.timecap * 100);

      let timacapScoreReduction = durationRateOverTimecap > 100 ? durationRateOverTimecap - 100 : 100 - durationRateOverTimecap;
          timacapScoreReduction = Math.floor(timacapScoreReduction/10);
      timecapScore = 10 - timacapScoreReduction;

      planningScore = timecapScore;
    }

    let finalScore = planningScore + currentScore;
    let [level, title] = await this.definePlanningHashiraLevel(finalScore);

    this.stats.hashiras.planning.level = level;
    this.stats.hashiras.planning.title = title;
    this.stats.hashiras.planning.score = finalScore;
    this.stats.hashiras.planning.todaysEarnings =+ planningScore;
  }

  private static async definePlanningHashiraLevel(finalScore: number): Promise<[number, string]> {
    if ((finalScore >= 1500 && finalScore < 10000)){      
      return [1, 'Jogador'];
    }
    else if ((finalScore >= 10000 && finalScore < 40000)){
      return [2, 'Estrategista'];
    }
    else if ((finalScore >= 40000 && finalScore < 120000)){
      return [3, 'Um passo a frente'];
    }
    else if ((finalScore >= 120000 && finalScore < 250000)){
      return [4, 'Mastermind'];
    }
    else if ((finalScore >= 250000)){
      return [5, 'Profeta'];
    }

    return [0, 'Noob'];
  }

  private static async updateFocusHashira(quest: IQuest) {
    const currentScore = this.stats.hashiras.focus.score;
    let focusScore = quest.focus_score;
    
    if (quest.state === 'invalidated')
      focusScore = -10;
    else if (quest.distraction_score.length > 5)
      focusScore = focusScore - (quest.distraction_score.length*2);
    else
      focusScore = focusScore - quest.distraction_score.length;

    const finalScore = focusScore + currentScore;
    const [level, title] = await this.calculateFocusHashiraLevel(finalScore);

    this.stats.hashiras.focus.level = level;
    this.stats.hashiras.focus.title = title;
    this.stats.hashiras.focus.score = finalScore;
    this.stats.hashiras.focus.todaysEarnings += focusScore
  }

  private static async calculateFocusHashiraLevel(focusScore: number): Promise<[number, string]> {
    if ((focusScore >= 2200 && focusScore < 15000)){      
      return [1, 'Observador'];
    }
    else if ((focusScore >= 15000 && focusScore < 60000)){
      return [2, 'Detalhista'];
    }
    else if ((focusScore >= 60000 && focusScore < 180000)){
      return [3, 'Artista'];
    }
    else if ((focusScore >= 180000 && focusScore < 375000)){
      return [4, 'Flow'];
    }
    else if ((focusScore >= 375000)){
      return [5, 'Perfeito'];
    }

    return [0, 'Noob']
  }

  private static async updatePerseverenceHashira(yesterday: Date) {
    const weekDay = yesterday.getDay();
    const [hoursGoal, weekdaysGoalQtd] = this.perseverenceHashiraGoal(this.stats.hashiras.perseverence.level);
    const weekProgress = this.stats.weekProgress;
    const dayProgress = weekProgress[weekDay].hours;
    const goalBeatenPercentage = Math.floor(dayProgress/hoursGoal * 100);

    if (weekdaysGoalQtd === 6 && weekDay === 6){
      if (goalBeatenPercentage >= 100 && [1,2,3,4,5].every(day => weekProgress[day].hours >= hoursGoal))
        this.stats.dayOff = true;
    }
    
    this.stats.hashiras.perseverence.goal = hoursGoal;
    
    let perseverenceScore = 0;
    if (weekDay === 0 && this.stats.dayOff) {
      this.stats.freeTime += dayProgress
    }else {
      if (goalBeatenPercentage >= 100){
        perseverenceScore += 1;
        this.stats.freeTime += dayProgress - hoursGoal;
        weekProgress[weekDay].status = 2;
      }
      else if (goalBeatenPercentage >= 60){
        perseverenceScore += 0;
        weekProgress[weekDay].status = 1;
      }
      else if (goalBeatenPercentage >= 30){
        perseverenceScore += -1;
        weekProgress[weekDay].status = 3;
      }
      else if (goalBeatenPercentage >= 15){
        perseverenceScore += -2;
        weekProgress[weekDay].status = 3;
      }
      else {
        if (Math.floor(weekProgress[weekDay === 0 ? 6 : weekDay-1].hours/hoursGoal * 100) < 15)
          perseverenceScore += -8;
        else
          perseverenceScore += -4;
        weekProgress[weekDay].status = 3;
      }
    }
    

    if (weekDay === 0) {
      let validWeekDays: number[];
      if (weekdaysGoalQtd === 6 && this.stats.dayOff) {
        validWeekDays = [1,2,3,4,5,6];
        this.stats.hashiras.perseverence.goal = 0;
      }
      else
        validWeekDays = [0,1,2,3,4,5,6];


      if (
        validWeekDays.some(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) < 15) &&
        validWeekDays.filter(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) > 100).length >= (validWeekDays.length - 1)
      )
        perseverenceScore += 0;
      else if (validWeekDays.every(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 100))
        perseverenceScore += 2;
      else if (
        validWeekDays.every(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 60) &&
        validWeekDays.filter(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 100).length >= 3
        )
        perseverenceScore += 1;
      else if (validWeekDays.every(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 60))
        perseverenceScore += 0;
      else if (
        validWeekDays.every(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 30) &&
        validWeekDays.filter(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 60).length >= 3
        )
        perseverenceScore += -1;
      else if (validWeekDays.every(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 30))
        perseverenceScore += -2;
      else if (validWeekDays.every(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 15))
        perseverenceScore += -3
      else if (
        validWeekDays.every(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 0) &&
        validWeekDays.some(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 100)
        )
        perseverenceScore += -4
      else if (
        validWeekDays.every(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 0) &&
        validWeekDays.some(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 60)
        )
        perseverenceScore += -5
      else if (
        validWeekDays.every(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 0) &&
        validWeekDays.some(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 30)
        )
        perseverenceScore += -6
      else if (validWeekDays.every(weekDay => Math.floor(weekProgress[weekDay].hours/hoursGoal * 100) >= 0))
        perseverenceScore += -8
    }

    const finalScore = this.stats.hashiras.perseverence.score + perseverenceScore;
    const [level, title] = this.calculatePerseverenceHashiraLevel(finalScore);    

    this.stats.hashiras.perseverence.level = level;
    this.stats.hashiras.perseverence.title = title;
    this.stats.hashiras.perseverence.score = finalScore;
    this.stats.hashiras.perseverence.todaysEarnings += perseverenceScore;
  }

  private static perseverenceHashiraGoal(level: number) {
    if (level === 0) {
      return [3*3600000,6]
    }
    else if (level === 1) {
      return [6*3600000,6]
    }
    else if (level === 2) {
      return [9*3600000,6]
    }
    else if (level === 3) {
      return [9*3600000,7]
    }
    else if (level === 4) {
      return [11*3600000,7]
    }
  }

  private static calculatePerseverenceHashiraLevel(perseverenceScore: number): [number, string] {
    if (perseverenceScore >= 100 && perseverenceScore < 500){
      return [1, 'Se voce quer, então pegue.'];
    }
    else if (perseverenceScore >= 500 && perseverenceScore < 1000){
      return [2, 'Eu posso fazer isso o dia todo.'];
    }
    else if (perseverenceScore >= 1000 && perseverenceScore < 1500){
      return [3, 'Todo santo dia!'];
    }
    else if (perseverenceScore >= 1500 && perseverenceScore < 2000){
      return [4, 'Obscecado.'];
    }
    else if (perseverenceScore >= 2000){
      return [5, 'Destinado.'];
    }

    return [0, 'Noob'];
  }
}
