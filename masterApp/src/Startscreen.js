import React from 'react';
import './App.css';
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { withRouter } from 'react-router';


class Startscreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quizname: '',
            error: null
        }
    }

    handleChange = (event) => {
        this.setState(
            {
                quizname: event.target.value
            }
        );
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "name": this.state.quizname
            })
        };
        fetch('http://localhost:8000/quiz', requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('Ouch, iets gaat er mis. Vul opnieuw een quiz naam in.');
                }
            })
            .then((responseData) => {
                this.props.history.push('/quiz/' + responseData.code);
            })
            .catch((error) => {
                this.setState({ 'error': error.message });
            })
    };

    render() {

        return (
            <div className="startscreen">
                <div className="startscreen__header">
                    <div className="startscreen__headerInfo">
                        <h3>Quizzer Night! </h3>
                        <p>De pubquiz app voor jong en oud. </p>
                    </div>
                </div>
                <div className="startscreen__body">
                    <p className="startscreen__body__titel">Vul hieronder een leuke naam voor uw Quizz in!!!</p>
                    {this.state.error ? this.state.error : ''}
                </div>
                <div className="startscreen__footer">
                    <InsertEmoticonIcon />
                    <form onSubmit={this.handleSubmit}>
                        <input className="startscreen__input" type="text" placeholder="Vul hier uw quiz naam in..." value={this.state.quizname} onChange={this.handleChange} required />
                        <button type="submit">Start Quiz</button>
                    </form>
                    <MicIcon />
                </div>
            </div>
        )
    };
}
export default withRouter(Startscreen);