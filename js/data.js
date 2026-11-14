// PulseFit Exercise & Nutrition Database and Default Configurations

const EXERCISE_DATABASE = [
  // CHEST
  {
    id: "ex_bench_press",
    name: "Barbell Bench Press",
    category: "chest",
    primaryMuscle: "Chest (Pectoralis Major)",
    equipment: "Barbell & Bench",
    instructions: "Lie flat on the bench. Grip the barbell slightly wider than shoulder-width. Lower the bar smoothly to your mid-chest, keeping elbows at roughly a 75-degree angle, then press upward with power until arms are extended."
  },
  {
    id: "ex_incline_db_press",
    name: "Incline Dumbbell Press",
    category: "chest",
    primaryMuscle: "Upper Chest (Clavicular Head)",
    equipment: "Dumbbells & Incline Bench",
    instructions: "Set the bench to 30-45 degrees. Press dumbbells upward directly above chest, keeping shoulder blades retracted. Lower under control until elbows reach bench height."
  },
  {
    id: "ex_pushup",
    name: "Standard Push-Up",
    category: "chest",
    primaryMuscle: "Chest & Triceps",
    equipment: "Bodyweight",
    instructions: "Place hands shoulder-width apart. Maintain a rigid plank posture. Lower chest until it is an inch from the floor, then push back up through the palms."
  },
  {
    id: "ex_cable_fly",
    name: "Cable Chest Fly",
    category: "chest",
    primaryMuscle: "Chest (Sternal Head)",
    equipment: "Cable Machine",
    instructions: "Set cables at chest height. Take a small step forward into a staggered stance. Bring hands together in a hugging motion with slight elbow bend, focusing on peak chest contraction."
  },
  {
    id: "ex_dips",
    name: "Parallel Bar Dips",
    category: "chest",
    primaryMuscle: "Lower Chest & Triceps",
    equipment: "Dip Station / Parallel Bars",
    instructions: "Grip bars, lean chest slightly forward to target pectorals. Lower body until elbows reach 90 degrees, then push upwards to full lockout."
  },

  // BACK
  {
    id: "ex_deadlift",
    name: "Conventional Deadlift",
    category: "back",
    primaryMuscle: "Lower Back, Erector Spinae & Posterior Chain",
    equipment: "Barbell",
    instructions: "Stand with mid-foot under barbell. Hinge at hips to grip bar. Flatten back, pack lats, and drive through heels, extending hips and knees simultaneously."
  },
  {
    id: "ex_pullup",
    name: "Pull-Up",
    category: "back",
    primaryMuscle: "Lats (Latissimus Dorsi)",
    equipment: "Pull-Up Bar",
    instructions: "Grip bar overhand slightly wider than shoulders. Pull body upward by driving elbows down toward ribcage until chin passes over bar."
  },
  {
    id: "ex_bb_row",
    name: "Bent-Over Barbell Row",
    category: "back",
    primaryMuscle: "Upper & Mid Back (Rhomboids, Lats)",
    equipment: "Barbell",
    instructions: "Hinge at hips with torso at roughly 45 degrees. Pull bar toward lower ribs/navel, squeezing shoulder blades together at top."
  },
  {
    id: "ex_lat_pulldown",
    name: "Lat Pulldown",
    category: "back",
    primaryMuscle: "Lats",
    equipment: "Cable Pulldown Machine",
    instructions: "Grip wide bar, sit upright with thighs secured under pads. Pull bar down toward upper chest while leaning slightly back. Control the return upward."
  },
  {
    id: "ex_face_pull",
    name: "Cable Face Pull",
    category: "back",
    primaryMuscle: "Rear Delts & Upper Traps",
    equipment: "Cable Rope",
    instructions: "Set pulley at eye height. Pull rope handles toward eye level while externally rotating shoulders, pulling elbows backward."
  },

  // LEGS
  {
    id: "ex_squat",
    name: "Barbell Back Squat",
    category: "legs",
    primaryMuscle: "Quadriceps & Glutes",
    equipment: "Barbell & Squat Rack",
    instructions: "Rest bar on upper traps. Set feet shoulder-width, toes slightly out. Squat down by pushing hips back and bending knees until thighs are parallel to ground or deeper."
  },
  {
    id: "ex_leg_press",
    name: "Leg Press",
    category: "legs",
    primaryMuscle: "Quadriceps",
    equipment: "Leg Press Machine",
    instructions: "Place feet shoulder-width on platform. Lower sled under control until knees are bent 90 degrees. Push through heels without locking knees at top."
  },
  {
    id: "ex_rdl",
    name: "Romanian Deadlift (RDL)",
    category: "legs",
    primaryMuscle: "Hamstrings & Glutes",
    equipment: "Barbell or Dumbbells",
    instructions: "Stand tall holding weights. Keep knees slightly soft and push hips straight backward while keeping back flat. Lower until you feel deep hamstring stretch, then drive hips forward."
  },
  {
    id: "ex_lunges",
    name: "Walking Dumbbell Lunges",
    category: "legs",
    primaryMuscle: "Quadriceps, Glutes & Balance",
    equipment: "Dumbbells",
    instructions: "Step forward with right leg, lowering hips until both knees form 90-degree angles. Push off front heel into the next step with left leg."
  },
  {
    id: "ex_calf_raise",
    name: "Standing Calf Raise",
    category: "legs",
    primaryMuscle: "Calves (Gastrocnemius)",
    equipment: "Calf Machine or Step Platform",
    instructions: "Place balls of feet on elevated ledge. Lower heels for a full stretch, then press high onto toes, pausing for 1 second at peak contraction."
  },

  // SHOULDERS
  {
    id: "ex_overhead_press",
    name: "Overhead Military Press",
    category: "shoulders",
    primaryMuscle: "Anterior Deltoids & Triceps",
    equipment: "Barbell",
    instructions: "Hold bar at collarbone level. Brace core and glutes. Press bar straight overhead, moving head slightly back then bringing it forward as bar clears crown."
  },
  {
    id: "ex_lateral_raise",
    name: "Dumbbell Lateral Raise",
    category: "shoulders",
    primaryMuscle: "Lateral Deltoids (Side Shoulders)",
    equipment: "Dumbbells",
    instructions: "Stand upright holding dumbbells at sides. Lift arms out to the side with slight elbow bend until parallel with floor, then lower slowly."
  },
  {
    id: "ex_arnold_press",
    name: "Arnold Dumbbell Press",
    category: "shoulders",
    primaryMuscle: "Complete Deltoid Complex",
    equipment: "Dumbbells & Bench",
    instructions: "Start with dumbbells at chest height, palms facing body. As you press overhead, rotate palms outward so they face forward at top."
  },

  // ARMS
  {
    id: "ex_bicep_curl",
    name: "Barbell Bicep Curl",
    category: "arms",
    primaryMuscle: "Biceps Brachii",
    equipment: "Barbell / EZ-Curl Bar",
    instructions: "Keep elbows pinned at sides. Curl bar upward toward shoulders while contracting biceps. Lower under control without swinging hips."
  },
  {
    id: "ex_hammer_curl",
    name: "Dumbbell Hammer Curl",
    category: "arms",
    primaryMuscle: "Brachialis & Forearms",
    equipment: "Dumbbells",
    instructions: "Hold dumbbells with neutral grip (palms facing inward). Curl dumbbells upward keeping wrist neutral, squeeze at top, and lower slowly."
  },
  {
    id: "ex_tricep_rope",
    name: "Cable Tricep Pushdown",
    category: "arms",
    primaryMuscle: "Triceps (Lateral Head)",
    equipment: "Cable Machine & Rope",
    instructions: "Keep elbows pinned tightly to sides. Push rope down, flaring ends apart at bottom for full tricep lock. Slowly return to 90 degrees."
  },
  {
    id: "ex_skullcrusher",
    name: "Lying Triceps Extension (Skullcrusher)",
    category: "arms",
    primaryMuscle: "Triceps (Long Head)",
    equipment: "EZ-Bar & Bench",
    instructions: "Lie on bench holding bar above chest. Bend elbows to lower bar toward forehead or just behind crown, keeping upper arms vertical, then press back up."
  },

  // CORE
  {
    id: "ex_plank",
    name: "Forearm Plank",
    category: "core",
    primaryMuscle: "Transverse Abdominis & Core",
    equipment: "Bodyweight / Mat",
    instructions: "Support body on forearms and toes. Maintain a straight line from heels to crown. Squeeze glutes and brace abs tightly."
  },
  {
    id: "ex_hanging_leg_raise",
    name: "Hanging Leg Raise",
    category: "core",
    primaryMuscle: "Lower Abdominals & Hip Flexors",
    equipment: "Pull-Up Bar",
    instructions: "Hang from bar with overhand grip. Avoid swinging. Raise legs straight out until parallel to floor (or knees to chest for regression)."
  },
  {
    id: "ex_russian_twist",
    name: "Weighted Russian Twist",
    category: "core",
    primaryMuscle: "Obliques & Rotational Core",
    equipment: "Medicine Ball or Dumbbell",
    instructions: "Sit on floor with knees bent and feet elevated. Lean torso back 45 degrees. Rotate weight from side to side touching floor lightly."
  },

  // CARDIO
  {
    id: "ex_treadmill",
    name: "Treadmill Run / Jog",
    category: "cardio",
    primaryMuscle: "Cardiovascular Endurance & Legs",
    equipment: "Treadmill",
    instructions: "Maintain upright posture, mid-foot strike, and relaxed shoulder swing. Adjust incline and speed according to workout intensity."
  },
  {
    id: "ex_jump_rope",
    name: "Jump Rope",
    category: "cardio",
    primaryMuscle: "Cardiovascular, Calves & Agility",
    equipment: "Jump Rope",
    instructions: "Keep elbows close to torso, rotate rope using wrists. Jump lightly on balls of feet, clearing rope by just 1-2 inches."
  },
  {
    id: "ex_rowing",
    name: "Concept2 Rowing Machine",
    category: "cardio",
    primaryMuscle: "Full Body Conditioning",
    equipment: "Row Ergometer",
    instructions: "Sequence drive: legs first, lean back with core, then pull handle to sternum. Recover in exact reverse order (arms, core, legs)."
  }
];

const PRESET_ROUTINES = [
  {
    id: "rt_push",
    name: "Push Day (Chest, Shoulders, Triceps)",
    category: "Hypertrophy / Strength",
    description: "Classic push workout focusing on chest press power, shoulder development, and tricep lockouts.",
    exercises: [
      { exerciseId: "ex_bench_press", targetSets: 4, targetReps: 8, restSeconds: 90 },
      { exerciseId: "ex_overhead_press", targetSets: 3, targetReps: 8, restSeconds: 90 },
      { exerciseId: "ex_incline_db_press", targetSets: 3, targetReps: 10, restSeconds: 60 },
      { exerciseId: "ex_lateral_raise", targetSets: 4, targetReps: 15, restSeconds: 45 },
      { exerciseId: "ex_tricep_rope", targetSets: 3, targetReps: 12, restSeconds: 45 }
    ]
  },
  {
    id: "rt_pull",
    name: "Pull Day (Back, Lats, Biceps)",
    category: "Hypertrophy / Strength",
    description: "Targets upper back thickness, lat width, and peak bicep recruitment with compound pulling.",
    exercises: [
      { exerciseId: "ex_deadlift", targetSets: 3, targetReps: 5, restSeconds: 120 },
      { exerciseId: "ex_pullup", targetSets: 4, targetReps: 8, restSeconds: 90 },
      { exerciseId: "ex_bb_row", targetSets: 3, targetReps: 10, restSeconds: 60 },
      { exerciseId: "ex_face_pull", targetSets: 3, targetReps: 15, restSeconds: 45 },
      { exerciseId: "ex_bicep_curl", targetSets: 3, targetReps: 12, restSeconds: 45 }
    ]
  },
  {
    id: "rt_legs",
    name: "Leg Day (Quads, Hamstrings, Glutes)",
    category: "Hypertrophy / Strength",
    description: "Intense lower body session for foundational strength, athletic power, and calf development.",
    exercises: [
      { exerciseId: "ex_squat", targetSets: 4, targetReps: 6, restSeconds: 120 },
      { exerciseId: "ex_rdl", targetSets: 3, targetReps: 10, restSeconds: 90 },
      { exerciseId: "ex_leg_press", targetSets: 3, targetReps: 12, restSeconds: 60 },
      { exerciseId: "ex_lunges", targetSets: 3, targetReps: 12, restSeconds: 60 },
      { exerciseId: "ex_calf_raise", targetSets: 4, targetReps: 15, restSeconds: 45 }
    ]
  },
  {
    id: "rt_fullbody",
    name: "Full Body Athletic Blast",
    category: "Conditioning",
    description: "Time-efficient full body blast combining major compound movements and core stability.",
    exercises: [
      { exerciseId: "ex_squat", targetSets: 3, targetReps: 8, restSeconds: 90 },
      { exerciseId: "ex_bench_press", targetSets: 3, targetReps: 8, restSeconds: 90 },
      { exerciseId: "ex_pullup", targetSets: 3, targetReps: 8, restSeconds: 60 },
      { exerciseId: "ex_plank", targetSets: 3, targetReps: 60, restSeconds: 45 },
      { exerciseId: "ex_treadmill", targetSets: 1, targetReps: 15, restSeconds: 60 }
    ]
  },
  {
    id: "rt_core_cardio",
    name: "Core Shred & Cardio Burn",
    category: "Fat Burn / Core",
    description: "Fast-paced workout focusing on rotational core, abdominal definition, and metabolic heart rate spikes.",
    exercises: [
      { exerciseId: "ex_jump_rope", targetSets: 4, targetReps: 60, restSeconds: 45 },
      { exerciseId: "ex_hanging_leg_raise", targetSets: 3, targetReps: 12, restSeconds: 45 },
      { exerciseId: "ex_russian_twist", targetSets: 3, targetReps: 20, restSeconds: 45 },
      { exerciseId: "ex_plank", targetSets: 3, targetReps: 60, restSeconds: 30 }
    ]
  }
];

const FOOD_DATABASE = [
  { id: "fd_chicken", name: "Grilled Chicken Breast (150g)", calories: 247, protein: 46, carbs: 0, fat: 5.4, serving: "150g" },
  { id: "fd_salmon", name: "Baked Salmon Fillet (150g)", calories: 312, protein: 34, carbs: 0, fat: 18, serving: "150g" },
  { id: "fd_eggs", name: "Whole Eggs (2 Large)", calories: 144, protein: 12.6, carbs: 0.8, fat: 9.8, serving: "2 eggs" },
  { id: "fd_egg_whites", name: "Liquid Egg Whites (150g)", calories: 78, protein: 16.5, carbs: 1.1, fat: 0.3, serving: "150g" },
  { id: "fd_whey", name: "Whey Protein Powder (1 Scoop)", calories: 120, protein: 24, carbs: 3, fat: 1.5, serving: "1 scoop (30g)" },
  { id: "fd_brown_rice", name: "Cooked Brown Rice (1 cup)", calories: 218, protein: 4.5, carbs: 45.8, fat: 1.6, serving: "195g" },
  { id: "fd_oats", name: "Rolled Oats (50g raw)", calories: 189, protein: 6.5, carbs: 34, fat: 3.5, serving: "50g" },
  { id: "fd_sweet_potato", name: "Baked Sweet Potato (150g)", calories: 135, protein: 3, carbs: 31, fat: 0.2, serving: "150g" },
  { id: "fd_greek_yogurt", name: "Greek Yogurt 0% Fat (170g)", calories: 100, protein: 18, carbs: 6, fat: 0, serving: "170g" },
  { id: "fd_banana", name: "Medium Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.3, serving: "1 banana (118g)" },
  { id: "fd_apple", name: "Medium Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: "1 apple (182g)" },
  { id: "fd_almonds", name: "Raw Almonds (30g)", calories: 174, protein: 6.3, carbs: 6.1, fat: 15, serving: "30g" },
  { id: "fd_peanut_butter", name: "Natural Peanut Butter (2 tbsp)", calories: 190, protein: 8, carbs: 7, fat: 16, serving: "32g" },
  { id: "fd_avocado", name: "Half Fresh Avocado (100g)", calories: 160, protein: 2, carbs: 8.5, fat: 14.7, serving: "100g" },
  { id: "fd_olive_oil", name: "Extra Virgin Olive Oil (1 tbsp)", calories: 119, protein: 0, carbs: 0, fat: 13.5, serving: "14ml" },
  { id: "fd_broccoli", name: "Steamed Broccoli (150g)", calories: 52, protein: 4.2, carbs: 10.5, fat: 0.6, serving: "150g" },
  { id: "fd_whole_milk", name: "Whole Milk (1 glass)", calories: 149, protein: 7.7, carbs: 11.7, fat: 8, serving: "244ml" },
  { id: "fd_cottage_cheese", name: "Low-Fat Cottage Cheese (150g)", calories: 110, protein: 18, carbs: 5, fat: 2, serving: "150g" },
  { id: "fd_tuna", name: "Canned Tuna in Water (1 can)", calories: 130, protein: 29, carbs: 0, fat: 1, serving: "140g drained" }
];

const MOTIVATIONAL_QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Success starts with self-discipline.", author: "Dwayne Johnson" },
  { text: "You don't have to be extreme, just consistent.", author: "Fitness Proverb" },
  { text: "Your only limit is you.", author: "Anonymous" },
  { text: "Energy flows where attention goes.", author: "Tony Robbins" }
];

// Generates rich sample data for initial launch
function generateInitialState() {
  const today = new Date();
  const formatDate = (d) => d.toISOString().split("T")[0];

  // Past 14 days weight entries
  const weightLogs = [];
  const baseWeight = 76.8;
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Slight realistic downward trend
    const jitter = (Math.sin(i * 0.8) * 0.25) - ( (13 - i) * 0.08 );
    const weight = Number((baseWeight + jitter).toFixed(1));
    weightLogs.push({
      id: "wt_" + d.getTime(),
      date: formatDate(d),
      weight: weight,
      bodyFat: Number((16.8 - ((13 - i) * 0.05)).toFixed(1)),
      notes: i === 0 ? "Morning weigh-in after glass of water" : "Regular morning weigh-in"
    });
  }

  // Generate recent workout history
  const workoutHistory = [
    {
      id: "wo_hist_1",
      name: "Leg Day (Quads, Hamstrings, Glutes)",
      date: formatDate(new Date(today.getTime() - 4 * 86400000)),
      durationMinutes: 52,
      totalVolumeKg: 7820,
      caloriesBurned: 440,
      completedSetsCount: 16,
      exercises: [
        {
          exerciseId: "ex_squat",
          name: "Barbell Back Squat",
          sets: [
            { setNumber: 1, weight: 80, reps: 8, completed: true },
            { setNumber: 2, weight: 90, reps: 6, completed: true },
            { setNumber: 3, weight: 95, reps: 6, completed: true },
            { setNumber: 4, weight: 100, reps: 5, completed: true }
          ]
        },
        {
          exerciseId: "ex_rdl",
          name: "Romanian Deadlift (RDL)",
          sets: [
            { setNumber: 1, weight: 70, reps: 10, completed: true },
            { setNumber: 2, weight: 80, reps: 8, completed: true },
            { setNumber: 3, weight: 80, reps: 8, completed: true }
          ]
        },
        {
          exerciseId: "ex_leg_press",
          name: "Leg Press",
          sets: [
            { setNumber: 1, weight: 140, reps: 12, completed: true },
            { setNumber: 2, weight: 160, reps: 10, completed: true },
            { setNumber: 3, weight: 180, reps: 10, completed: true }
          ]
        }
      ]
    },
    {
      id: "wo_hist_2",
      name: "Pull Day (Back, Lats, Biceps)",
      date: formatDate(new Date(today.getTime() - 2 * 86400000)),
      durationMinutes: 48,
      totalVolumeKg: 6450,
      caloriesBurned: 390,
      completedSetsCount: 15,
      exercises: [
        {
          exerciseId: "ex_deadlift",
          name: "Conventional Deadlift",
          sets: [
            { setNumber: 1, weight: 100, reps: 5, completed: true },
            { setNumber: 2, weight: 120, reps: 5, completed: true },
            { setNumber: 3, weight: 130, reps: 4, completed: true }
          ]
        },
        {
          exerciseId: "ex_pullup",
          name: "Pull-Up",
          sets: [
            { setNumber: 1, weight: 0, reps: 10, completed: true },
            { setNumber: 2, weight: 0, reps: 8, completed: true },
            { setNumber: 3, weight: 5, reps: 6, completed: true }
          ]
        },
        {
          exerciseId: "ex_bicep_curl",
          name: "Barbell Bicep Curl",
          sets: [
            { setNumber: 1, weight: 25, reps: 12, completed: true },
            { setNumber: 2, weight: 30, reps: 10, completed: true },
            { setNumber: 3, weight: 30, reps: 8, completed: true }
          ]
        }
      ]
    },
    {
      id: "wo_hist_3",
      name: "Push Day (Chest, Shoulders, Triceps)",
      date: formatDate(new Date(today.getTime() - 1 * 86400000)),
      durationMinutes: 55,
      totalVolumeKg: 7120,
      caloriesBurned: 420,
      completedSetsCount: 16,
      exercises: [
        {
          exerciseId: "ex_bench_press",
          name: "Barbell Bench Press",
          sets: [
            { setNumber: 1, weight: 60, reps: 10, completed: true },
            { setNumber: 2, weight: 70, reps: 8, completed: true },
            { setNumber: 3, weight: 75, reps: 7, completed: true },
            { setNumber: 4, weight: 80, reps: 5, completed: true }
          ]
        },
        {
          exerciseId: "ex_overhead_press",
          name: "Overhead Military Press",
          sets: [
            { setNumber: 1, weight: 40, reps: 8, completed: true },
            { setNumber: 2, weight: 45, reps: 6, completed: true },
            { setNumber: 3, weight: 45, reps: 6, completed: true }
          ]
        }
      ]
    }
  ];

  // Today's pre-logged meals for rich visual demonstration
  const todayMeals = [
    {
      id: "ml_1",
      type: "breakfast",
      name: "Oatmeal with Whey & Banana",
      calories: 414,
      protein: 31.8,
      carbs: 64,
      fat: 5.3,
      time: "08:15 AM"
    },
    {
      id: "ml_2",
      type: "lunch",
      name: "Grilled Chicken Breast with Brown Rice & Broccoli",
      calories: 517,
      protein: 54.7,
      carbs: 56.3,
      fat: 7.6,
      time: "01:20 PM"
    },
    {
      id: "ml_3",
      type: "snack",
      name: "Greek Yogurt with Raw Almonds",
      calories: 274,
      protein: 24.3,
      carbs: 12.1,
      fat: 15,
      time: "04:45 PM"
    }
  ];

  return {
    version: 1,
    settings: {
      units: "metric", // "metric" (kg, cm, ml) or "imperial" (lbs, in, fl oz)
      theme: "dark",   // "dark" or "light"
      soundEnabled: true
    },
    profile: {
      name: "Alex Hunter",
      gender: "male",
      age: 26,
      heightCm: 178,
      currentWeightKg: 75.6,
      targetWeightKg: 72.0,
      activityLevel: "moderate", // sedentary, light, moderate, active, very_active
      goals: {
        dailyCalories: 2350,
        dailyProteinG: 160,
        dailyCarbsG: 230,
        dailyFatG: 65,
        dailyWaterMl: 3000,
        dailySteps: 10000,
        weeklyWorkouts: 4
      }
    },
    today: {
      date: formatDate(today),
      waterMl: 2250,
      steps: 7850,
      activeWorkoutMinutes: 45,
      caloriesBurned: 380,
      meals: todayMeals
    },
    weightHistory: weightLogs,
    workoutHistory: workoutHistory,
    customExercises: [],
    customRoutines: PRESET_ROUTINES,
    currentStreak: 5,
    lastActiveDate: formatDate(today)
  };
}
