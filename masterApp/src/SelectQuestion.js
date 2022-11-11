import React from 'react';
import './App.css';
const ws = new WebSocket("ws://localhost:8000");

class SelectQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: "",
            questions: [],
            idOfClickedQuestion: -1
        }
    }

    componentDidMount() {
        this.getQuiz();
        this.getNewQuestions();

        ws.onopen = () => {
            console.log("WebSocket connection established!");
        };
    }

    getQuiz() {
        fetch(
            "http://localhost:8000/quiz/" + this.props.match.params.code)
            .then((res) => { return res.json() })
            .then((data) => {
                console.log(data);
                this.setState({
                    quiz: data
                });
            });
    }

    getNewQuestions() {
        fetch("http://localhost:8000/question/newQuestions/" + this.props.match.params.code)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.setState({
                    questions: data,
                    idOfClickedQuestion: -1
                })
            });
    }

    onClickQuestion(id) {
        this.setState({
            idOfClickedQuestion: id
        });
    }

    startQuestion() {
        const requestOptions = {
            method: 'PUT',
            body: JSON.stringify({
                _id: this.state.quiz._id,
                questionId: this.state.idOfClickedQuestion
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        };
        fetch("http://localhost:8000/quiz/" + this.state.quiz._id + "/startQuestion", requestOptions)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                ws.send(JSON.stringify({
                    type: "START_QUESTION"
                }));
                this.props.history.push('/quiz/reviewAnswers/' + data.code);
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
                    <h3>Vraag: {this.state.quiz.currentQuestionNr + 1} / {this.state.quiz.maxQuestions}</h3>
                    <p className="textCenter"> Selecteer hieronder een vraag om te stellen aan de teams</p>
                    <div className="selectQuestion">
                        <ul className="selectQuestion__questionList">
                            {this.state.questions.map((question) => {
                                return (
                                    <li className={`selectQuestion__questionListItem ${question._id === this.state.idOfClickedQuestion && "success"}`} key={question._id} onClick={() => this.onClickQuestion(question._id)}>
                                        <div className="questionAndCategory">
                                            <p className="questionCategory">Categorie: <strong>{question.category}</strong></p>
                                            <p>Vraag:<strong> {question.question}</strong>
                                            </p>
                                        </div>
                                        <p>Antwoord: <strong>{question.answer}</strong></p>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <div className="approve__footer">
                    <button onClick={() => this.getNewQuestions()}>Nieuwe vragen</button>
                    <button onClick={() => this.startQuestion()}>Start vraag</button>
                </div>
            </div>
        )
    }
}

export default SelectQuestion