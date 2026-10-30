# CaffControl ☕📱
> **Student Caffeine Intake Meter & Academic Workload Tracker**

CaffControl is a web-based application designed specifically for students to monitor their daily caffeine intake, stay within safe cognitive alertness levels, and manage academic workloads in one unified interface.

---

## 📸 Overview & Features

### 1. Caffeine Intake Meter (Safety Thresholds)
- **Percentage-based monitoring**: Measures daily caffeine intake against the student's daily safe target limit (default `215mg`, with `400mg` upper health ceiling).
- **Dynamic visual state feedback**:
  - **Safe (<70%)**: Warm coffee amber gradient with steam animation above the cup.
  - **Caution (70% - 99%)**: Golden-orange warning state advising pacing.
  - **100%+ Red Alert**: When intake hits 100%, the radial gauge and stats turn **flashing RED**, triggering an emergency modal and banner advising the student that their safe intake has been reached and to switch to water.

### 2. Est. Boost Duration
- Live dynamic timer calculating remaining hours of active alertness based on drink timestamp and caffeine metabolization (e.g. 3.5 hrs for standard intake, scaling with dose).

### 3. Quick-Stats Card
- Real-time display of current caffeine fraction (e.g. `75mg / 400mg`), percentage pill, mini progress bar, and student daily max target.
- Photorealistic coffee bean hero backdrop matching the original design mockup.

### 4. Today's Workload (Tasks & Notes)
- Academic checklist tailored for student assignments, quizzes, and experiments.
- Live progress indicator (e.g. `Assignments: 1 of 3 Completed` and progress bar).
- Strike-through completion toggling and task deletion.
- Modal to add new tasks with due date timelines (`Today`, `Tomorrow`, `This Week`) and subject categories (`Quiz`, `Activity`, `Experiment`, `Exam`).

### 5. Drink Presets & Custom Logging
- One-click presets for popular student drinks (e.g. Kopiko 3-in-1 sachet, Kopiko Lucky Day 7-Eleven bottle, Kapeng Barako, Espresso shot, Iced Caramel Latte, Cobra/Sting energy drinks).
- Custom drink logger for any custom beverage and caffeine amount.
- Coffee intake history log with timestamps and undo functionality.

### 6. Profile & Limit Customization
- Accessible via the top avatar button: customize student name, personal daily target (default `215mg`), and safe health ceiling (`400mg`).
- Daily reset at midnight or manual one-click reset for today.

---

## 🚀 How to Run Locally

### Option 1: Built-in Node Server (Active)
```bash
node server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in any web browser.

### Option 2: Direct File Open
You can also open [index.html](file:///c:/Users/Tom%20Jason/Desktop/Coffee/index.html) directly in Google Chrome, Microsoft Edge, or Safari without any server or dependencies.

---

## 📁 File Structure
- [index.html](file:///c:/Users/Tom%20Jason/Desktop/Coffee/index.html) - Semantic HTML5 layout, modals, accessible widgets.
- [style.css](file:///c:/Users/Tom%20Jason/Desktop/Coffee/style.css) - Curated coffee color palette, glassmorphism, responsive phone shell frame, SVG animations.
- [app.js](file:///c:/Users/Tom%20Jason/Desktop/Coffee/app.js) - Reactive state management, `localStorage` persistence, radial gauge calculations, boost duration timer.
- [server.js](file:///c:/Users/Tom%20Jason/Desktop/Coffee/server.js) - Zero-dependency static HTTP server.
- `assets/coffee_beans_bg.jpg` - High-definition hero backdrop.
