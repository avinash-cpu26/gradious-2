// LOGIN FUNCTION
function login(){

let username = document.getElementById("username").value;
let password = document.getElementById("password").value;

fetch(`http://localhost:3000/users?username=${username}&password=${password}`)
.then(res => res.json())
.then(data => {

if(data.length > 0){

localStorage.setItem("user", JSON.stringify(data[0]));
window.location = "dashboard.html";

}else{

alert("Invalid Login");

}

});

}


// SIGN UP FUNCTION
function signup(){

let username = document.getElementById("newUsername").value;
let password = document.getElementById("newPassword").value;

let user = {

username: username,
password: password,
balance: 0,
transactions: []

};

fetch("http://localhost:3000/users",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify(user)

})

.then(res => res.json())

.then(data => {

alert("Account Created Successfully");
window.location = "index.html";

});

}


// GET CURRENT USER
function getUser(){

return JSON.parse(localStorage.getItem("user"));

}


// LOAD USER DATA
function loadData(){

let user = getUser();

if(!user) return;

let balance = document.getElementById("balance");

if(balance){
balance.innerText = "Balance: ₹" + user.balance;
}

let list = document.getElementById("history");

if(!list) return;

list.innerHTML = "";

user.transactions.forEach(t => {

let li = document.createElement("li");

li.innerText = t.type + " ₹" + t.amount;

list.appendChild(li);

});

}


// DEPOSIT
function deposit(){

let amount = parseInt(document.getElementById("amount").value);

if(!amount || amount <= 0){
alert("Enter valid amount");
return;
}

let user = getUser();

user.balance += amount;

user.transactions.push({
type: "deposit",
amount: amount
});

updateUser(user);

}


// WITHDRAW
function withdraw(){

let amount = parseInt(document.getElementById("amount").value);

let user = getUser();

if(amount > user.balance){

alert("Insufficient Balance");
return;

}

user.balance -= amount;

user.transactions.push({
type: "withdraw",
amount: amount
});

updateUser(user);

}


// TRANSFER MONEY
function transfer(){

let receiverUsername = document.getElementById("receiver").value;
let amount = parseInt(document.getElementById("transferAmount").value);

let sender = getUser();

if(amount > sender.balance){

alert("Insufficient Balance");
return;

}

fetch(`http://localhost:3000/users?username=${receiverUsername}`)
.then(res => res.json())
.then(data => {

if(data.length === 0){

alert("Receiver not found");
return;

}

let receiver = data[0];


// deduct sender money
sender.balance -= amount;

sender.transactions.push({
type:"transfer",
amount:amount,
to:receiverUsername
});


// add receiver money
receiver.balance += amount;

receiver.transactions.push({
type:"received",
amount:amount,
from:sender.username
});


// update sender
fetch(`http://localhost:3000/users/${sender.id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(sender)
});


// update receiver
fetch(`http://localhost:3000/users/${receiver.id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(receiver)
});

localStorage.setItem("user", JSON.stringify(sender));

alert("Transfer Successful");

loadData();

});

}


// UPDATE DATABASE
function updateUser(user){

fetch(`http://localhost:3000/users/${user.id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify(user)

});

localStorage.setItem("user", JSON.stringify(user));

loadData();

}


// LOAD DATA WHEN PAGE OPENS
window.onload = loadData;
function logout(){

localStorage.removeItem("user");

window.location="index.html";

}