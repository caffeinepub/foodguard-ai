# Specification

## Summary
**Goal:** Build FoodGuard AI, a mobile-optimized food health scanner app with simulated food identification, ingredient analysis, personalized health warnings, and a clean green/white medical-grade UI.

**Planned changes:**
- Splash screen showing logo, app name "FoodGuard AI", and tagline, auto-transitioning after ~2 seconds
- Home screen with a prominent "Scan Food" button, app description, and navigation to Profile
- Camera screen using the browser MediaDevices API with a viewfinder overlay and Capture button; supports a "label scan" mode with a text input fallback for ingredient entry
- Result screen displaying food name, calories, sugar level, fat level, a circular health score gauge (0–100), a color-coded status badge (Safe/Moderate/Harmful), harmful ingredient warning badges, and personalized health warnings based on user profile
- Profile screen with inputs for age, weight, and multi-select health conditions (Diabetes, High Blood Pressure, High Cholesterol, Heart Disease, Obesity, None); data saved to and loaded from the backend
- Backend food database with at least 20 common foods and realistic nutritional data; health score computed from base 100 with deductions for high sugar, high fat, and preservatives; status mapped by score range
- Backend harmful ingredient keyword list for detecting high sugar, MSG, artificial colors (Red 40, Yellow 5, Blue 1, etc.), and preservatives (sodium benzoate, BHA, BHT, TBHQ)
- Backend personalized warning logic cross-referencing food results with user health conditions (Diabetes + high sugar, High Blood Pressure + preservatives, Heart Disease + high fat, Obesity + high calories)
- Consistent deep green and white design system with card layouts, modern sans-serif typography, smooth page transitions, and mobile viewport optimization (~430px max-width)

**User-visible outcome:** Users can open the app, scan or manually describe a food item or ingredient label, and immediately see a detailed health analysis with a score, status badge, harmful ingredient warnings, and personalized cautions based on their saved health profile.
