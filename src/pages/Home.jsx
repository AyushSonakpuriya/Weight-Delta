import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <>
            <section className="hero section section--hero">
                <div className="container">
                    <div className="hero__content">
                        <h1 className="hero__title">Weight Delta</h1>
                        <p className="hero__subtitle">
                            Calculate the daily calorie adjustment you need to reach your weight goal.
                            Based on established metabolic equations, not guesswork.
                        </p>
                        <Link to="/calculator" className="hero__cta">
                            Open Calculator
                        </Link>
                    </div>
                </div>
            </section>

            <section className="features section">
                <div className="container">
                    <header className="features__header">
                        <h2 className="features__title">How It Works</h2>
                        <p className="features__subtitle">Three steps to your personalized calorie target.</p>
                    </header>
                    <div className="features__grid">
                        <article className="feature-card">
                            <span className="feature-card__number">01</span>
                            <h3 className="feature-card__title">Enter Your Metrics</h3>
                            <p className="feature-card__description">
                                Provide your age, height, current weight, and target weight.
                                The calculator needs accurate data for accurate results.
                            </p>
                        </article>
                        <article className="feature-card">
                            <span className="feature-card__number">02</span>
                            <h3 className="feature-card__title">Set Your Timeline</h3>
                            <p className="feature-card__description">
                                Choose a realistic duration between 4 and 16 weeks.
                                Shorter timelines require larger daily adjustments.
                            </p>
                        </article>
                        <article className="feature-card">
                            <span className="feature-card__number">03</span>
                            <h3 className="feature-card__title">Get Your Target</h3>
                            <p className="feature-card__description">
                                Receive your daily calorie target based on the Harris-Benedict
                                equation and basic thermodynamic principles.
                            </p>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
