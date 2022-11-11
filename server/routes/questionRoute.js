const mongoose = require('mongoose');
const express = require("express");
const quizModel = require("../models/quiz");
const questionModel = require("../models/question");
const app = express.Router();

// get 3 new random questions
app.get("/newQuestions/:code", async (req, res) => {
    const quiz = await quizModel.findOne({code: req.params.code});
    const questions = await questionModel.find({'_id': {$nin: quiz.questions}});
    const randomQuestions = [];

    for(let i = 0; i < 3; i++) {
        const random = Math.floor(Math.random() * questions.length -1);
        randomQuestions[i] = questions[random];
    }
    try {
        res.json(randomQuestions);
    } catch(e) {
        res.status(500).send(e);
    }
});

// get chosen questions
app.get("/:code/lastQuestion", async  (req, res) => {
    const quiz = await quizModel.findOne({code: req.params.code});
    const questionNr = (quiz.currentQuestionNr - 1);
    const question = await questionModel.findOne({_id: quiz.questions[questionNr]});
    try {
        res.json(question);
    } catch(e) {
        res.status(500).send(e);
    }
});

module.exports = app;