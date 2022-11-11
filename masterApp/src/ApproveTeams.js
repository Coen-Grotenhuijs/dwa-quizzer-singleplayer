import React from 'react';
import './App.css';
const ws = new WebSocket("ws://localhost:8000");

class ApproveTeams extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quiz: "",
            teams: []
        };
    }


    componentDidMount() {
        this.getJoinedTeams();

        ws.onopen = () => {
            console.log("WebSocket connection established!");
        };

        ws.onmessage = (msg) => {
            msg = JSON.parse(msg.data)
            try {
                switch(msg.type) {
                    case "TEAM_JOINED":
                    case "TEAM_ACCEPTED":
                    case "TEAM_DENIED":
                        this.getJoinedTeams();
                        break;
                }
            } catch(e) {
                console.log(e);
            }
        };

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                'Accept': 'application/json'},
            credentials: 'include',
            mode: 'cors'
        };
        fetch(
            "http://localhost:8000/quiz/"+this.props.match.params.code, requestOptions)
            .then((res) => {return res.json()} )
            .then((data) => {
                this.setState({
                    quiz: data
                });
            });
    }

    startQuiz(e) {
        e.preventDefault();
        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify({
                _id: this.state.quiz._id
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };
        fetch("http://localhost:8000/quiz/"+this.state.quiz._id+"/startQuiz", requestOptions)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                ws.send(JSON.stringify({
                    type: "START_QUIZ"
                }));
                if(data.started === true){
                    this.props.history.push('/quiz/selectQuestion/'+ data.code);
                } else {
                    this.alert();
                }

            })
    }

    alert() {
        alert("Quiz moet minimaal bestaan uit 2 teams en maximaal 6")
    }


    getJoinedTeams() {
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                'Accept': 'application/json'},
            credentials: 'include',
            mode: 'cors'
        };
        fetch("http://localhost:8000/quiz/"+this.props.match.params.code+"/teams", requestOptions)
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
                        <h2>{this.state.quiz.name}</h2>
                        <p>De pubquiz app voor jong en oud. </p>
                    </div>
                </div>
                    <div className="startscreen__body">
                        <p className="textCenter">Teams kunnen zich aanmelden bij deze quiz door de volgende code in te voeren:<strong> {this.props.match.params.code}</strong><br/><br/> Accepteer de teams met wie jij de quiz wilt spelen </p>
                        <TeamList teams={this.state.teams} />
                    </div>
                <div className="approve__footer">
                        <button type="submit" onClick={(e) => this.startQuiz(e)}>Start Quiz</button>
                </div>
            </div>
        )
    }
}

function TeamList(props) {

    function acceptTeam(teamId, e) {
        e.preventDefault();
        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify({
                "_id": teamId
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };
        fetch('http://localhost:8000/team/approve/' + teamId, requestOptions)
            .then((res) => {
               console.log(res.text());
               ws.send(JSON.stringify({
                   type: 'TEAM_ACCEPTED'
               }))
            })
    }

    function denyTeam(teamId, e) {
        e.preventDefault();
        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify({
                "_id": teamId
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };
        fetch('http://localhost:8000/team/deny/' + teamId, requestOptions)
            .then((res) => {
                ws.send(JSON.stringify({
                    type: 'TEAM_DENIED'
                }))
            })
    }

    let teams;
    if(props.teams) {
        teams = props.teams.map((team) => {
            return (
                <div className="approveTeams">
                    <ul className="approveTeams__list">
                        <li key={team._id} className={`approveTeams__listItem ${team.approved === false && "danger"}`}>
                            <p>{team.name}</p>
                            <div className="approveteams__buttons">
                                <button onClick={(e) => acceptTeam(team._id, e)}>Accepteren</button>
                                <button onClick={(e) => denyTeam(team._id, e)}>Weigeren</button>
                            </div>
                        </li>
                    </ul>
                </div>
            )
        });
    }

    return (
        <div>{teams}</div>
    )
}

export default ApproveTeams