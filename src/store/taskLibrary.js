/**
 * Task Library — full catalog of available routine tasks. Each task has a
 * unique key, display label, emoji, SVG asset group, default duration,
 * and the routine types it appears in by default.
 */

export const TASK_LIBRARY = [
  // ── Hygiene & Self-care ──
  { key: 'brush_teeth',        label: 'Brush Teeth',              emoji: '🦷',  svgGroup: 'toothbrush',  defaultMinutes: 2,  routines: ['morning', 'bedtime'] },
  { key: 'wash_face',          label: 'Wash Face',                emoji: '🧼',  svgGroup: 'soap',        defaultMinutes: 2,  routines: ['morning'] },
  { key: 'bath_shower',        label: 'Bath or Shower',           emoji: '🛁',  svgGroup: 'soap',        defaultMinutes: 10, routines: ['bedtime'] },
  { key: 'brush_hair',         label: 'Brush Hair',               emoji: '👩‍🦱', svgGroup: 'hairbrush',   defaultMinutes: 2,  routines: ['morning'] },
  { key: 'go_potty',           label: 'Go Potty',                 emoji: '🧻',  svgGroup: 'toilet-roll', defaultMinutes: 2,  routines: ['morning', 'bedtime'] },

  // ── Dressing ──
  { key: 'get_dressed',        label: 'Get Dressed',              emoji: '👕',  svgGroup: 'clothes',     defaultMinutes: 5,  routines: ['morning'] },
  { key: 'put_on_pyjamas',     label: 'Put on Pajamas',           emoji: '👕',  svgGroup: 'clothes',     defaultMinutes: 2,  routines: ['bedtime'] },
  { key: 'put_on_shoes',       label: 'Put on Shoes',             emoji: '👟',  svgGroup: 'shoe',        defaultMinutes: 2,  routines: ['morning'] },

  // ── Food & Drink ──
  { key: 'eat_breakfast',      label: 'Eat Breakfast',            emoji: '🥣',  svgGroup: 'bowl',        defaultMinutes: 15, routines: ['morning'] },
  { key: 'have_a_snack',       label: 'Have a Snack',             emoji: '🍎',  svgGroup: 'apple',       defaultMinutes: 5,  routines: ['homework'] },
  { key: 'drink_water',        label: 'Drink Water',              emoji: '💧',  svgGroup: 'glass',       defaultMinutes: 1,  routines: ['morning', 'homework'] },

  // ── Tidying ──
  { key: 'make_bed',           label: 'Make Bed',                 emoji: '🛏️',  svgGroup: 'pillow',      defaultMinutes: 2,  routines: ['morning'] },
  { key: 'tidy_room',          label: 'Clean Up Room',            emoji: '🧹',  svgGroup: 'broom',       defaultMinutes: 5,  routines: ['bedtime'] },
  { key: 'tidy_toys',          label: 'Put Away Toys',            emoji: '🧸',  svgGroup: 'toy',         defaultMinutes: 5,  routines: ['bedtime'] },

  // ── Bags & School ──
  { key: 'pack_bag',           label: 'Pack Backpack',            emoji: '🎒',  svgGroup: 'backpack',    defaultMinutes: 3,  routines: ['morning'] },
  { key: 'unpack_bag',         label: 'Unpack Backpack',          emoji: '🎒',  svgGroup: 'backpack',    defaultMinutes: 2,  routines: ['homework'] },
  { key: 'pack_bag_tomorrow',  label: 'Pack Backpack for Tomorrow', emoji: '🎒', svgGroup: 'backpack',    defaultMinutes: 3,  routines: ['homework', 'bedtime'] },

  // ── Reading & Learning ──
  { key: 'pick_a_book',        label: 'Pick a Book',              emoji: '📖',  svgGroup: 'book',        defaultMinutes: 1,  routines: ['bedtime'] },
  { key: 'reading',            label: 'Reading',                  emoji: '📖',  svgGroup: 'book',        defaultMinutes: 15, routines: ['homework'] },
  { key: 'homework',           label: 'Homework',                 emoji: '✏️',  svgGroup: 'pencil',      defaultMinutes: 20, routines: ['homework'] },

  // ── Health ──
  { key: 'take_medication',    label: 'Take Medication',          emoji: '💊',  svgGroup: 'pill',        defaultMinutes: 1,  routines: ['morning', 'bedtime'] },
  { key: 'feed_pet',           label: 'Feed Pet',                 emoji: '🐾',  svgGroup: 'pet-bowl',    defaultMinutes: 2,  routines: ['morning'] },

  // ── Screen time ──
  { key: 'screen_off_tv',      label: 'TV Off',                   emoji: '📺',  svgGroup: 'screen',      defaultMinutes: 1,  routines: ['bedtime'] },
  { key: 'screen_off_tablet',  label: 'Tablet Off',               emoji: '📱',  svgGroup: 'screen',      defaultMinutes: 1,  routines: ['bedtime'] },
  { key: 'screen_off_console', label: 'Console Off',              emoji: '🎮',  svgGroup: 'screen',      defaultMinutes: 1,  routines: ['bedtime'] },

  // ── Wind-down & Connection ──
  { key: 'talk_time',          label: 'Talk Time',                emoji: '�',  svgGroup: 'lips',        defaultMinutes: 5,  routines: ['bedtime'] },
  { key: 'lights_off',         label: 'Lights Off',               emoji: '🌙',  svgGroup: 'moon',        defaultMinutes: 1,  routines: ['bedtime'] },
  { key: 'say_prayers',        label: 'Say Prayers',              emoji: '🙏',  svgGroup: 'hands',       defaultMinutes: 2,  routines: ['bedtime'] },

  // ── Custom ──
  { key: 'custom',             label: 'Custom',                   emoji: '❓',  svgGroup: 'question-mark', defaultMinutes: 2, routines: ['morning', 'bedtime', 'homework', 'custom'] },
];

export const DEFAULT_ROUTINE_TASKS = {
  bedtime: ['put_on_pyjamas', 'brush_teeth', 'go_potty', 'pick_a_book', 'lights_off'],
  morning: ['get_dressed', 'eat_breakfast', 'brush_teeth', 'go_potty', 'wash_face', 'put_on_shoes', 'brush_hair', 'pack_bag'],
  homework: ['unpack_bag', 'have_a_snack', 'reading', 'homework', 'pack_bag_tomorrow'],
  custom: [],
};

export function getTaskByKey(key) {
  return TASK_LIBRARY.find((t) => t.key === key) || null;
}

export function getTasksForRoutine(routineType) {
  if (routineType === 'custom' || routineType.startsWith('custom:')) return TASK_LIBRARY;
  return TASK_LIBRARY.filter((t) => t.routines.includes(routineType));
}
