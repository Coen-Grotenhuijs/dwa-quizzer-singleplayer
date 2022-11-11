import React from 'react';
import './App.css';
const ws = new WebSocket("ws://localhost:8000");

class AnswerQuestion extends React.Component {
    constructor(props) {
        super();

        this.state = {
            quiz: "",
            question: "",
            answer: "",
            team: ""
        }
    }

    componentDidMount() {
        this.getQuiz();

        ws.onmessage = (msg) => {
            msg = JSON.parse(msg.data)
            try {
                switch(msg.type) {
                    case "START_QUIZ":
                    case "CLOSE_QUESTION":
                    case "CLOSE_QUIZ" :
                        this.getQuiz();
                        this.setState({
                            answer: null
                        });
                        break;
                    case "START_QUESTION":
                        this.getQuiz();
                        this.getQuestion();
                }
            } catch(e) {
                console.log(e);
            }
        };
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

    getQuestion() {
        fetch(
            "http://localhost:8000/question/"+this.state.quiz.code+"/lastQuestion")
            .then((res) => { return res.json()})
            .then((data) => {
                this.setState({
                    question: data
                })
            }
        )
    }

    handleChange = (event) => {
        this.setState(
            {
                answer: event.target.value
            }
        );
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                'Accept': 'application/json'},
            body: JSON.stringify({
                "answer": this.state.answer
            })
        };
        fetch("http://localhost:8000/team/"+this.props.match.params.teamcode+"/answer",requestOptions)
            .then((res)  => {
                return res.json()
            })
            .then((data) => {
                this.setState({
                    team: data
                });
                ws.send(JSON.stringify({
                    type: "SEND_ANSWER"
                }));
            })
    };


    render() {
        const started = this.state.quiz.started;
        const questionStarted = this.state.quiz.questionStarted;
        return (
            started === false ? (
                <div className="startscreen">
                    <div className="startscreen__header">
                        <div className="startscreen__headerInfo">
                            <h3>{this.state.quiz.name}</h3>
                            <p>De pubquiz app voor jong en oud.</p>
                        </div>
                    </div>
                    <div className="startscreen__body">
                        <div className="joinQuiz__body__quiznameInput">
                            {questionStarted === false ? (
                                <h3>Team is geaccepteerd. Nu wachten tot de quiz master de quiz start.</h3>
                            ) : (
                                 <div>
                                     <h4>{this.state.question.category}</h4>
                                     <h3>{this.state.question.question}</h3>
                                     <form onSubmit={this.handleSubmit}>
                                         <input className="startscreen__input" type="text" placeholder="Antwoord..." value={this.state.answer} onChange={this.handleChange} />
                                         <button type="submit">Verzenden</button>
                                     </form>
                                 </div>
                             )}

                        </div>
                    </div>
                    <div className="joinQuiz__footer">
                    </div>
                </div>
                              ) : (
                <div className="startscreen">
                    <div className="startscreen__header">
                        <div className="startscreen__headerInfo">
                            <h3>{this.state.quiz.name}</h3>
                            <p>De pubquiz app voor jong en oud.</p>
                        </div>
                    </div>
                    <div className="startscreen__body">
                        <div className="joinQuiz__body__quiznameInput">
                            {questionStarted === false ? (
                                <h3>Wachten op een nieuwe vraag van de quiz Master</h3>
                            ) : (
                                 <div>
                                     <h4>{this.state.question.category}</h4>
                                     <h3>{this.state.question.question}</h3>
                                     <form onSubmit={this.handleSubmit}>
                                         <input className="startscreen__input" type="text" placeholder="Antwoord..." value={this.state.answer} onChange={this.handleChange} />
                                         <button type="submit">Verzenden</button>
                                     </form>
                                 </div>
                             )}

                        </div>
                    </div>
                    <div className="joinQuiz__footer">
                    </div>
                </div>
            )
        )
    }
}

export default AnswerQuestion