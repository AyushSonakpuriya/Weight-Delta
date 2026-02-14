import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { fetchUserHistory } from '../services/history';
import Form from '../components/Form';
import Result from '../components/Result';
import BlurText from '../components/BlurText';
import './Calculator.css';

function Calculator() {
    const [result, setResult] = useState(null);

    useEffect(() => {
        fetchUserHistory()
            .then((data) => {
                console.log("HISTORY:", data);
            })
            .catch((err) => {
                console.error("HISTORY ERROR:", err);
            });
    }, []);

    const handleCalculate = async (data) => {
        setResult(data);

        const {
            data: { session }
        } = await supabase.auth.getSession();

        const payload = {
            user_id: session.user.id,
            age: data.age,
            height_cm: data.height,
            current_weight: data.currentWeight,
            desired_weight: data.desiredWeight,
            duration_weeks: data.duration,
            daily_calories: data.dailyTarget,
        };


        console.log("INSERT PAYLOAD:", payload);

        const { data: insertData, error } = await supabase
            .from("calculations")
            .insert(payload);

        console.log("INSERT ERROR:", error);
    };

    return (
        <section className="calculator section">
            <div className="container">
                <header className="calculator__header">
                    <BlurText
                        text="Calorie Goal Calculator"
                        delay={200}
                        animateBy="words"
                        direction="top"
                        className="calculator__title"
                    />
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
                        <div className="calculator__info glare-card">
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
