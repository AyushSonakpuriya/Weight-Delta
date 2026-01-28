import './Result.css';

function Result({ data }) {
    if (!data) return null;

    const {
        name,
        currentWeight,
        desiredWeight,
        duration,
        bmr,
        tdee,
        dailyAdjustment,
        dailyTarget,
        isDeficit
    } = data;

    const weightChange = Math.abs(desiredWeight - currentWeight).toFixed(1);
    const adjustmentType = isDeficit ? 'deficit' : 'surplus';
    const actionWord = isDeficit ? 'lose' : 'gain';

    return (
        <div className="result">
            <h3 className="result__title">Your Calorie Target</h3>
            <p className="result__greeting">
                Results for {name}
            </p>

            <div className="result__metrics">
                <div className="result__metric">
                    <div className="result__metric-value">{bmr}</div>
                    <div className="result__metric-label">BMR (cal/day)</div>
                </div>
                <div className="result__metric">
                    <div className="result__metric-value">{tdee}</div>
                    <div className="result__metric-label">Maintenance</div>
                </div>
                <div className="result__metric">
                    <div className="result__metric-value">{dailyTarget}</div>
                    <div className="result__metric-label">Daily Target</div>
                </div>
            </div>

            <p className="result__summary">
                To {actionWord} <span className="result__highlight">{weightChange} kg</span> in {duration} weeks,
                consume approximately <span className="result__highlight">{dailyTarget} calories</span> per day.
                This represents a daily {adjustmentType} of {Math.abs(dailyAdjustment)} calories from your
                maintenance level of {tdee} calories.
            </p>
        </div>
    );
}

export default Result;
