import { useState } from 'react';
import './Form.css';
import MagnetButton from './MagnetButton';

function Form({ onCalculate }) {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        age: '',
        gender: 'male',
        height: '',
        currentWeight: '',
        desiredWeight: '',
        duration: '8'
    });
    const [error, setError] = useState('');

    const validateWeightPlan = (data) => {
        const current = parseFloat(data.currentWeight);
        const desired = parseFloat(data.desiredWeight);
        const weeks = parseInt(data.duration);

        // 1. Weight Input Validation (30-300kg)
        if (current < 30 || current > 300 || desired < 30 || desired > 300) {
            return "Weight must be between 30 kg and 300 kg.";
        }

        // 2. Logical Validation (Current !== Desired)
        if (current === desired) {
            return "Current and target weight cannot be the same.";
        }

        // 3. Duration Limits (4-52 weeks) 
        // Note: HTML select handles this but logic should match requirements
        if (weeks < 4 || weeks > 52) {
            return "Duration must be between 4 and 52 weeks.";
        }

        // 4. Weight Change Rate Limits (Hard cap 1.25kg/week)
        const weightChange = Math.abs(desired - current);
        const ratePerWeek = weightChange / weeks;

        if (ratePerWeek > 2.0) {
            return `Target weight change is too aggressive. Maximum rate is 2 kg per week (Selected: ${ratePerWeek.toFixed(2)} kg/week).`;
        }

        return null; // Valid
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateWeightPlan(formData);
        if (validationError) {
            setError(validationError);
            return;
        }

        const { age, gender, height, currentWeight, desiredWeight, duration } = formData;

        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * parseFloat(currentWeight)) + (4.799 * parseFloat(height)) - (5.677 * parseFloat(age));
        } else {
            bmr = 447.593 + (9.247 * parseFloat(currentWeight)) + (3.098 * parseFloat(height)) - (4.330 * parseFloat(age));
        }

        const weightChange = parseFloat(desiredWeight) - parseFloat(currentWeight);
        const totalCalorieChange = weightChange * 7700;
        const days = parseInt(duration) * 7;
        const dailyAdjustment = Math.round(totalCalorieChange / days);

        const tdee = Math.round(bmr * 1.55);
        const dailyTarget = tdee + dailyAdjustment;

        onCalculate({
            name: formData.name,
            age: parseFloat(age),
            height: parseFloat(height),
            currentWeight: parseFloat(currentWeight),
            desiredWeight: parseFloat(desiredWeight),
            duration: parseInt(duration),
            bmr: Math.round(bmr),
            tdee,
            dailyAdjustment,
            dailyTarget,
            isDeficit: weightChange < 0
        });
    };

    return (
        <form className="calculator-form" onSubmit={handleSubmit}>
            <div className="form__row">
                <div className="form__group">
                    <label className="form__label" htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form__input"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form__group">
                    <label className="form__label" htmlFor="contact">Email or Phone</label>
                    <input
                        type="text"
                        id="contact"
                        name="contact"
                        className="form__input"
                        placeholder="Enter email or phone"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form__row">
                <div className="form__group">
                    <label className="form__label" htmlFor="age">Age</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        className="form__input"
                        placeholder="Years"
                        min="15"
                        max="100"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form__group">
                    <label className="form__label">Gender</label>
                    <div className="form__radio-group">
                        <label className="form__radio-label">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={handleChange}
                            />
                            Male
                        </label>
                        <label className="form__radio-label">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={handleChange}
                            />
                            Female
                        </label>
                    </div>
                </div>
            </div>

            <div className="form__group">
                <label className="form__label" htmlFor="height">Height (cm)</label>
                <input
                    type="number"
                    id="height"
                    name="height"
                    className="form__input"
                    placeholder="Enter height in centimeters"
                    min="100"
                    max="250"
                    value={formData.height}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form__row">
                <div className="form__group">
                    <label className="form__label" htmlFor="currentWeight">Current Weight (kg)</label>
                    <input
                        type="number"
                        id="currentWeight"
                        name="currentWeight"
                        className="form__input"
                        placeholder="Current weight"
                        min="30"
                        max="300"
                        step="0.1"
                        value={formData.currentWeight}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form__group">
                    <label className="form__label" htmlFor="desiredWeight">Target Weight (kg)</label>
                    <input
                        type="number"
                        id="desiredWeight"
                        name="desiredWeight"
                        className="form__input"
                        placeholder="Target weight"
                        min="30"
                        max="300"
                        step="0.1"
                        value={formData.desiredWeight}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form__group">
                <label className="form__label" htmlFor="duration">Timeline</label>
                <select
                    id="duration"
                    name="duration"
                    className="form__select"
                    value={formData.duration}
                    onChange={handleChange}
                >
                    <option value="4">4 weeks</option>
                    <option value="8">8 weeks</option>
                    <option value="12">12 weeks</option>
                    <option value="16">16 weeks</option>
                </select>
            </div>

            {error && (
                <div className="form__error">
                    {error}
                </div>
            )}

            <MagnetButton type="submit" className="form__submit">
                Calculate Calorie Target
            </MagnetButton>
        </form>
    );
}

export default Form;
