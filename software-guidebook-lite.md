# Software Guidebook Lite - Coen Grotenhuijs 

## Inhoud

1. Wireframes
2. REST and WebSocket Specifications
3. Database Schema

## 1. WireFrames

###  1.1 Quiz Master App
<img src= "images/quiz master sketches.png">

###  1.2 Team App
<img src= "images/teamapp sketches.png">

##  2. REST and Websocket Specifications
###  2.1 REST 
####  2.1.1 Quiz route
POST http://localhost:8000/quiz/ - Creëert een nieuwe quiz.

GET http://localhost:8000/quiz/:code - Vraagt de quiz informatie op van de meegegeven quiz code.

GET http://localhost:8000/quiz/:code/teams - Vraagt alle teams op die zich hebben aangemeld bij de quiz.

GET http://localhost:8000/quiz/:code/approvedTeams - Vraagt alle teams op die zijn goedgekeurd.
 
PUT http://localhost:8000/quiz/:quizId/startQuiz - Start de quiz met de geaccepteerde teams.

PUT http://localhost:8000/quiz/:quizId/closeQuiz - Sluit de quiz.

PUT http://localhost:8000/quiz/:quizId/startQuestion - Start een vraag.

PUT http://localhost:8000/quiz/:quizId/closeQuestion - Sluit de vraag.

PUT http://localhost:8000/quiz/:quizId/resetAnswers - Leegt de antwoorden van de teams.

####  Team route
POST http://localhost:8000/team/create - Post het team in het juiste quiz dmv. quizId

PUT http://localhost:8000/team/changename - Veranderd de naam van het team

PUT http://localhost:8000/team/approve/:teamId/ - Veranderd de approved status van het team naar true.

PUT http://localhost:8000/team/deny/:teamId/ - Veranderd de approved status van het team naar false.

GET http://localhost:8000/team/:teamId - Geeft de informatie voor een bepaald team obv. teamId.

PUT http://localhost:8000/team/correctAnswer/:teamId/ - Verhoogt het aantal punten van het team.
 
PUT http://localhost:8000/team/:teamCode/answer/ - Update het antwoord naar de ingevoerde waarde.
 
####  Question route
GET http://localhost:8000/question/newQuestions/:code/ - Geeft drie nieuwe random vragen. 

GET http://localhost:8000/question/:code/lastQuestion/ - Geeft informatie over de gekozen vraag.


## Database schema

<img src= "images/database schema.png">
