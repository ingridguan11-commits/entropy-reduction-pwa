import { AppData, DailyReport, EntropyLevel, Mission, Todo } from "./types";
import { diffDays, timeHasPassed, todayKey } from "./dates";

const LEVEL_COPY: Record<EntropyLevel, string[]> = {
  高度低熵: [
    "局面非常可控，今天你像个冷静的系统管理员。",
    "秩序感上线，混乱势力暂时撤退。",
    "今日状态：优雅地掌控生活。"
  ],
  稳定有序: [
    "今日秩序不错，事情还没有变得太有趣。",
    "你正在把混乱按回它该待的位置。",
    "低熵进度良好，继续保持一点点嚣张。"
  ],
  轻微混乱: [
    "有点乱，但还没塌。先处理一个最小任务。",
    "混乱开始探头，但你还有操作空间。",
    "今日系统略卡，建议清理缓存：完成一个待办。"
  ],
  熵增警告: [
    "事情开始变得有趣起来了。",
    "混乱正在获得优势，但还没赢。",
    "别装没看见，任务已经在角落里繁殖了。"
  ],
  严重熵增: [
    "混乱势力正在扩张，建议立刻镇压一个小任务。",
    "今日状态：任务堆成了小型反派组织。",
    "系统警报：你再不动，明天会更难收拾。"
  ],
  魔头接管: [
    "😈 事情变得有趣起来了。",
    "今日秩序防线基本失守，但还可以从一个小动作开始反攻。",
    "你被混乱偷家了。现在完成一个任务，夺回一点控制权。"
  ]
};

export function getEntropyLevel(score: number): EntropyLevel {
  if (score >= 90) return "高度低熵";
  if (score >= 75) return "稳定有序";
  if (score >= 60) return "轻微混乱";
  if (score >= 40) return "熵增警告";
  if (score >= 20) return "严重熵增";
  return "魔头接管";
}

export function levelCopy(level: EntropyLevel, score: number): string {
  const copy = LEVEL_COPY[level];
  return copy[Math.abs(score) % copy.length];
}

export function missionProgress(mission: Mission, todos: Todo[]): number {
  const linked = todos.filter((todo) => todo.linkedMissionId === mission.id);
  if (!linked.length) return 0;
  const totalImpact = linked.reduce((sum, todo) => sum + Math.max(1, todo.missionImpact), 0);
  const doneImpact = linked
    .filter((todo) => todo.completed)
    .reduce((sum, todo) => sum + Math.max(1, todo.missionImpact), 0);
  return Math.round((doneImpact / totalImpact) * 100);
}

export function calculateEntropy(data: AppData, date = todayKey()) {
  let score = 100;
  const todos = data.todos;
  const todayTodos = todos.filter((todo) => todo.dueDate === date && !todo.completed);
  const overdueTodos = todos.filter((todo) => todo.dueDate < date && !todo.completed);
  const completedToday = todos.filter((todo) => todo.completedAt?.slice(0, 10) === date);
  const dueRoutines = data.routines.filter((routine) => routine.nextDueAt <= date && !routine.completedToday);
  const overdueRoutines = dueRoutines.filter((routine) => routine.nextDueAt < date);
  const routineOverTwoDays = overdueRoutines.filter((routine) => diffDays(date, routine.nextDueAt) > 2);
  const phoneOverLimit = data.screenTime.totalPhoneUsedMinutes > data.screenTime.totalPhoneLimitMinutes;
  const entertainmentOverLimit =
    data.screenTime.entertainmentUsedMinutes > data.screenTime.entertainmentLimitMinutes;
  const sleepLate = date === todayKey() && timeHasPassed(data.sleep.latestSleepTime);
  const nightModeDone = data.sleep.nightModeDoneDate === date;

  score -= overdueTodos.length * 10;
  score -= overdueRoutines.length * 10;
  score -= todayTodos.filter((todo) => todo.priority === "high").length * 8;
  score -= todayTodos.filter((todo) => todo.priority !== "high").length * 4;
  if (!completedToday.length) score -= 20;
  if (sleepLate && !nightModeDone) score -= 15;
  if (phoneOverLimit) score -= 10;
  if (entertainmentOverLimit) score -= 10;
  score -= routineOverTwoDays.length * 5;

  completedToday.forEach((todo) => {
    score += todo.priority === "high" ? 5 : 3;
    if (todo.linkedMissionId) score += 6;
  });
  if (nightModeDone) score += 5;
  if (data.screenTime.totalPhoneUsedMinutes < data.screenTime.totalPhoneLimitMinutes) score += 5;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  const level = getEntropyLevel(finalScore);

  return {
    score: finalScore,
    level,
    copy: levelCopy(level, finalScore),
    todayTodos,
    overdueTodos,
    dueRoutines,
    overdueRoutines,
    completedToday,
    phoneOverLimit,
    entertainmentOverLimit,
    sleepLate,
    devilTriggered: shouldTriggerDevil(data, date)
  };
}

export function shouldTriggerDevil(data: AppData, date = todayKey()): boolean {
  if (date !== todayKey()) return false;
  const snoozed = data.meta.devilSnoozedUntil;
  if (snoozed && new Date(snoozed).getTime() > Date.now()) return false;
  const completedToday = data.todos.some((todo) => todo.completedAt?.slice(0, 10) === date);
  return timeHasPassed("16:00") && !completedToday;
}

export function generateReport(data: AppData, date = todayKey()): DailyReport {
  const entropy = calculateEntropy(data, date);
  const completedTodos = data.todos.filter((todo) => todo.completedAt?.slice(0, 10) === date);
  const unfinishedTodos = data.todos.filter((todo) => todo.dueDate === date && !todo.completed);
  const overdueTodos = data.todos.filter((todo) => todo.dueDate < date && !todo.completed);
  const completedRoutines = data.routines.filter(
    (routine) => routine.lastCompletedAt?.slice(0, 10) === date
  );
  const missionProgressChanges = data.missions.map((mission) => {
    const progress = missionProgress(mission, data.todos);
    return `${mission.title} 推进到 ${progress}%`;
  });
  const phoneText = entropy.phoneOverLimit
    ? "今日最大熵增来源：手机使用超时。算法赢了一局，但战争还没结束。"
    : "手机使用尚未失控，注意力阵地还在。";
  const completedText = completedTodos.length
    ? `今天完成了 ${completedTodos.length} 个任务，混乱势力被迫后退三步。`
    : "今日任务处理一般，但现在开始还不算太晚。";

  return {
    date,
    entropyScore: entropy.score,
    entropyLevel: entropy.level,
    completedTodosCount: completedTodos.length,
    unfinishedTodosCount: unfinishedTodos.length,
    overdueTasksCount: overdueTodos.length + entropy.overdueRoutines.length,
    completedRoutinesCount: completedRoutines.length,
    missionProgressChanges,
    sleepStatus: data.sleep.nightModeDoneDate === date ? "已进入夜间低熵模式" : "夜间低熵模式待启动",
    totalPhoneUsedMinutes: data.screenTime.totalPhoneUsedMinutes,
    entertainmentUsedMinutes: data.screenTime.entertainmentUsedMinutes,
    phoneOverLimit: entropy.phoneOverLimit,
    entertainmentOverLimit: entropy.entertainmentOverLimit,
    devilTriggered: entropy.devilTriggered,
    summaryText: `${completedText} ${phoneText}`
  };
}
