# Quick Reference: Form to Plan Flow

## 🎯 What Happens When User Submits Form

```
┌─ User clicks "Build Your Program"
│
├─ Modal form opens with fields
│  • Age, Height (cm), Weight (kg)
│  • Injuries, Workout Days/Week
│  • Fitness Goal, Fitness Level
│  • Dietary Restrictions
│
├─ User fills form and clicks "Submit"
│  └─ handleSubmit() converts data to query params
│     Example: ?age=30&height=170&weight=60&fitness_goal=Weight%20Loss
│
├─ Navigation to /generate-program?[params]
│
├─ Server receives request with searchParams
│  └─ Extracts age, height, weight, etc. from URL
│
├─ Calls AI functions in PARALLEL:
│  ├─ generateFitnessPlan(age, height, weight, injuries, etc.)
│  │  └─ Returns: { schedule, exercises[] }
│  │
│  └─ generateMealsPlan(age, height, weight, dietary_restrictions, etc.)
│     └─ Returns: { dailyCalories, meals[] }
│
└─ Display page with both plans + user info summary
   ├─ Fitness Plan (JSON preview)
   ├─ Nutrition Plan (JSON preview)
   └─ User Information (summary table)
```

## 📝 Files Changed

| File | What Changed | Why |
|------|-------------|-----|
| `ClientModalWrapper.tsx` | Added `useRouter` and navigation on submit | Pass form data to generation page |
| `page.tsx` | Reads `searchParams` and calls AI functions | Generate plans based on user input |
| `ai.js` | Fixed type annotations and response handling | Properly parse and return plans |

## 🔌 Connection Points

### 1. Form (inf_form.tsx) → ClientModalWrapper.tsx
```
Form collects data → onSubmit(data) → handleSubmit()
```

### 2. ClientModalWrapper.tsx → /generate-program
```
handleSubmit() → Convert to query params → router.push()
```

### 3. /generate-program → AI Functions
```
page.tsx reads searchParams → Calls generateFitnessPlan() & generateMealsPlan()
```

### 4. AI Functions → Response
```
API calls → Retry logic → JSON response → Display on page
```

## 💾 Data Passed Through URL

```typescript
{
  age: string;              // "30"
  height: string;           // "170" (cm)
  weight: string;           // "60" (kg)
  injuries?: string;        // "knee pain" (optional)
  workout_days?: string;    // "4"
  fitness_goal: string;     // "Weight Loss" | "Muscle Gain" | "Endurance" | "General Fitness"
  fitness_level: string;    // "Beginner" | "Intermediate" | "Advanced"
  dietary_restrictions?: string; // "vegetarian" (optional)
}
```

## 🎨 Page.tsx Output

### Layout
```
Title: "Your Personalized Plans"
    ↓
[Error message if any]
    ↓
Two-column grid (responsive)
├─ Fitness Plan box
│  ├─ Title: "Fitness Plan"
│  └─ Content: JSON preview of generated plan
│
└─ Nutrition Plan box
   ├─ Title: "Nutrition Plan"
   └─ Content: JSON preview of generated plan
    ↓
User Information Summary (4-column grid)
├─ Age: {value}
├─ Height: {value} cm
├─ Weight: {value} kg
├─ Fitness Goal: {value}
├─ Fitness Level: {value}
├─ Workout Days: {value}
├─ Injuries: {value} (if provided)
└─ Dietary Restrictions: {value} (if provided)
```

## ⚡ Performance

- **Sequential Before**: 1. Generate fitness plan → 2. Generate nutrition plan
- **Parallel Now**: 1 & 2 happen simultaneously using `Promise.all()`
- **Time Saved**: ~15-30 seconds per generation

## 🛡️ Error Handling

```
If GEMINI_API_KEY missing
    ↓
generateFitnessPlan() throws error
    ↓
catch block in page.tsx
    ↓
error state = message
    ↓
Display error message to user: "Error generating plans: [error]"
```

## 🧪 Local Testing

```bash
npm run dev
# Open http://localhost:3000
# Click "Build Your Program"
# Fill in form
# Submit
# Watch browser navigate to /generate-program?...
# See plans display (10-30 seconds for AI)
```

## 🚀 Deployment

```bash
# 1. Set env vars in Vercel
NEXT_PUBLIC_CONVEX_URL=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
GEMINI_API_KEY=...

# 2. Push to GitHub
git add .
git commit -m "Implement form to plan generation flow"
git push

# 3. Vercel auto-deploys (or manual redeploy)
```

## 📊 API Calls

### Google Gemini API
- **Model**: `gemini-2.0-flash`
- **Requests**: 2 per user (fitness + nutrition)
- **Timeout**: ~30 seconds per request
- **Retry**: Exponential backoff (1s → 2s → 4s)
- **Rate Limit**: 429 handled automatically

## ✅ Implementation Checklist

- [x] Form collects user data
- [x] Submit button works
- [x] Data converted to query params
- [x] Navigation to /generate-program works
- [x] Query params read correctly
- [x] AI functions called with correct data
- [x] Both plans generated in parallel
- [x] Plans displayed on page
- [x] Error handling implemented
- [x] Build successful
- [x] No TypeScript errors
- [x] No Tailwind warnings

## 📞 Support

If something doesn't work:
1. Check browser console for errors
2. Check `npm run build` output
3. Verify GEMINI_API_KEY is set
4. Check Vercel logs if deployed
5. Look at page.tsx error handling block

---

**Ready for production** ✅
