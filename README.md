# PulseFit — All-in-One Modern Fitness & Workout Tracker

A feature-packed, zero-dependency, modern fitness web application built with HTML5, CSS3, and JavaScript. PulseFit works immediately in any modern web browser offline without requiring Node.js, Python, servers, or external npm packages.

---

## 🌟 Key Features

### 1. 📊 Daily Activity Dashboard
- **Calorie Balance Tracker**: Consumed vs. target calories with live progress gauge and remaining breakdown.
- **Hydration Tracker**: 1-click water logging (`+250ml`, `+500ml`, custom reset) with pleasant audio feedback.
- **Daily Steps Counter**: Interactive progress bar against daily 10,000 steps goal with quick updates.
- **Active Workout Minutes**: Tracks total daily time spent training.
- **Weekly Workout Activity Chart**: Interactive 7-day SVG chart displaying workout duration per day.
- **Daily Streak & Motivation**: Fire streak counter (`🔥 5 Days`) and rotatable inspirational fitness quotes.

### 2. 🏋️‍♂️ Workout Tracker & Active Session Mode
- **Pre-Loaded Training Routines**:
  - *Push Day* (Chest, Shoulders, Triceps)
  - *Pull Day* (Back, Lats, Biceps)
  - *Leg Day* (Quads, Hamstrings, Glutes)
  - *Full Body Athletic Blast*
  - *Core Shred & Cardio Burn*
- **Active Workout Session View**:
  - Live session stopwatch timer.
  - Set-by-set logging (Weight, Reps, Completion Checkboxes).
  - Add or remove sets dynamically.
  - Add custom exercises from the 30+ exercise library directly during an active workout.
- **Floating Rest Timer**:
  - Automatically pops up with progress bar when you complete a set.
  - Custom countdown (default 60s) with `+15s`, `-15s`, and `Skip` controls.
  - Audio countdown ticks (3, 2, 1) and dual-tone completion chime.
- **Workout Summary & Volume Calculation**:
  - Calculates total volume lifted (kg/lbs) across all sets.
  - Computes calories burned and duration.
  - Awards streak points with celebratory fanfare.

### 3. 🥗 Nutrition & Macro Tracker
- **Macronutrient Donut Ring**: Pure SVG segmented circular gauge displaying remaining calories and macro ratios.
- **Macro Progress Bars**: Real-time tracking of Protein (g), Carbohydrates (g), and Healthy Fats (g).
- **Meal Breakdown**: Categorized tracking for Breakfast, Lunch, Dinner, and Snacks.
- **Built-in Food Library**: Instant 1-click logging of healthy foods (Chicken breast, Salmon, Oats, Greek yogurt, Whey, Brown rice, Avocado, etc.).
- **Custom Food Entry**: Add any meal with custom calories, protein, carbs, and fat.

### 4. ⏱ Timers & Performance Tools
- **HIIT / Tabata Interval Timer**:
  - Configurable: Prepare time, Work interval, Rest interval, and Rounds.
  - Full-screen high-contrast color transitions (Yellow = Prepare, Emerald Green = Work, Blue = Rest).
  - Web Audio synthesizer beeps for interval changes and final horn.
- **Precision Stopwatch**:
  - Accurate to 10 milliseconds with Lap recording and split-time comparisons.
- **Fitness Calculators**:
  - **BMI (Body Mass Index)** with category badge and ideal weight range recommendations.
  - **BMR (Basal Metabolic Rate) & TDEE** via Mifflin-St Jeor equation with maintenance, fat loss, and muscle gain targets.
  - **One Rep Max (1RM)** via combined Epley & Brzycki formulas with a complete percentage load table (95% down to 50%).

### 5. 📈 Analytics & Progress
- **Interactive SVG Weight Trend Graph**:
  - Smooth polyline, gradient area fill, horizontal grid, and interactive hover tooltips with notes.
- **Weigh-In Logger**: Track body weight, optional body fat %, and notes.
- **Workout History Log**: Chronological archive of all past workouts with expandable set-by-set details.

### 6. ⚙️ Persistence & Settings
- **100% Offline & Local**: All data persists automatically in browser `localStorage`.
- **JSON Backup & Restore**: Download a `.json` backup file or restore from a previous backup.
- **Dark Mode & Light Mode**: Theme toggle with persistent preference.
- **Reset to Demo Data**: Instantly reload rich sample data to explore charts and features.

---

## 🚀 How to Run

1. Open `fitness-app/index.html` in any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari, etc.).
   - Simply double-click `index.html` from Windows File Explorer.
2. Everything works out of the box! No servers, no builds, no installations required.

---

## 📁 File Structure
```
fitness-app/
├── index.html        # Main HTML5 application markup
├── css/
│   └── styles.css    # Modern athletic design system (Dark/Light themes, responsive layout)
├── js/
│   ├── data.js       # Exercise library, routines, food items, sample state generator
│   ├── audio.js      # Web Audio API sound synthesizer for ticks, beeps & fanfare
│   ├── storage.js    # LocalStorage manager, JSON backup export & import
│   ├── charts.js     # Responsive SVG line chart, bar chart, and macro ring
│   └── app.js        # Core app controller, timer loops, workout tracker & calculators
└── README.md         # Documentation & guide
```
