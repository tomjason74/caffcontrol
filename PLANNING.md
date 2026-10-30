# CaffControl: Planning, Requirements & Design Specifications Document 📋☕

This document records the full planning session, design decisions, and architectural specifications agreed upon during the `/grill-me` interview for the **CaffControl** student coffee intake and workload web application.

---

## 1. Project Background & Original Requirement Analysis

### 1.1 Original Prompt (Filipino / Tagalog)
> *"bale kamo, parang web-based app siya na imeasure coffee intake through percentage, kapag umabot ng 100 red na 'yon kasi ibig sabihin enough na 'yung na-intake na safe lang for students. Also, may lalagyan ng tasks don like notes para malaman kung ano pa need gawin. nasa interface lahat"*

### 1.2 Translation & Core Objectives
1. **Web-Based Application**: Accessible via web browser on mobile and desktop without requiring complex installations.
2. **Percentage-Based Caffeine Monitoring**: Measures daily intake against safe student limits.
3. **100% Red Alert Safety Threshold**: When intake reaches 100%, the interface transitions into a prominent **RED** alert, indicating the student has reached their maximum safe intake and should stop caffeine consumption.
4. **Academic Workload & Task Notes Integration**: An integrated checklist to track schoolwork, assignments, and quizzes.
5. **Consolidated Mobile Dashboard ("nasa interface lahat")**: Everything accessible in one unified, mobile-first view.

### 1.3 UI Mockup Reference
Reference file: [`b172e1c7-591b-4aad-9066-d5de13b6fcea.jpg`](file:///c:/Users/Tom%20Jason/Desktop/Coffee/b172e1c7-591b-4aad-9066-d5de13b6fcea.jpg)
- **Top Header**: Profile avatar icon, *CaffControl* branding, and menu navigation.
- **Hero Card**: Personalized greeting (`HI, NAME!`), coffee beans background texture, and *Quick-Stats* row (Caffeine limit fraction, boost duration, daily target).
- **Workload Card**: Header (`Today's Workload:`), summary counter (`Assignments: 1 of 3 Completed`), progress bar (`60%`), task checklist, and `Add New Task +` button.
- **Caffeine Intake Meter**: Circular arc radial gauge with percentage (`15%`), milligram readout (`75mg`), coffee cup illustration, and `215mg Daily Max` badge.
- **Bottom Action**: Prominent `+ Add Coffee` button.

---

## 2. Design Interview Alignment Record (`/grill-me` Decisions)

During the interactive design interview, each branch of the architecture and user experience was resolved:

### Decision 1: Technical Architecture & Tech Stack
- **Question**: What technical architecture and tech stack should we use?
- **Agreed Decision**: **Lightweight Vanilla Web App (HTML5, CSS3, JavaScript) with `localStorage`**.
- **Rationale**: Zero external runtime dependencies, instant load speed, offline functionality, runs out of the box in any browser, and ideal for student project submissions.

### Decision 2: Coffee Logging & "Add Coffee" Mechanism
- **Question**: How should students log their coffee intake when clicking `+ Add Coffee`?
- **Agreed Decision**: **Preset Modal with Student Favorites + Custom mg input**.
- **Rationale**: Fast one-tap logging for common student beverages without forcing students to manually remember caffeine amounts, while still allowing custom entries.

### Decision 3: Academic Workload ("Today's Workload") Features
- **Question**: What features should be included in the task & notes section?
- **Agreed Decision**: **Interactive academic checklist with live progress calculation**.
- **Rationale**: Includes title, due date timeline tag, category chip, strike-through completion toggle, dynamic progress bar, and deletion capabilities.

### Decision 4: Visual Warning & 100% Red-Alert Threshold
- **Question**: How should the visual warning and 100% threshold behave as intake rises?
- **Agreed Decision**: **Multi-stage visual feedback with emergency hydration alert**.
  - **Safe Zone (< 70%)**: Warm coffee amber gradient, normal state.
  - **Caution Zone (70% - 99%)**: Warning orange banner and gauge styling.
  - **Danger Zone (≥ 100%)**: Glowing **RED** radial gauge, pulsing border, alert banner, and an emergency modal pop-up urging the student to hydrate with water.

### Decision 5: Student Profile & Settings Management
- **Question**: How should student profile customization and daily reset be managed?
- **Agreed Decision**: **Profile Settings Modal with Automatic & Manual Reset**.
- **Rationale**: Allows students to edit their name, adjust their daily target (`215mg`) or health ceiling (`400mg`), and reset their daily consumption.

### Decision 6: Visual Presentation & Layout Styling
- **Question**: How should the visual presentation and responsive layout be styled?
- **Agreed Decision**: **Mobile-first responsive web app with desktop phone frame preview switch**.
- **Rationale**: Beautiful on mobile phones, with a toggleable desktop phone frame mockup for presentations and screens.

### Decision 7: Curated Student Drink Library
- **Question**: Which drink library setup would best suit students?
- **Agreed Decision**: **Curated Filipino Student Favorites**:
  - *Kopiko 3-in-1 (Sachet)*: **65mg**
  - *Kopiko Lucky Day (7-Eleven RTD)*: **150mg**
  - *Kapeng Barako (Brewed Liberica Mug)*: **120mg**
  - *Espresso Shot (Single)*: **64mg**
  - *Iced Caramel Latte (16oz)*: **75mg**
  - *Spanish Latte (Sweetened Espresso & Milk)*: **95mg**
  - *Custom Coffee Logger*: Any custom coffee name and mg.

### Decision 8: Boost Duration & Caffeine Decay Calculation
- **Question**: How should the `Est. Boost Duration` be calculated and presented?
- **Agreed Decision**: **Dynamic countdown from drink timestamp**.
  - Scales active focus window based on dose (e.g. ~3.5 hrs for standard cup, capped at 6.0 hrs).
  - Ticking timer updates every 30 seconds showing remaining active boost hours and minutes.

### Decision 9: Task Input & Organization
- **Question**: How should tasks be created and organized in `Today's Workload`?
- **Agreed Decision**: **Quick academic modal with Timeline & Category chips**.
  - Title input.
  - Due Timeline: `Today`, `Tomorrow`, `This Week`, `Due Soon`.
  - Category: `Quiz`, `Activity`, `Experiment`, `Exam`, `Assignment`.
  - Notes/details field.

### Decision 10: Security Verification for Data Reset & Alert Banner Dismissal
- **Agreed Decision**:
  - **Banner Dismissal & Auto-Hide**: Fixed `.hidden` utility so clicking `×` dismisses the safety banner cleanly. When caffeine intake is reset or safe (<70%), the banner automatically hides completely.
  - **Security Reset Challenge**: Instead of accidental one-click resets, clicking "Reset Today's Intake" (available in both Profile and Menu) opens a dedicated **Security Verification Modal** requiring the student to explicitly type the keyword **`RESET`** in capital letters to authorize the data wipe.

### Decision 11: Task Reminders & Completion Notifications
- **Agreed Decision**:
  - **Task Added & Active Reminder**: Adding an academic task automatically triggers an in-app reminder toast notification with task details, due date, notes, and a gentle Web Audio chime, alongside native HTML5 browser system notifications.
  - **Task Completion Celebration**: Marking a task as finished triggers a congratulatory notification showing live workload progress (e.g. `2 of 3 Completed (67%)`), celebratory audio feedback, and an all-tasks completed reward badge when reaching 100%.
  - **Periodic Study Reminder Ticker**: Regular checks remind students of pending tasks due Today so academic deadlines stay top of mind while pacing coffee intake.

---

## 3. Mathematical Formulas & Scientific Models

### 3.1 Caffeine Intake Percentage
$$\text{Percentage} = \text{round}\left( \frac{\text{Current Caffeine (mg)}}{\text{Daily Target (mg)}} \times 100 \right)$$
- If Daily Target = `215mg` and Current Intake = `75mg`:
  $$\text{Percentage} = \text{round}\left( \frac{75}{215} \times 100 \right) = 35\%$$

### 3.2 SVG Circular Gauge Arc Calculation
- Radius $r = 110\text{px}$
- Total Circumference $C = 2 \times \pi \times 110 \approx 691.15\text{px}$
$$\text{dashoffset} = C \times \left(1 - \frac{\min(\text{Percentage}, 100)}{100}\right)$$

### 3.3 Active Boost Duration Formula
$$\text{Max Boost Hours} = \min\left(6.0, 2.5 + \left(\frac{\text{Current Intake (mg)}}{100}\right) \times 1.3\right)$$
$$\text{Remaining Hours} = \max\left(0, \text{Max Boost Hours} - \frac{\text{Current Time} - \text{Last Drink Time}}{1000 \times 60 \times 60}\right)$$

### 3.4 Workload Progress Calculation
$$\text{Workload Progress \%} = \begin{cases} 0 & \text{if total tasks } = 0 \\ \text{round}\left( \frac{\text{Completed Tasks}}{\text{Total Tasks}} \times 100 \right) & \text{otherwise} \end{cases}$$

---

## 4. Application Architecture & File Map

| File | Purpose |
| :--- | :--- |
| [`index.html`](file:///c:/Users/Tom%20Jason/Desktop/Coffee/index.html) | Semantic HTML5 structure, modals, desktop viewer frame, SVG gauges. |
| [`style.css`](file:///c:/Users/Tom%20Jason/Desktop/Coffee/style.css) | Coffee design system, animations, steam micro-effects, 100% red-alert glowing states. |
| [`app.js`](file:///c:/Users/Tom%20Jason/Desktop/Coffee/app.js) | Reactive state management, `localStorage` persistence, mathematical calculations, timers. |
| [`server.js`](file:///c:/Users/Tom%20Jason/Desktop/Coffee/server.js) | Built-in zero-dependency Node.js HTTP server. |
| `assets/coffee_beans_bg.jpg` | Photorealistic coffee bean hero texture. |
| [`README.md`](file:///c:/Users/Tom%20Jason/Desktop/Coffee/README.md) | User and setup documentation. |
| [`PLANNING.md`](file:///c:/Users/Tom%20Jason/Desktop/Coffee/PLANNING.md) | This complete planning record and specifications document. |

---

## 5. Local Storage Data Schema

Key: `'caffcontrol_student_app_state_v1'`
```json
{
  "studentName": "ALEX",
  "dailyMaxMg": 215,
  "safeCeilingMg": 400,
  "currentCaffeineMg": 75,
  "lastDrinkTime": 1793005200000,
  "drinks": [
    {
      "id": "drink-1",
      "name": "Kopiko 3-in-1 (Sachet)",
      "mg": 75,
      "category": "Instant Sachet",
      "timestamp": 1793005200000
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "title": "3ls Quiz",
      "due": "Tomorrow",
      "category": "Quiz",
      "notes": "Chapters 1-3",
      "completed": false
    }
  ],
  "lastResetDate": "Mon Oct 26 2026"
}
```

---
*Document generated on October 26, 2026 for CaffControl Project Documentation.*
