import { useNavigate } from 'react-router-dom';
import './Home.css';
import MagnetButton from '../components/MagnetButton';
import SplitText from '../components/SplitText';
import BlurText from '../components/BlurText';

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <section className="hero section section--hero">
                <div className="container">
                    <div className="hero__content">
                        <SplitText
                            text="Weight Delta"
                            className="hero__title"
                            tag="h1"
                            delay={50}
                            duration={0.8}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-50px"
                            textAlign="center"
                        />
                        <p className="hero__subtitle">
                            Calculate the daily calorie adjustment you need to reach your weight goal.
                            Based on established metabolic equations, not guesswork.
                        </p>
                        <MagnetButton
                            className="hero__cta"
                            glareEnabled={true}
                            onClick={() => navigate('/calculator')}
                        >
                            Open Calculator
                        </MagnetButton>
                    </div>
                </div>
            </section>

            <section className="features section">
                <div className="container">
                    <header className="features__header">
                        <BlurText
                            text="How It Works"
                            delay={200}
                            animateBy="words"
                            direction="top"
                            className="features__title"
                        />
                        <p className="features__subtitle">Three steps to your personalized calorie target.</p>
                    </header>
                    <div className="features__grid">
                        <article className="feature-card glare-card">
                            <span className="feature-card__number">01</span>
                            <h3 className="feature-card__title">Enter Your Metrics</h3>
                            <p className="feature-card__description">
                                Provide your age, height, current weight, and target weight.
                                The calculator needs accurate data for accurate results.
                            </p>
                        </article>
                        <article className="feature-card glare-card">
                            <span className="feature-card__number">02</span>
                            <h3 className="feature-card__title">Set Your Timeline</h3>
                            <p className="feature-card__description">
                                Choose a realistic duration between 4 and 16 weeks.
                                Shorter timelines require larger daily adjustments.
                            </p>
                        </article>
                        <article className="feature-card glare-card">
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
