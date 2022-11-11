import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import JoinQuiz from '../../team-app/src/JoinQuiz';
import CreateTeam from './CreateTeam';
import AnswerQuestion from './AnswerQuestion';

function App() {
    return (
        <div className="app">
            <div className="app__body">
                <Router>
                    <Switch>
                        <Route exact path="/" render={props => <JoinQuiz {...props} />} />
                        <Route exact path="/joinQuiz/:code" render={props => <CreateTeam {...props} />} />
                        <Route exact path="/quiz/:code/:teamcode/answerQuestion" render={props => <AnswerQuestion {...props} />} />
                    </Switch>
                </Router>
            </div>
        </div>
    );
}

export default App;
