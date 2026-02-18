import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeaturesList from '../components/FeaturesList';

const Home: React.FC = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>Welcome to the Live Cricket Project</h1>
                <p>Explore all the features available to you:</p>
                <FeaturesList />
            </main>
            <Footer />
        </div>
    );
};

export default Home;