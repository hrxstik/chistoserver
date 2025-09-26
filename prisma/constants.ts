import {
  Achievement,
  AchievementType,
  RoomType,
  Task,
  TaskType,
} from '@prisma/client';

export const achievements: Achievement[] = [
  {
    id: 1,
    name: 'Упорный',
    levels: [1, 2, 3],
    type: AchievementType.STREAK,
    values: [7, 28, 90],
  },
  {
    id: 2,
    name: 'Фермер чубриков',
    levels: [1, 2, 3],
    type: AchievementType.CHUBRIKS_GROWN,
    values: [1, 3, 5],
  },
  {
    id: 3,
    name: 'Ухажер за чубриком',
    levels: [1, 2, 3],
    type: AchievementType.CHUBRIK_PHASE_REACHED,
    values: [2, 3, 4],
  },
  {
    id: 4,
    name: 'Обидчик чубриков',
    levels: [1, 2, 3],
    type: AchievementType.CHUBRIKS_GONE,
    values: [10, 20, 30],
  },
];

export const tasks: Task[] = [
  {
    id: 1,
    type: TaskType.HORIZONTAL_SURFACES_WET_CLEANING,
    room: RoomType.KITCHEN,
    description: 'Протереть столы на кухне влажной тряпкой',
  },
  {
    id: 2,
    type: TaskType.VERTICAL_SURFACES_WET_CLEANING,
    room: RoomType.KITCHEN,
    description:
      'Протереть стены и вертикальные поверхности на кухне влажной тряпкой',
  },
  {
    id: 3,
    type: TaskType.HORIZONTAL_SURFACES_VACUUMING,
    room: RoomType.EVERYWHERE,
    description: 'Пропылесосить полы',
  },
  {
    id: 4,
    type: TaskType.HORIZONTAL_SURFACES_VACUUMING,
    room: RoomType.EVERYWHERE,
    description: 'Пропылесосить ковры',
  },
  {
    id: 5,
    type: TaskType.DISHWASHING,
    room: RoomType.KITCHEN,
    description: 'Помыть грязную посуду',
  },
  {
    id: 6,
    type: TaskType.HORIZONTAL_SURFACES_WET_CLEANING,
    room: RoomType.LIVING_ROOM,
    description: 'Протереть столы в зале влажной тряпкой',
  },
  {
    id: 7,
    type: TaskType.VERTICAL_SURFACES_WET_CLEANING,
    room: RoomType.EVERYWHERE,
    description: 'Протереть дверные ручки и выключатели',
  },
  {
    id: 8,
    type: TaskType.HORIZONTAL_SURFACES_WET_CLEANING,
    room: RoomType.EVERYWHERE,
    description: 'Помыть полы',
  },
  {
    id: 9,
    type: TaskType.LAUNDRY,
    room: RoomType.GENERAL,
    description: 'Постирать и развесить одежду',
  },
  {
    id: 10,
    type: TaskType.DISHWASHING,
    room: RoomType.KITCHEN,
    description: 'Почистить раковину',
  },
  {
    id: 11,
    type: TaskType.HORIZONTAL_SURFACES_WET_CLEANING,
    room: RoomType.EVERYWHERE,
    description: 'Вымыть подоконники влажной тряпкой',
  },
  {
    id: 12,
    type: TaskType.VERTICAL_SURFACES_WET_CLEANING,
    room: RoomType.EVERYWHERE,
    description: 'Протереть зеркала и стеклянные поверхности',
  },
  {
    id: 13,
    type: TaskType.HORIZONTAL_SURFACES_VACUUMING,
    room: RoomType.LIVING_ROOM,
    description: 'Пропылесосить мебель и кресла',
  },
  {
    id: 14,
    type: TaskType.FURNITURE,
    room: RoomType.KITCHEN,
    description: 'Почистить микроволновку и плиту',
  },
  {
    id: 15,
    type: TaskType.HORIZONTAL_SURFACES_WET_CLEANING,
    room: RoomType.EVERYWHERE,
    description: 'Протереть полки и шкафы',
  },
  {
    id: 16,
    type: TaskType.VERTICAL_SURFACES_WET_CLEANING,
    room: RoomType.EVERYWHERE,
    description: 'Помыть окна и рамы',
  },
  {
    id: 17,
    type: TaskType.FURNITURE,
    room: RoomType.BEDROOM,
    description: 'Поменять постельное белье',
  },
  {
    id: 18,
    type: TaskType.FURNITURE,
    room: RoomType.BATHROOM,
    description: 'Вымыть ванну/душевую кабинку',
  },
  {
    id: 19,
    type: TaskType.FURNITURE,
    room: RoomType.BATHROOM,
    description: 'Вымыть раковину в ванной',
  },
  {
    id: 20,
    type: TaskType.FURNITURE,
    room: RoomType.BATHROOM,
    description: 'Вымыть унитаз',
  },
  {
    id: 21,
    type: TaskType.HORIZONTAL_SURFACES_WET_CLEANING,
    room: RoomType.OFFICE,
    description: 'Протереть рабочее место влажной тряпкой',
  },
  {
    id: 22,
    type: TaskType.HORIZONTAL_SURFACES_VACUUMING,
    room: RoomType.OFFICE,
    description: 'Пропылесосить рабочее место',
  },
  {
    id: 23,
    type: TaskType.FURNITURE,
    room: RoomType.GARAGE,
    description: 'Помыть машину',
  },
  {
    id: 24,
    type: TaskType.WASTE_DISPOSING,
    room: RoomType.GENERAL,
    description: 'Выбросить мусор',
  },
  {
    id: 25,
    type: TaskType.HORIZONTAL_SURFACES_WET_CLEANING,
    room: RoomType.EVERYWHERE,
    description: 'Протереть электронику',
  },
];
