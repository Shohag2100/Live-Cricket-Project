import React from 'react';

const Landing: React.FC = () => {
    return (
        <div>
            <header>
                <h1>Welcome to Live Cricket</h1>
                <p>Your one-stop destination for live cricket updates and features.</p>
            </header>
            <main>
                <h2>Features</h2>
                <ul>
                    <li>Live Scores</li>
                    <li>Match Schedules</li>
                    <li>Player Stats</li>
                    <li>News and Updates</li>
                </ul>
                <p>Please sign in to access all features.</p>
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Live Cricket Project</p>
            </footer>
        </div>
    );
};

export default Landing;