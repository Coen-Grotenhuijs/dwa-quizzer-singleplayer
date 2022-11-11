import React from 'react';
import './App.css';
const ws = new WebSocket("ws://localhost:8000");

class CreateTeam extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quiz: "",
            teamname: "",
            team: ""
        }

    }

    componentDidMount() {
        this.getQuiz();

        ws.onopen = () => {
            console.log("WebSocket connection established!");
        };

        ws.onmessage = (msg) => {
            msg = JSON.parse(msg.data)
            try {
                switch(msg.type) {
                    case "TEAM_ACCEPTED":
                        this.getTeam();

                        break;
                    case "TEAM_DENIED":
                        this.getTeam();
                        break;
                    case "START_QUIZ":
                        if (this.state.team.approved === true) {
                            this.props.history.push('/quiz/'+this.state.quiz.code+"/"+this.state.team._id+"/answerQuestion");
                        }
                        break;
                }
            } catch(e) {
                console.log(e);
            }
        };
    }

    getTeam() {
        fetch(
            "http://localhost:8000/team/"+this.state.team._id
        )
            .then((res) => {
                return res.json();
            })
            .then((data) => {
            this.setState({
                team: data
        })
        })
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

    handleChange = (event) => {
        this.setState(
            {
                teamname: event.target.value
            }
        );
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                'Accept': 'application/json'},
            body: JSON.stringify({
                "name": this.state.teamname,
                "quizId": this.state.quiz._id
            })
        };
        fetch('http://localhost:8000/team/create',requestOptions)
            .then((res)  => {
                if(res.ok) {
                    return res.json()
                } else {
                    throw new Error ('Naam mag niet leeg zijn en moet uniek zijn.');
                }
            })
            .then((data) => {
                this.setState({
                    team: data
                });
                ws.send(JSON.stringify({
                    type: "TEAM_JOINED"
                }));
            })
            .catch((error) => {
                console.log(error.message);
                this.setState({
                    'error': error.message
                })
            })
    };

    changeName = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                'Accept': 'application/json'},
            body: JSON.stringify({
                "teamId": this.state.team._id,
                "name": this.state.teamname
            })
        };
        fetch('http://localhost:8000/team/changename',requestOptions)
            .then((res)  => {
                return res.json()
            })
            .then((data) => {
                this.setState({
                    team: data
                });
                ws.send(JSON.stringify({
                    type: "TEAM_JOINED"
                }));
            })
    };

    render() {
        const teamCreated = this.state.team;
        return (
            <div className="startscreen">
                <div className="startscreen__header">
                    <div className="startscreen__headerInfo">
                        <h3>{this.state.quiz.name}</h3>
                        <p>De pubquiz app voor jong en oud.</p>
                    </div>
                </div>
                <div className="startscreen__body">
                    <div className="joinQuiz__body__quiznameInput">
                        {teamCreated === "" ? (
                            <form onSubmit={this.handleSubmit}>
                                <p>Bedenk een leuke naam voor jullie team en vul deze hieronder in.</p>
                                <p className='danger'>{this.state.error ? this.state.error : ''}</p>
                                <input className="startscreen__input" type="text" placeholder="Team naam" value={this.state.teamname} onChange={this.handleChange}  />
                                <button type="submit">Speel mee</button>
                            </form> ) : (
                            <form onSubmit={this.changeName}>
                                <br />
                                <p>Wacht op het moment dat de Quiz master jullie team goedkeurd.<br /> Ondertussen kan je je team naam nog aanpassen</p><br />
                                <input className="startscreen__input" type="text" placeholder={this.state.team.name} value={this.state.teamname} onChange={this.handleChange}  />
                                <button type="submit">Verander team naam</button>
                            </form>
                            )}
                    <div/>
                    </div>

                </div>
                <div className="joinQuiz__footer">
                </div>
            </div>
        )
    }
}




export default CreateTeam