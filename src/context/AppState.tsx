"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { calculateEntropy, generateReport, missionProgress } from "@/lib/entropy";
import { addDays, formatDate, todayKey, uid } from "@/lib/dates";
import { createInitialData } from "@/lib/seed";
import {
  AppData,
  DailyReport,
  ExerciseLog,
  Mission,
  Routine,
  ScreenTime,
  SleepSettings,
  ThemeName,
  Todo
} from "@/lib/types";
import type { DevilState } from "@/components/LowEntropyImp";

const STORAGE_KEY = "entropy-reduction-data-v1";

type Notice = {
  title: string;
  body: string;
  devilState?: DevilState;
};

type AppContextValue = {
  data: AppData;
  notice?: Notice;
  setNotice: (notice?: Notice) => void;
  entropy: ReturnType<typeof calculateEntropy>;
  reportFor: (date: string) => DailyReport;
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "completed" | "completedAt">) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  reorderTodos: (orderedIds: string[]) => void;
  addRoutine: (routine: Omit<Routine, "id" | "completedToday">) => void;
  updateRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  completeRoutine: (id: string) => void;
  addMission: (mission: Omit<Mission, "id" | "createdAt" | "progress" | "linkedTodoIds">) => boolean;
  updateMission: (mission: Mission) => void;
  deleteMission: (id: string) => void;
  updateSleep: (sleep: SleepSettings) => void;
  markNightMode: () => void;
  updateScreenTime: (screenTime: ScreenTime) => void;
  addExerciseLog: (log: Omit<ExerciseLog, "id" | "createdAt">) => void;
  addExerciseForm: (form: string) => void;
  updateTheme: (theme: ThemeName) => void;
  updateEntertainmentApps: (apps: string[]) => void;
  exportData: () => string;
  clearData: () => void;
  requestNotifications: () => Promise<void>;
  snoozeDevil: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function normalizeMissionImpact(value: number): number {
  if (!Number.isFinite(value)) return 3;
  if (value <= 1) return 1;
  if (value <= 3) return 3;
  if (value <= 5) return 5;
  return 10;
}

function normalizeTodo(todo: Todo): Todo {
  return {
    ...todo,
    linkedMissionId: todo.linkedMissionId ?? null,
    missionImpact: normalizeMissionImpact(todo.missionImpact),
    sortOrder: Number.isFinite(todo.sortOrder) ? todo.sortOrder : new Date(todo.createdAt).getTime()
  };
}

function exerciseRoutine(): Routine {
  const today = todayKey();
  return {
    id: "routine_exercise",
    title: "运动",
    category: "运动支线",
    intervalDays: 2,
    reminderTime: "19:30",
    lastCompletedAt: addDays(today, -2),
    nextDueAt: today,
    priority: "normal",
    note: "体能条需要维护。提高武力值，也是对抗混乱势力的必要前提。",
    completedToday: false,
    linkedBranch: "exercise"
  };
}

function syncMissions(data: AppData): AppData {
  const todos = data.todos.map(normalizeTodo);
  const routines = data.routines.some((routine) => routine.id === "routine_exercise")
    ? data.routines.map((routine) =>
        routine.id === "routine_exercise" ? { ...routine, category: "运动支线", linkedBranch: "exercise" as const } : routine
      )
    : [...data.routines, exerciseRoutine()];
  const exercise = {
    forms: data.exercise?.forms?.length
      ? Array.from(new Set(data.exercise.forms))
      : ["散步", "羽毛球", "瑜伽", "跑步", "力量训练", "骑行"],
    logs: data.exercise?.logs ?? []
  };
  const missions = data.missions.map((mission) => {
    const linkedTodoIds = todos
      .filter((todo) => todo.linkedMissionId === mission.id)
      .map((todo) => todo.id);
    return {
      ...mission,
      linkedTodoIds,
      progress: missionProgress({ ...mission, linkedTodoIds }, todos)
    };
  });
  return { ...data, todos, routines, missions, exercise };
}

function normalizeForToday(data: AppData): AppData {
  const today = todayKey();
  if (data.meta.lastOpenedDate === today) {
    return syncMissions(data);
  }

  const previousDate = data.meta.lastOpenedDate;
  const reports = previousDate
    ? { ...data.reports, [previousDate]: generateReport(data, previousDate) }
    : data.reports;

  return syncMissions({
    ...data,
    reports,
    routines: data.routines.map((routine) => ({
      ...routine,
      completedToday: routine.lastCompletedAt?.slice(0, 10) === today
    })),
    screenTime: {
      ...data.screenTime,
      totalPhoneUsedMinutes: 0,
      entertainmentUsedMinutes: 0,
      appUsages: data.screenTime.appUsages.map((app) => ({ ...app, usedMinutes: 0 })),
      lastUpdatedAt: new Date().toISOString()
    },
    meta: {
      ...data.meta,
      lastOpenedDate: today,
      devilSnoozedUntil: undefined
    }
  });
}

function notifyUser(title: string, body: string) {
  if (typeof window === "undefined") return;
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/icon.svg" });
  }
}

export function AppProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<AppData>(() => createInitialData());
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState<Notice | undefined>();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const initial = raw ? (JSON.parse(raw) as AppData) : createInitialData();
    setData(normalizeForToday(initial));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const next = syncMissions({
      ...data,
      reports: {
        ...data.reports,
        [todayKey()]: generateReport(data, todayKey())
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [data, loaded]);

  const updateData = useCallback((updater: (current: AppData) => AppData) => {
    setData((current) => syncMissions(updater(current)));
  }, []);

  const showReminder = useCallback((key: string, title: string, body: string, devilState: DevilState = "devil-peek") => {
    const storageKey = `entropy-reminded-${todayKey()}-${key}`;
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
    setNotice({ title, body, devilState });
    notifyUser(title, body);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const checkReminders = () => {
      const now = new Date();
      const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      data.routines.forEach((routine) => {
        if (routine.nextDueAt <= todayKey() && !routine.completedToday && routine.reminderTime <= current) {
          showReminder(`routine-${routine.id}`, routine.title, routine.note, "devil-peek");
        }
      });

      type SleepTimeField = "stopPhoneTime" | "washUpTime" | "bedTime" | "latestSleepTime";
      const sleepMessages: Array<[SleepTimeField, string, string]> = [
        ["stopPhoneTime", "低熵夜间模式启动。", "不要和短视频谈判。"],
        ["washUpTime", "系统建议：现在去洗漱。", "别让混乱续杯。"],
        ["bedTime", "我申请加入睡个好教💤", "现在上床，明天少一点崩盘风险。"],
        ["latestSleepTime", "最晚睡觉时间到了。", "再刷下去，明天的你会发起投诉。"]
      ];
      sleepMessages.forEach(([field, title, body]) => {
        if (data.sleep[field] <= current && data.sleep.nightModeDoneDate !== todayKey()) {
          showReminder(`sleep-${field}`, title, body, field === "latestSleepTime" ? "devil-smile" : "devil-stable");
        }
      });

      if (data.screenTime.totalPhoneUsedMinutes >= data.screenTime.totalPhoneLimitMinutes) {
        showReminder(
          "phone-limit",
          "屏幕时间额度耗尽",
          "手机使用已达 6 小时。再刷下去，现实世界要开始掉帧了。",
          "devil-chaos"
        );
      }
      if (data.screenTime.entertainmentUsedMinutes >= data.screenTime.entertainmentLimitMinutes) {
        showReminder(
          "entertainment-limit",
          "娱乐额度已满",
          "快乐不是问题，被算法收编才是。继续刷将进入熵增副本。",
          "devil-chaos"
        );
      }
    };

    checkReminders();
    const timer = window.setInterval(checkReminders, 30000);
    return () => window.clearInterval(timer);
  }, [data, loaded, showReminder]);

  const value = useMemo<AppContextValue>(() => {
    const entropy = calculateEntropy(data);

    return {
      data,
      notice,
      setNotice,
      entropy,
      reportFor: (date) => data.reports[date] ?? generateReport(data, date),
      addTodo: (todo) =>
        updateData((current) => ({
          ...current,
          todos: [
            ...current.todos,
            normalizeTodo({
              ...todo,
              id: uid("todo"),
              createdAt: new Date().toISOString(),
              completed: false
            })
          ]
        })),
      updateTodo: (todo) =>
        updateData((current) => ({
          ...current,
          todos: current.todos.map((item) => (item.id === todo.id ? normalizeTodo(todo) : item))
        })),
      deleteTodo: (id) =>
        updateData((current) => ({ ...current, todos: current.todos.filter((todo) => todo.id !== id) })),
      reorderTodos: (orderedIds) =>
        updateData((current) => {
          const orderMap = new Map(orderedIds.map((id, index) => [id, index + 1]));
          return {
            ...current,
            todos: current.todos.map((todo) =>
              orderMap.has(todo.id) ? { ...todo, sortOrder: orderMap.get(todo.id) ?? todo.sortOrder } : todo
            )
          };
        }),
      toggleTodo: (id) => {
        const todo = data.todos.find((item) => item.id === id);
        if (todo && !todo.completed) {
          setNotice({
            title: todo.linkedMissionId ? "主线节点已推进" : "任务已镇压",
            body: todo.linkedMissionId
              ? `贡献值 +${todo.missionImpact}。局面开始可控，混乱势力被迫后退。`
              : "很好，系统缓存少了一块。混乱势力暂时失去一个据点。",
            devilState: todo.linkedMissionId ? "devil-stable" : "devil-calm"
          });
        }
        updateData((current) => ({
          ...current,
          todos: current.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  completed: !todo.completed,
                  completedAt: todo.completed ? undefined : new Date().toISOString()
                }
              : todo
          )
        }));
      },
      addRoutine: (routine) =>
        updateData((current) => ({
          ...current,
          routines: [...current.routines, { ...routine, id: uid("routine"), completedToday: false }]
        })),
      updateRoutine: (routine) =>
        updateData((current) => ({
          ...current,
          routines: current.routines.map((item) => (item.id === routine.id ? routine : item))
        })),
      deleteRoutine: (id) =>
        updateData((current) => ({
          ...current,
          routines: current.routines.filter((routine) => routine.id !== id)
        })),
      completeRoutine: (id) => {
        const routine = data.routines.find((item) => item.id === id);
        if (routine && !routine.completedToday) {
          setNotice({
            title: "周期任务已镇压",
            body: `${routine.title} 已处理。任务副本少一个，系统稳定性回升。`,
            devilState: "devil-stable"
          });
        }
        updateData((current) => ({
          ...current,
          routines: current.routines.map((routine) =>
            routine.id === id
              ? {
                  ...routine,
                  completedToday: true,
                  lastCompletedAt: new Date().toISOString(),
                  nextDueAt: addDays(todayKey(), routine.intervalDays)
                }
              : routine
          )
        }));
      },
      addMission: (mission) => {
        if (data.missions.length >= 3) return false;
        updateData((current) => ({
          ...current,
          missions: [
            ...current.missions,
            {
              ...mission,
              id: uid("mission"),
              createdAt: new Date().toISOString(),
              progress: 0,
              linkedTodoIds: []
            }
          ]
        }));
        return true;
      },
      updateMission: (mission) =>
        updateData((current) => ({
          ...current,
          missions: current.missions.map((item) => (item.id === mission.id ? mission : item))
        })),
      deleteMission: (id) =>
        updateData((current) => ({
          ...current,
          missions: current.missions.filter((mission) => mission.id !== id),
          todos: current.todos.map((todo) =>
            todo.linkedMissionId === id ? { ...todo, linkedMissionId: null } : todo
          )
        })),
      updateSleep: (sleep) => updateData((current) => ({ ...current, sleep })),
      markNightMode: () =>
        updateData((current) => ({
          ...current,
          sleep: { ...current.sleep, nightModeDoneDate: todayKey() }
        })),
      updateScreenTime: (screenTime) =>
        updateData((current) => ({
          ...current,
          screenTime: { ...screenTime, lastUpdatedAt: new Date().toISOString() }
        })),
      addExerciseLog: (log) =>
        updateData((current) => ({
          ...current,
          exercise: {
            forms: (current.exercise?.forms ?? ["散步", "羽毛球", "瑜伽", "跑步", "力量训练", "骑行"]).includes(log.form)
              ? current.exercise?.forms ?? ["散步", "羽毛球", "瑜伽", "跑步", "力量训练", "骑行"]
              : [...(current.exercise?.forms ?? ["散步", "羽毛球", "瑜伽", "跑步", "力量训练", "骑行"]), log.form],
            logs: [
              {
                ...log,
                id: uid("exercise"),
                createdAt: new Date().toISOString()
              },
              ...(current.exercise?.logs ?? [])
            ]
          }
        })),
      addExerciseForm: (form) =>
        updateData((current) => {
          const name = form.trim();
          const forms = current.exercise?.forms ?? ["散步", "羽毛球", "瑜伽", "跑步", "力量训练", "骑行"];
          if (!name || forms.includes(name)) return current;
          return {
            ...current,
            exercise: {
              forms: [...forms, name],
              logs: current.exercise?.logs ?? []
            }
          };
        }),
      updateTheme: (theme) =>
        updateData((current) => ({
          ...current,
          settings: { ...current.settings, theme }
        })),
      updateEntertainmentApps: (apps) =>
        updateData((current) => ({
          ...current,
          settings: { ...current.settings, entertainmentApps: apps },
          screenTime: {
            ...current.screenTime,
            entertainmentUsedMinutes: current.screenTime.appUsages
              .filter((app) => apps.includes(app.appName))
              .reduce((sum, app) => sum + app.usedMinutes, 0)
          }
        })),
      exportData: () => JSON.stringify(data, null, 2),
      clearData: () => {
        const fresh = createInitialData();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        setData(fresh);
      },
      requestNotifications: async () => {
        if ("Notification" in window) {
          await Notification.requestPermission();
        }
        updateData((current) => ({
          ...current,
          settings: { ...current.settings, notificationAsked: true }
        }));
      },
      snoozeDevil: () =>
        updateData((current) => ({
          ...current,
          meta: {
            ...current.meta,
            devilSnoozedUntil: new Date(Date.now() + 5 * 60 * 1000).toISOString()
          }
        }))
    };
  }, [data, notice, updateData]);

  return (
    <AppContext.Provider value={value}>
      <div data-theme={data.settings.theme}>{children}</div>
    </AppContext.Provider>
  );
}

export function useAppState() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useAppState must be used inside AppProvider");
  }
  return value;
}

export function blankTodo(overrides: Partial<Todo> = {}): Todo {
  const today = todayKey();
  return {
    id: uid("draft"),
    title: "",
    category: "生活",
    dueDate: today,
    dueTime: "18:00",
    priority: "normal",
    note: "",
    completed: false,
    linkedMissionId: null,
    missionImpact: 3,
    sortOrder: Date.now(),
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

export function blankRoutine(overrides: Partial<Routine> = {}): Routine {
  const today = todayKey();
  return {
    id: uid("draft"),
    title: "",
    category: "生活",
    intervalDays: 3,
    reminderTime: "20:30",
    nextDueAt: formatDate(new Date()),
    priority: "normal",
    note: "",
    completedToday: false,
    ...overrides
  };
}
