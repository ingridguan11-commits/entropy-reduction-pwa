import { AppData } from "./types";
import { addDays, todayKey } from "./dates";

export function createInitialData(): AppData {
  const today = todayKey();
  const now = new Date().toISOString();
  const missions = [
    {
      id: "mission_internship",
      title: "找到理想实习",
      description: "简历、投递、面试，一路把求职副本打穿。",
      startDate: today,
      endDate: addDays(today, 60),
      progress: 0,
      monthlyGoals: ["完成简历和作品集", "稳定投递并复盘面试"],
      weeklyGoals: ["修改一版简历", "投递 10 个岗位"],
      linkedTodoIds: ["todo_resume", "todo_apply"],
      createdAt: now
    },
    {
      id: "mission_media",
      title: "做好小红书 AI 自媒体",
      description: "把灵感从收藏夹里救出来，变成真正发布的内容。",
      startDate: today,
      endDate: addDays(today, 90),
      progress: 0,
      monthlyGoals: ["确定内容栏目", "发布 20 条笔记"],
      weeklyGoals: ["写 3 条脚本", "发布 2 条内容"],
      linkedTodoIds: ["todo_script"],
      createdAt: now
    },
    {
      id: "mission_order",
      title: "建立秩序生活",
      description: "从作息、桌面、屏幕时间开始，把生活重新纳入掌控。",
      startDate: today,
      endDate: addDays(today, 45),
      progress: 0,
      monthlyGoals: ["建立稳定睡前流程", "降低娱乐软件时间"],
      weeklyGoals: ["三天 23:30 前停止刷手机"],
      linkedTodoIds: ["todo_phone"],
      createdAt: now
    }
  ];

  return {
    todos: [
      {
        id: "todo_resume",
        title: "修改简历项目经历",
        category: "求职",
        dueDate: today,
        dueTime: "10:30",
        priority: "high",
        note: "重点补充项目结果和数据。",
        completed: false,
        linkedMissionId: "mission_internship",
        missionImpact: 5,
        sortOrder: 1,
        createdAt: now
      },
      {
        id: "todo_apply",
        title: "投递 3 个市场岗位",
        category: "求职",
        dueDate: today,
        dueTime: "15:00",
        priority: "normal",
        note: "不要只收藏，投出去才算进度。",
        completed: false,
        linkedMissionId: "mission_internship",
        missionImpact: 5,
        sortOrder: 2,
        createdAt: now
      },
      {
        id: "todo_script",
        title: "写一条 AI 主题小红书口播稿",
        category: "自媒体",
        dueDate: today,
        dueTime: "18:30",
        priority: "normal",
        note: "标题要像会偷偷涨粉的那种。",
        completed: false,
        linkedMissionId: "mission_media",
        missionImpact: 3,
        sortOrder: 3,
        createdAt: now
      },
      {
        id: "todo_phone",
        title: "晚上 23:30 前停止刷手机",
        category: "生活",
        dueDate: today,
        dueTime: "23:30",
        priority: "high",
        note: "不要和短视频谈判。",
        completed: false,
        linkedMissionId: "mission_order",
        missionImpact: 3,
        sortOrder: 4,
        createdAt: now
      }
    ],
    routines: [
      {
        id: "routine_laundry",
        title: "洗衣服",
        category: "生活",
        intervalDays: 3,
        reminderTime: "20:30",
        lastCompletedAt: addDays(today, -3),
        nextDueAt: today,
        priority: "normal",
        note: "衣服堆积正在制造混乱。现在处理，今晚低熵。",
        completedToday: false
      },
      {
        id: "routine_room",
        title: "清洁房间",
        category: "生活",
        intervalDays: 7,
        reminderTime: "16:00",
        lastCompletedAt: addDays(today, -8),
        nextDueAt: addDays(today, -1),
        priority: "high",
        note: "房间不是自己乱的，但它会自己继续乱下去。",
        completedToday: false
      },
      {
        id: "routine_desk",
        title: "整理书桌",
        category: "生活",
        intervalDays: 1,
        reminderTime: "22:30",
        lastCompletedAt: addDays(today, -1),
        nextDueAt: today,
        priority: "normal",
        note: "桌面混乱度上升，建议立即镇压。",
        completedToday: false
      },
      {
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
      }
    ],
    missions,
    sleep: {
      stopPhoneTime: "23:00",
      washUpTime: "23:15",
      bedTime: "23:30",
      latestSleepTime: "23:45",
      wakeUpTime: "07:30"
    },
    screenTime: {
      totalPhoneLimitMinutes: 360,
      entertainmentLimitMinutes: 180,
      totalPhoneUsedMinutes: 245,
      entertainmentUsedMinutes: 118,
      appUsages: [
        { appName: "豆瓣", usedMinutes: 18 },
        { appName: "小红书", usedMinutes: 42 },
        { appName: "抖音", usedMinutes: 30 },
        { appName: "B站", usedMinutes: 21 },
        { appName: "微博", usedMinutes: 7 }
      ],
      lastUpdatedAt: now
    },
    exercise: {
      forms: ["散步", "羽毛球", "瑜伽", "跑步", "力量训练", "骑行"],
      logs: [
        {
          id: "exercise_walk",
          form: "散步",
          durationMinutes: 20,
          createdAt: now
        }
      ]
    },
    reports: {},
    settings: {
      theme: "cream",
      entertainmentApps: ["豆瓣", "小红书", "抖音", "B站", "微博"],
      notificationAsked: false
    },
    meta: {
      lastOpenedDate: today
    }
  };
}
