/**
 * Calorie calculation utilities
 * Harris-Benedict BMR, TDEE, daily target, macro breakdown
 * Includes safe-goal constraint helpers
 */

/**
 * Harris-Benedict BMR
 * Male:   88.362 + (13.397 × weight) + (4.799 × height) − (5.677 × age)
 * Female: 447.593 + (9.247 × weight) + (3.098 × height) − (4.330 × age)
 * Other:  average of male and female
 */
export function calcBMR(gender, weightKg, heightCm, age) {
    const w = parseFloat(weightKg) || 70;
    const h = parseFloat(heightCm) || 170;
    const a = parseFloat(age) || 25;

    if (gender === 'male') {
        return 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
    }
    if (gender === 'female') {
        return 447.593 + 9.247 * w + 3.098 * h - 4.330 * a;
    }
    // "other" — average of male and female formulas
    const male = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
    const female = 447.593 + 9.247 * w + 3.098 * h - 4.330 * a;
    return (male + female) / 2;
}

/**
 * TDEE = BMR × activity multiplier
 * Default: sedentary (1.2)
 */
export function calcTDEE(bmr, multiplier = 1.2) {
    return bmr * multiplier;
}

/**
 * Clamp target weight to safe weekly change limits:
 *   Weight loss: max 1.0 kg/week
 *   Weight gain: max 0.5 kg/week
 */
export function clampTargetWeight(currentWeight, targetWeight, weeks) {
    const cw = parseFloat(currentWeight) || 70;
    let tw = parseFloat(targetWeight) || cw;
    const w = parseInt(weeks) || 8;

    const diff = tw - cw;
    if (diff < 0) {
        // Loss — cap at 1.0 kg/week
        const maxLoss = w * 1.0;
        if (Math.abs(diff) > maxLoss) {
            tw = cw - maxLoss;
        }
    } else if (diff > 0) {
        // Gain — cap at 0.5 kg/week
        const maxGain = w * 0.5;
        if (diff > maxGain) {
            tw = cw + maxGain;
        }
    }
    return Math.round(tw * 10) / 10;
}

/**
 * Daily calorie target
 * 1 kg body fat ≈ 7700 kcal
 * totalChange = (targetWeight − currentWeight) × 7700
 * dailyAdjustment = totalChange / (weeks × 7)
 * dailyTarget = tdee + dailyAdjustment
 *
 * Constraints:
 *   - dailyAdjustment capped to ±1000 kcal/day
 *   - Clamped to safe minimums: 1200 (female), 1500 (male), 1350 (other)
 */
export function calcDailyTarget(tdee, currentWeight, targetWeight, weeks, gender) {
    const cw = parseFloat(currentWeight) || 70;
    const tw = parseFloat(targetWeight) || 70;
    const w = parseInt(weeks) || 8;

    const weightChange = tw - cw;
    const totalCalorieChange = weightChange * 7700;
    const days = w * 7;
    let dailyAdjustment = totalCalorieChange / days;

    // Cap daily adjustment to ±1000 kcal/day
    dailyAdjustment = Math.max(-1000, Math.min(1000, dailyAdjustment));

    let target = Math.round(tdee + dailyAdjustment);

    // Clamp to safe minimums
    const minCals = gender === 'female' ? 1200 : gender === 'male' ? 1500 : 1350;
    target = Math.max(target, minCals);

    return { dailyTarget: target, dailyAdjustment: Math.round(dailyAdjustment) };
}

/**
 * Macro breakdown from daily calories
 * Protein: 34% (4 cal/g)
 * Carbs:   42% (4 cal/g)
 * Fat:     24% (9 cal/g)
 */
export function calcMacros(dailyCalories) {
    const cal = dailyCalories || 2000;
    return {
        protein: { pct: 34, grams: Math.round((cal * 0.34) / 4) },
        carbs: { pct: 42, grams: Math.round((cal * 0.42) / 4) },
        fat: { pct: 24, grams: Math.round((cal * 0.24) / 9) },
    };
}

/**
 * Validate and clamp numeric inputs on blur/commit.
 * Returns clamped value within [min, max].
 */
export function clampValue(value, min, max) {
    const n = parseFloat(value);
    if (isNaN(n)) return min;
    return Math.max(min, Math.min(max, Math.round(n * 10) / 10));
}
