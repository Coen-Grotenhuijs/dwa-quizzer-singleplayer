import React from 'react';
import './App.css';
const ws = new WebSocket("ws://localhost:8000");

class ReviewAnswers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: "",
            teams: [],
            question: ""
        }
    }

    componentDidMount() {
        this.getQuiz();
        this.getApprovedTeams();
        this.getQuestion();

        ws.onmessage = (msg) => {
            msg = JSON.parse(msg.data)
            try {
                switch(msg.type) {
                    case "SEND_ANSWER":
                        this.getApprovedTeams();
                        break;
                    case "CLOSE_QUESTION":
                        this.getQuiz();
                        break;
                    case "CORRECT_ANSWER":
                        this.getApprovedTeams();
                }
            } catch(e) {
                console.log(e);
            }
        };
    }

    componentWillUnmount() {
        this.resetAnswers();
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

    correctAnswer(teamId) {
        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify({
                _id: teamId,
                answerStatus: true
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };
        fetch("http://localhost:8000/team/correctAnswer/"+teamId, requestOptions)
            .then(() => {
          ws.send(JSON.stringify({
              type: "CORRECT_ANSWER"
          }))
        })
        }


    closeQuestion(quizCode) {
        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify({
                code: quizCode,
                questionStarted: false
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };
        fetch("http://localhost:8000/quiz/"+quizCode+"/closeQuestion",requestOptions)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                ws.send(JSON.stringify({
                    type: "CLOSE_QUESTION"
                }));
                }
            )
    }

    nextQuestion() {
        this.props.history.push('/quiz/selectQuestion/'+this.props.match.params.code);
    }

    stopQuiz() {
        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify({
                code: this.props.match.params.code,
                started: false
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };
        fetch('http://localhost:8000/quiz/'+this.props.match.params.code+'/closeQuiz', requestOptions)
            .then((res) => {
                console.log(res);
                ws.send(JSON.stringify({
                    type: "CLOSE_QUIZ"
                }));
                this.props.history.push('/quiz/resultQuiz/'+this.state.quiz.code);
            })
    }

    resetAnswers() {
        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify({
                quizId: this.state.quiz._id,
                resetAnswer: null,
                answerStatus: false
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };
        fetch('http://localhost:8000/quiz/'+this.props.match.params.code+'/resetAnswers' ,requestOptions)
    }

    getQuestion() {
        fetch(
            "http://localhost:8000/question/"+this.props.match.params.code+"/lastQuestion")
            .then((res) => { return res.json()})
            .then((data) => {
                    this.setState({
                        question: data
                    })
                }
            )
    }

    render() {
        const questionStarted = this.state.quiz.questionStarted;
        return (
            <div className="startscreen">
                <div className="startscreen__header">
                    <div className="startscreen__headerInfo">
                        <h2>{this.state.quiz.name}</h2>
                        <p>De pubquiz app voor jong en oud. </p>
                    </div>
                </div>
                <div className="startscreen__body">
                    <h3>Antwoorden op vraag: {this.state.quiz.currentQuestionNr} / {this.state.quiz.maxQuestions}</h3>
                    <p className="textCenter">Hieronder staan de door de teams ingevoerde antwoorden. Controleer de antwoorden en geef aan welke antwoorden juist zijn. <br />
                        Teams kunnen de antwoorden veranderen tot je op de knop 'Sluit vraag' klikt.</p>
                    <p><strong>Het juiste antwoord is: {this.state.question.answer}</strong></p>
                    <ul className="reviewAnswers__AnswerList">
                        {this.state.teams.map((team, index) => {
                            return (
                            <li className={`reviewAnswers__AnswerListItem ${team.answerStatus === true && "success"}`} key={index}>
                                {team.name}<br/>
                                {team.answer}
                               <CorrectButton team={team} correctAnswer={this.correctAnswer} questionStarted={this.state.quiz.questionStarted}/>
                            </li>
                            )
                        })
                        }

                    </ul>
                </div>
                <div className="approve__footer">
                    {questionStarted === true ?
                     (<CloseQuestionButton quiz={this.state.quiz} closeQuestion={this.closeQuestion} questionStarted={this.state.quiz.questionStarted}/>)
                    : (
                        <div>
                         <NextQuestionButton quiz={this.state.quiz} nextQuestion={this.nextQuestion.bind(this)} />
                         <button onClick={() => this.stopQuiz()}>Stop quiz</button>
                        </div>
                     )}


                </div>
            </div>
        )
    }
}

function CorrectButton(props) {
    if(!props.questionStarted) {
        return (
            <button onClick={() => props.correctAnswer(props.team._id)}>Goed</button>
        )
    } else {
        return (<div></div>)
    }
}

function CloseQuestionButton(props) {
        if(props.questionStarted) {
            return (
                <button onClick={() => props.closeQuestion(props.quiz.code)}>Sluit vraag</button>
            )
        } else {
            return (<div></div>)
        }
}

function NextQuestionButton(props) {
    if(props.quiz.currentQuestionNr < props.quiz.maxQuestions) {
        return (
            <button onClick={() => props.nextQuestion()}>Volgende vraag</button>
        )
    } else {
        return (<div></div>)
    }
}

export default ReviewAnswers