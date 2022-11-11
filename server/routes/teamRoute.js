const mongoose = require('mongoose');
const express = require("express");
const app = express.Router();
const teamModel = require("../models/team");
const quizModel = require("../models/quiz");


//add team to quiz
app.post('/create', async (req, res) => {
    const teams = await teamModel.find({name: req.body.name, quizId: req.body.quizId});
    if(teams.length) {
        res.send("teamname not unique");
    } else {
        const newTeam = new teamModel({name: req.body.name, quizId: req.body.quizId});
        try {
            await newTeam.save();
            res.json(newTeam);
        } catch(e) {
            res.status(500).send(e)
        }
        await quizModel.findOneAndUpdate({_id: req.body.quizId}, {$push: {teams: newTeam._id}});
    }
});

// change name
app.put('/changename', async (req, res) => {
    const team = await teamModel.findOne({ _id: req.body.teamId });
    team.name = req.body.name;
    try {
        team.save();
        res.json(team);
    } catch (e) {
        res.status(500).send(e);
    }
});

// update team status to approved true
app.put('/approve/:teamId', async (req, res) => {
    await teamModel.updateOne({ _id: req.params.teamId }, { $set: { approved: true } });
    try {
        res.send("Team accepted!")
    } catch (e) {
        res.status(500).send(e);
    }
});

// update team status to approved false
app.put('/deny/:teamId', async (req, res) => {
    await teamModel.updateOne({ _id: req.params.teamId }, { $set: { approved: false } });
    try {
        res.send("Team denied!")
    } catch (e) {
        res.status(500).send(e);
    }
});

//get team
app.get('/:teamId', async (req, res) => {
    const team = await teamModel.findOne({ _id: req.params.teamId });
    try {
        res.json(team);
    } catch (e) {
        res.status(500).send(e);
    }
});

// give team points because correct answer
app.put('/correctAnswer/:teamId', async (req, res) => {
    const team = await teamModel.findOne({ _id: req.params.teamId });
    team.points++;
    team.answerStatus = req.body.answerStatus;
    try {
        await team.save();
        res.send("Points +1!")
    } catch (e) {
        res.status(500).send(e);
    }
});

// set answer
app.put('/:teamCode/answer', async (req, res) => {
    const team = await teamModel.findOne({ _id: req.params.teamCode });
    team.answer = req.body.answer;
    try {
        team.save();
        res.json(team);
    } catch (e) {
        res.status(500).send(e);
    }
});


module.exports = app;