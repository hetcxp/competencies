# Competency Framework Architecture | Martha Alles Methodology

Interactive SCORM 1.2 / 2004 course and standalone web application based on the Martha Alicia Alles Competencies Trilogy (*Diccionario de Competencias*, *Diccionario de Comportamientos*, *Diccionario de Preguntas*).

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
- **LMS Agnostic & Standalone Fallback:** Full SCORM 1.2 and SCORM 2004 compliance, with graceful automatic fallback to `localStorage` when running standalone.

## Local Development & Testing
Run unit tests natively with Node.js:
```bash
node --test tests/*.test.js
```
