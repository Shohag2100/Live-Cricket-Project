import React from 'react';

const features = [
    { id: 1, name: 'Live Match Scores', description: 'Get real-time updates on live cricket matches.' },
    { id: 2, name: 'Player Statistics', description: 'View detailed statistics of your favorite players.' },
    { id: 3, name: 'Match Schedules', description: 'Stay updated with upcoming match schedules.' },
    { id: 4, name: 'News and Updates', description: 'Read the latest news and updates from the cricket world.' },
    { id: 5, name: 'Team Rankings', description: 'Check the latest rankings of international cricket teams.' },
];

const FeaturesList: React.FC = () => {
    return (
        <div className="features-list">
            <h2>Features</h2>
            <ul>
                {features.map(feature => (
                    <li key={feature.id}>
                        <h3>{feature.name}</h3>
                        <p>{feature.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FeaturesList;