const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    answer: {
        type: String
    },
    answerStatus: {
        type: Boolean,
        default: false
    },
    points: {
        type: Number,
        default: 0
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'
    }
});

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;