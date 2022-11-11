import React from 'react';
import './App.css';

class ResultQuiz extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            quiz: "",
            teams: []
        }
    }

    componentDidMount() {
        this.getQuiz();
        this.getApprovedTeams();
    }

    getQuiz() {
        fetch(
            "http://localhost:8000/quiz/"+this.props.match.params.code)
            .then((res) => {return res.json()} )
            .then((data) => {
                this.setState({
                    quiz: data
                });
            });
    }

    getApprovedTeams() {
        fetch("http://localhost:8000/quiz/"+this.props.match.params.code+"/approvedTeams")
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                this.setState({
                    teams: data
                })
            })
    }

    render() {
        return (
            <div className="startscreen">
                <div className="startscreen__header">
                    <div className="startscreen__headerInfo">
                        <h2>{this.state.quiz.name} </h2>
                        <p>De pubquiz app voor jong en oud. </p>
                    </div>
                </div>
                <div className="startscreen__body">
                    <p className="textCenter">Hieronder zie je de punten die de teams hebben behaald.</p>
                    <ul>
                        {this.state.teams.sort((a,b) => a.points < b.points ? 1 : -1).map((team) => {
                            return (
                            <li className="resultQuiz__resultListItem" key={team._id}>
                                <p>{team.name}</p>
                                <p><strong>{team.points}</strong></p>
                            </li>
                            )
                        })}

                    </ul>
                </div>
                <div className="approve__footer">
                </div>
            </div>
        )
    }
}

export default ResultQuiz