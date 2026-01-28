import { Link } from 'react-router-dom';
import './About.css';

function About() {
    return (
        <section className="about section">
            <div className="container">
                <header className="about__header">
                    <h1 className="about__title">About Weight Delta</h1>
                    <p className="about__intro">
                        A straightforward calorie estimation tool built on metabolic equations
                        and basic thermodynamics.
                    </p>
                </header>

                <div className="about__content">
                    <main className="about__main">
                        <article className="about__section" id="purpose">
                            <h2 className="about__section-title">Purpose</h2>
                            <p className="about__text">
                                Weight Delta helps users understand the daily calorie adjustments
                                required to reach a target weight within a specified timeframe.
                                It provides a calculation based on the Harris-Benedict equation for
                                Basal Metabolic Rate.
                            </p>
                        </article>

                        <article className="about__section" id="methodology">
                            <h2 className="about__section-title">Methodology</h2>
                            <p className="about__text">
                                The calculator estimates your Basal Metabolic Rate (BMR) using the
                                Harris-Benedict equation. A standard activity multiplier (1.55, assuming
                                moderate activity) is applied to estimate Total Daily Energy Expenditure (TDEE).
                            </p>
                            <p className="about__text">
                                Weight change calculations assume approximately 7,700 calories per kilogram
                                of body weight. The daily adjustment is derived by dividing the total calorie
                                change by the number of days in your timeline.
                            </p>
                        </article>

                        <article className="about__section" id="limitations">
                            <h2 className="about__section-title">Limitations</h2>
                            <p className="about__text">
                                This tool provides estimates only. Results depend on factors not captured here:
                            </p>
                            <ul className="about__list">
                                <li>Individual metabolic variations</li>
                                <li>Actual activity levels beyond the assumed baseline</li>
                                <li>Body composition and muscle mass</li>
                                <li>Hormonal factors and medical conditions</li>
                                <li>Accuracy of self-reported measurements</li>
                            </ul>
                        </article>

                        <article className="about__section" id="disclaimer">
                            <h2 className="about__section-title">Disclaimer</h2>
                            <p className="about__text">
                                This tool is for informational purposes only. It does not constitute
                                medical or nutritional advice. Consult a healthcare professional before
                                making significant changes to your diet or exercise routine.
                            </p>
                        </article>
                    </main>

                    <aside className="about__sidebar">
                        <nav className="about__quick-links">
                            <h3 className="about__quick-links-title">On This Page</h3>
                            <ul className="about__quick-links-list">
                                <li><a href="#purpose">Purpose</a></li>
                                <li><a href="#methodology">Methodology</a></li>
                                <li><a href="#limitations">Limitations</a></li>
                                <li><a href="#disclaimer">Disclaimer</a></li>
                            </ul>
                        </nav>
                    </aside>
                </div>
            </div>
        </section>
    );
}

export default About;
