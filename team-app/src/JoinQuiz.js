import React from 'react';
import './App.css';

class JoinQuiz extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quizcode: ''
        }
    }

    handleChange = (event) => {
        this.setState(
            {
                quizcode: event.target.value
            }
        );
    };

    handleSubmit = (event) => {
        // check if quizcode bestaat en open is
        event.preventDefault();
        fetch('http://localhost:8000/quiz/'+this.state.quizcode)
            .then((res)  => {
                return res.json();
            })
            .then((data) => {
                if(data && data.started === false) {
                    this.props.history.push('/joinQuiz/'+ data.code);
                }
            })
    };

    render() {
        return (
            <div className="startscreen">
                <div className="startscreen__header">
                    <div className="startscreen__headerInfo">
                        <h3>Quizzer Night! </h3>
                        <p>De pubquiz app voor jong en oud.</p>
                    </div>
                </div>
                <div className="startscreen__body">
                    <div className="joinQuiz__body__quiznameInput">
                        <p> Vul de code van een quiz in en klik op de knop aanmelden om mee te doen aan de quiz.</p>
                        <form onSubmit={this.handleSubmit}>
                            <input className="startscreen__input" type="text" placeholder="Quizzer code" value={this.state.quizcode} onChange={this.handleChange} />
                            <button type="submit">Aanmelden</button>
                        </form>
                    </div>
                </div>
                <div className="joinQuiz__footer">
                </div>
            </div>
        )
    }
}

export default JoinQuiz