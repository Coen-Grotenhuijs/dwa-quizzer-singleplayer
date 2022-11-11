import React from "react";
import './App.css';
import Startscreen from './Startscreen';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ApproveTeams from './ApproveTeams';
import SelectQuestion from './SelectQuestion';
import ReviewAnswers from './ReviewAnswers';
import ResultQuiz from './ResultQuiz';

class App extends React.Component {

    render() {
        return (
            // BEM naming convention
            <div className="app">
                <div className="app__body">
                    <Router>
                        <Switch>
                            <Route exact path="/">
                                <Startscreen />
                            </Route>
                            <Route exact path="/quiz/:code" render={(props) => <ApproveTeams {...props} />} />
                            <Route exact path="/quiz/selectQuestion/:code" render={(props) => <SelectQuestion{...props} />} />
                            <Route exact path="/quiz/reviewAnswers/:code" render={(props) => <ReviewAnswers{...props} />} />
                            <Route exact path="/quiz/resultQuiz/:code" render={(props) => <ResultQuiz{...props} />} />
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }
}

export default App;
