import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import Landing from '../pages/Landing';

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/home" component={Home} />
                <Route path="/" component={Landing} />
            </Switch>
        </Router>
    );
};

export default Routes;