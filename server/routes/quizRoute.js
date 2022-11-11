const mongoose = require('mongoose');
const express = require("express");
const quizModel = require("../models/quiz");
const shortid = require('shortid');
const app = express.Router();
const teamModel = require("../models/team");


// post new quiz
app.post("/", async (req, res) => {
    const quiz = new quizModel({name: req.body.name, code: shortid.generate()});
    try {
        await quiz.save();
        res.json(quiz);
    } catch(e) {
        console.log(e.message);
        res.status(500).send(e);
    }
});

// get a quiz by code
app.get("/:code", async(req, res) => {
    const quiz = await quizModel.findOne({code: req.params.code});
    try {
        res.json(quiz);
    } catch(e) {
        res.status(500).send(e);
    }
});

// get all teams will join the quiz
app.get("/:code/teams", async(req, res) => {
     await quizModel.findOne({code: req.params.code}, '_id', (error,quiz) => {
        teamModel.find({quizId:  {$in: mongoose.Types.ObjectId(quiz._id) }}, (error, teams) => {
            if (error) return console.error(error);
            try {

                res.json(teams);
            } catch(e) {
                res.status(500).send(e);
            }
        })
    });
});

// get all approved teams
app.get("/:code/approvedTeams", async(req, res) => {
    await quizModel.findOne({code: req.params.code}, '_id', (error,quiz) => {
        teamModel.find({quizId:  {$in: mongoose.Types.ObjectId(quiz._id) }, approved: true} , (error, teams) => {
            if (error) return console.error(error);
            try {
                res.json(teams);
            } catch(e) {
                res.status(500).send(e);
            }
        })
    });
});

// start quiz and put accepted teams in quiz
app.put("/:quizId/startQuiz", async(req, res) => {
    const quiz = await quizModel.findOne({_id: req.body._id});
    const teams = await teamModel.find({quizId: req.body._id, approved: true});
    if (teams.length >=2 && teams.length <= 6) {
        console.log(teams.length);
        quiz.started = true;
        try {
            await quiz.save();
            res.json(quiz);
        } catch(e) {
            res.status(500).send(e);
        }
    }
});

// close quiz
app.put("/:quizId/closeQuiz", async(req, res) => {
    const quiz = await quizModel.findOne({_id: req.body._id});
    quiz.started = req.body.started;
    try {
        await quiz.save();
        res.json(quiz);
    } catch(e) {
        res.status(500).send(e);
    }
});

// start question
app.put("/:quizId/startQuestion", async (req, res) => {
   const quiz = await quizModel.findOneAndUpdate({_id: req.body._id}, {$push: {questions: req.body.questionId}});
   quiz.questionStarted = true;
   quiz.currentQuestionNr++;
    try {
        await quiz.save();
        res.json(quiz);
    } catch(e) {
        res.status(500).send(e);
    }
});

// close question
app.put("/:quizId/closeQuestion", async (req, res) => {
    const quiz = await quizModel.findOne({code: req.body.code});
    quiz.questionStarted = req.body.questionStarted;
    try {
        await quiz.save();
        res.json(quiz);
    } catch(e) {
        res.status(500).send(e);
    }
});

app.put('/:quizId/resetAnswers', async (req, res) => {
    const teams = await teamModel.updateMany({quizId: req.body.quizId}, {answer: req.body.resetAnswer, answerStatus: req.body.answerStatus});
    try {
        res.send("answers reset!");
    } catch(e) {
        res.status(500).send(e);
    }
});

module.exports = app;