# Competency Framework Architecture | Martha Alles Methodology

Interactive SCORM 1.2 course package and standalone web application based on the Martha Alicia Alles Competencies Trilogy (*Diccionario de Competencias*, *Diccionario de Comportamientos*, *Diccionario de Preguntas*).

## Live Course
Online deployment on GitHub Pages:
**[https://hetcxp.github.io/competencies/](https://hetcxp.github.io/competencies/)**

## Architecture & Instructional Features
- **Action Mapping & Inverted Challenge:** Problem-first pedagogical model (Kathy Moore & productive failure).
- **Dual-Track Progression:** Core action track with non-blocking, on-demand theoretical sidebars (Spencer & Spencer, Elliott Jaques, Flanagan, Cohen).
- **Behaviorally Anchored Rating Scales (BARS):** 4-tier objective scale (Grades A-D) rooted in time-horizon, autonomy, and organizational impact.
- **Critical Incident Interview Simulator:** Conversational STAR inquiry and probing technique against hypothetical rhetoric.
- **Capstone Studio:** Full corporate specification builder and automated `.docx` Word export.
- **Bilingual System:** Dynamic zero-reload toggle between Spanish (ES) and English (EN) with localized vector assets (SVG).
- **Universal LMS Package & Dual Runtime:** Standard SCORM 1.2 distributable package (ADL CP 1.2) for cross-platform LMS compatibility (Moodle, Blackboard, Canvas, SCORM Cloud). Built with a dual-runtime adapter supporting SCORM 1.2 and SCORM 2004 APIs, plus automatic offline fallback to `localStorage` for standalone web hosting.

## Local Development & Testing
Run unit tests natively with Node.js:
```bash
node --test tests/*.test.js
```
