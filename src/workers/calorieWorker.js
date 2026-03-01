/**
 * Calorie Calculation Web Worker
 * Offloads BMR/TDEE/DailyTarget/Macro computations off the main thread
 * to eliminate long tasks during slider interactions.
 */

/* ---- Harris-Benedict BMR ---- */
function calcBMR(gender, weightKg, heightCm, age) {
    const w = parseFloat(weightKg) || 70;
    const h = parseFloat(heightCm) || 170;
    const a = parseFloat(age) || 25;

    if (gender === 'male') {
        return 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
    }
    if (gender === 'female') {
        return 447.593 + 9.247 * w + 3.098 * h - 4.330 * a;
    }
    const male = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
    const female = 447.593 + 9.247 * w + 3.098 * h - 4.330 * a;
    return (male + female) / 2;
}

/* ---- TDEE ---- */
function calcTDEE(bmr, multiplier = 1.2) {
    return bmr * multiplier;
}

/* ---- Clamp target weight ---- */
function clampTargetWeight(currentWeight, targetWeight, weeks) {
    const cw = parseFloat(currentWeight) || 70;
    let tw = parseFloat(targetWeight) || cw;
    const w = parseInt(weeks) || 8;

    const diff = tw - cw;
    if (diff < 0) {
        const maxLoss = w * 1.0;
        if (Math.abs(diff) > maxLoss) tw = cw - maxLoss;
    } else if (diff > 0) {
        const maxGain = w * 0.5;
        if (diff > maxGain) tw = cw + maxGain;
    }
    return Math.round(tw * 10) / 10;
}

/* ---- Daily calorie target ---- */
function calcDailyTarget(tdee, currentWeight, targetWeight, weeks, gender) {
    const cw = parseFloat(currentWeight) || 70;
    const tw = parseFloat(targetWeight) || 70;
    const w = parseInt(weeks) || 8;

    const weightChange = tw - cw;
    const totalCalorieChange = weightChange * 7700;
    const days = w * 7;
    let dailyAdjustment = totalCalorieChange / days;
    dailyAdjustment = Math.max(-1000, Math.min(1000, dailyAdjustment));

    let target = Math.round(tdee + dailyAdjustment);
    const minCals = gender === 'female' ? 1200 : gender === 'male' ? 1500 : 1350;
    target = Math.max(target, minCals);

    return { dailyTarget: target, dailyAdjustment: Math.round(dailyAdjustment) };
}

/* ---- Macro breakdown ---- */
function calcMacros(dailyCalories) {
    const cal = dailyCalories || 2000;
    return {
        protein: { pct: 34, grams: Math.round((cal * 0.34) / 4) },
        carbs: { pct: 42, grams: Math.round((cal * 0.42) / 4) },
        fat: { pct: 24, grams: Math.round((cal * 0.24) / 9) },
    };
}

/* ---- Message handler ---- */
self.onmessage = function (e) {
    const { type, payload } = e.data;

    if (type === 'COMPUTE') {
        const { gender, currentWeight, height, age, targetWeight, duration } = payload;

        const safeTargetWeight = clampTargetWeight(currentWeight, targetWeight, duration);
        const bmr = calcBMR(gender, currentWeight, height, age);
        const tdee = calcTDEE(bmr);
        const { dailyTarget, dailyAdjustment } = calcDailyTarget(
            tdee, currentWeight, safeTargetWeight, duration, gender
        );
        const macros = calcMacros(dailyTarget);

        self.postMessage({
            type: 'RESULT',
            payload: {
                bmr: Math.round(bmr),
                tdee: Math.round(tdee),
                dailyTarget,
                dailyAdjustment,
                macros,
                isDeficit: safeTargetWeight < currentWeight,
                safeTargetWeight,
            },
        });
    }
};
