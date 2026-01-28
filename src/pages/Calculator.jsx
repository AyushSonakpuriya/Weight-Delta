import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Form from '../components/Form';
import Result from '../components/Result';
import './Calculator.css';

function Calculator() {
    const [result, setResult] = useState(null);

    const handleCalculate = async (data) => {
        setResult(data);

        // Save calculation to Supabase
        const {
            data: { session }
        } = await supabase.auth.getSession();

        await supabase.from("calculations").insert({
            user_id: session.user.id,
            age: data.age,
            height: data.height,
            current_weight: data.currentWeight,
            desired_weight: data.desiredWeight,
            duration: data.duration,
            daily_calories: data.dailyTarget
        });
    };

    return (
        <section className="calculator section">
            <div className="container">
                <header className="calculator__header">
                    <h1 className="calculator__title">Calorie Goal Calculator</h1>
                    <p className="calculator__description">
                        Enter your details below to calculate the daily calorie intake needed to reach your target weight.
                    </p>
                </header>

                <div className="calculator__layout">
                    <div className="calculator__main">
                        <Form onCalculate={handleCalculate} />
                        <Result data={result} />
                    </div>

                    <aside className="calculator__sidebar">
                        <div className="calculator__info">
                            <h3 className="calculator__info-title">About This Calculator</h3>
                            <p className="calculator__info-text">
                                This tool uses the Harris-Benedict equation to estimate your Basal Metabolic Rate (BMR),
                                then calculates the calorie adjustment needed based on your weight goal and timeline.
                            </p>
                            <p className="calculator__info-text">
                                Results are estimates. Actual calorie needs vary based on activity level,
                                body composition, and individual metabolism.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}

export default Calculator;
