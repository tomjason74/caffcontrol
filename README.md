# CaffControl ☕📋
> **Student Coffee Intake Meter & Academic Workload Tracker**

CaffControl is a web-based application designed specifically for students to monitor their daily coffee and caffeine intake, stay within safe cognitive alertness levels, and manage academic workloads in one unified interface.

---

## 📌 Overview & Features

### 1. Caffeine Intake Meter (Safety Thresholds)
- **Percentage-based monitoring**: Measures daily coffee caffeine intake against the student's daily safe target limit (default `215mg`, with `400mg` upper health ceiling).
- **Dynamic visual state feedback**:
  - **Safe (<70%)**: Warm coffee amber gradient with steam animation above the cup.
  - **Caution (70% - 99%)**: Golden-orange warning state advising pacing.
  - **100%+ Red Alert**: When intake hits 100%, the radial gauge and stats turn **flashing RED**, triggering an emergency modal and banner advising the student that their safe intake has been reached and to switch to water.

### 2. Est. Boost Duration
- Live dynamic timer calculating remaining hours of active alertness based on coffee timestamp and caffeine metabolization (e.g. 3.5 hrs for standard intake, scaling with dose).

### 3. Quick-Stats Card
- Real-time display of current caffeine fraction (e.g. `75mg / 400mg`), percentage pill, mini progress bar, and student daily max target.
- Photorealistic coffee bean hero backdrop matching the original design mockup.

### 4. Today's Workload (Tasks, Reminders & Notifications)
- Academic checklist tailored for student assignments, quizzes, and experiments.
- Live progress indicator (e.g. `Assignments: 1 of 3 Completed` and progress bar).
- Strike-through completion toggling and task deletion.
- Modal to add new tasks with due date timelines (`Today`, `Tomorrow`, `This Week`) and subject categories (`Quiz`, `Activity`, `Experiment`, `Exam`).
- **Interactive Notifications & Reminders**:
  - **Task Added Reminder**: Instant in-app phone notification banner and chime alerting the student that their task and due date reminder are active.
  - **Task Completion Celebration**: Congratulatory toast notification with live workload percentage update and audio chime when checking off a task, including a special badge when all tasks are complete.
  - **Browser & Periodic Alerts**: Integrates native HTML5 Web Notifications and periodic reminders for pending assignments due today.

### 5. Coffee Presets & Custom Logging
- One-click presets for popular student coffee drinks (Kopiko 3-in-1 sachet, Kopiko Lucky Day 7-Eleven bottle, Kapeng Barako, Espresso shot, Iced Caramel Latte, and Spanish Latte).
- Custom coffee logger for any custom coffee beverage and caffeine amount.
- Coffee intake history log with timestamps and undo functionality.

### 6. Profile & Limit Customization
- Accessible via the top avatar button: customize student name, personal daily target (default `215mg`), and safe health ceiling (`400mg`).
- Daily reset at midnight or manual security-verified reset for today.

---

## 🚀 How to Run Locally

### Option 1: Built-in Node Server
```bash
node server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in any web browser.

### Option 2: Direct File Open
You can also open `index.html` directly in Google Chrome, Microsoft Edge, or Safari without any server or dependencies.

---

## 📁 File Structure
- `index.html` - Semantic HTML5 layout, modals, accessible widgets.
- `style.css` - Curated coffee color palette, glassmorphism, responsive phone shell frame, SVG animations.
- `app.js` - Reactive state management, `localStorage` persistence, radial gauge calculations, boost duration timer.
- `server.js` - Zero-dependency static HTTP server.
- `assets/coffee_beans_bg.jpg` - High-definition hero backdrop.
