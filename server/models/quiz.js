const mongoose = require('mongoose');

require('./question');
require('./team');

const QuizSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    code: {
        type: String,
        required: true
    },
    started: {
        type: Boolean,
        default: false
    },
    currentQuestionNr: {
        type: Number,
        default: 0
    },
    maxQuestions: {
        type: Number,
        default: 3
    },
    questionStarted: {
        type: Boolean,
        default: false
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Question'
    }],
    teams: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Team'
    }]
});

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;