export type Priority = "normal" | "high";
export type TodoCategory = "学习" | "求职" | "自媒体" | "生活" | "人际" | "其他";
export type EntropyLevel =
  | "高度低熵"
  | "稳定有序"
  | "轻微混乱"
  | "熵增警告"
  | "严重熵增"
  | "魔头接管";

export type Todo = {
  id: string;
  title: string;
  category: TodoCategory;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  note: string;
  completed: boolean;
  linkedMissionId: string | null;
  missionImpact: number;
  sortOrder: number;
  createdAt: string;
  completedAt?: string;
};

export type Routine = {
  id: string;
  title: string;
  category: string;
  intervalDays: number;
  reminderTime: string;
  lastCompletedAt?: string;
  nextDueAt: string;
  priority: Priority;
  note: string;
  completedToday: boolean;
  linkedBranch?: "exercise";
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  monthlyGoals: string[];
  weeklyGoals: string[];
  linkedTodoIds: string[];
  createdAt: string;
};

export type SleepSettings = {
  stopPhoneTime: string;
  washUpTime: string;
  bedTime: string;
  latestSleepTime: string;
  wakeUpTime: string;
  nightModeDoneDate?: string;
};

export type AppUsage = {
  appName: string;
  usedMinutes: number;
};

export type ScreenTime = {
  totalPhoneLimitMinutes: number;
  entertainmentLimitMinutes: number;
  totalPhoneUsedMinutes: number;
  entertainmentUsedMinutes: number;
  appUsages: AppUsage[];
  lastUpdatedAt: string;
};

export type ThemeName = "cream" | "sage" | "mist" | "rose";

export type ExerciseLog = {
  id: string;
  form: string;
  durationMinutes: number;
  createdAt: string;
};

export type ExerciseState = {
  forms: string[];
  logs: ExerciseLog[];
};

export type DailyReport = {
  date: string;
  entropyScore: number;
  entropyLevel: EntropyLevel;
  completedTodosCount: number;
  unfinishedTodosCount: number;
  overdueTasksCount: number;
  completedRoutinesCount: number;
  missionProgressChanges: string[];
  sleepStatus: string;
  totalPhoneUsedMinutes: number;
  entertainmentUsedMinutes: number;
  phoneOverLimit: boolean;
  entertainmentOverLimit: boolean;
  devilTriggered: boolean;
  summaryText: string;
};

export type AppData = {
  todos: Todo[];
  routines: Routine[];
  missions: Mission[];
  sleep: SleepSettings;
  screenTime: ScreenTime;
  exercise: ExerciseState;
  reports: Record<string, DailyReport>;
  settings: {
    theme: ThemeName;
    entertainmentApps: string[];
    notificationAsked: boolean;
  };
  meta: {
    lastOpenedDate: string;
    devilSnoozedUntil?: string;
  };
};
