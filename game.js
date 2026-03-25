const questions = [

{
question:"Who is the last Prophet in Islam?",
answers:["Isa","Muhammad","Musa","Ibrahim"],
correct:1
},

{
question:"What is the holy book of Islam?",
answers:["Torah","Bible","Quran","Zabur"],
correct:2
},

{
question:"How many pillars are in Islam?",
answers:["3","4","5","6"],
correct:2
},

{
question:"What month do Muslims fast?",
answers:["Shawwal","Ramadan","Rajab","Muharram"],
correct:1
},

{
question:"Which city is the Kaaba located in?",
answers:["Medina","Jerusalem","Mecca","Cairo"],
correct:2
}

];

let current = 0;
let score = 0;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("next");

function loadQuestion(){

const q = questions[current];
questionEl.innerText = q.question;

answersEl.innerHTML="";

q.answers.forEach((answer,index)=>{

const btn = document.createElement("button");
btn.innerText = answer;

btn.onclick = ()=>{

if(index === q.correct){
score++;
alert("Correct! 🎉");
}else{
alert("Wrong answer");
}

};

answersEl.appendChild(btn);

});

}

nextBtn.onclick=()=>{

current++;

if(current >= questions.length){

questionEl.innerText="Game Finished!";
answersEl.innerHTML="";
scoreEl.innerText="Your Score: "+score+" / "+questions.length;

}else{

loadQuestion();

}

};

loadQuestion();
