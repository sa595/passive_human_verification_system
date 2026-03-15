let startTime = Date.now()

let mouseMoves = []
let clicks = []
let scrolls = []
let keyTimes = []

let lastClick = null

document.addEventListener("mousemove",(e)=>{
mouseMoves.push({
x:e.clientX,
y:e.clientY,
time:Date.now()
})
})

document.addEventListener("click",()=>{
let now=Date.now()

if(lastClick){
clicks.push(now-lastClick)
}

lastClick=now
})

document.addEventListener("scroll",()=>{
scrolls.push(window.scrollY)
})

document.addEventListener("keydown",()=>{
keyTimes.push(Date.now())
})



function calculateFeatures(){

let speeds=[]

for(let i=1;i<mouseMoves.length;i++){

let dx = mouseMoves[i].x-mouseMoves[i-1].x
let dy = mouseMoves[i].y-mouseMoves[i-1].y
let dt = mouseMoves[i].time-mouseMoves[i-1].time

let dist = Math.sqrt(dx*dx+dy*dy)

if(dt>0){
speeds.push(dist/dt)
}
}

let mouse_speed_mean =
speeds.length ? speeds.reduce((a,b)=>a+b)/speeds.length : 0


let mouse_direction_changes = 0

for(let i=2;i<mouseMoves.length;i++){

let dx1 = mouseMoves[i-1].x-mouseMoves[i-2].x
let dy1 = mouseMoves[i-1].y-mouseMoves[i-2].y

let dx2 = mouseMoves[i].x-mouseMoves[i-1].x
let dy2 = mouseMoves[i].y-mouseMoves[i-1].y

if(dx1*dx2 + dy1*dy2 < 0){
mouse_direction_changes++
}

}


let click_interval_mean =
clicks.length ? clicks.reduce((a,b)=>a+b)/clicks.length : 0


let typing_latency = 0

for(let i=1;i<keyTimes.length;i++){
typing_latency += keyTimes[i]-keyTimes[i-1]
}

typing_latency =
keyTimes.length ? typing_latency/keyTimes.length : 0


let mean =
scrolls.length ? scrolls.reduce((a,b)=>a+b)/scrolls.length : 0

let scroll_variance =
scrolls.length ? scrolls.reduce((a,b)=>a+(b-mean)**2,0)/scrolls.length : 0


let session_duration = (Date.now()-startTime)/1000


let request_rate =
(mouseMoves.length + clicks.length + keyTimes.length)/session_duration


let cpu_threads = navigator.hardwareConcurrency || 4
let device_memory = navigator.deviceMemory || 4


return{

mouse_speed_mean,
mouse_direction_changes,
click_interval_mean,
typing_latency,
scroll_variance,
session_duration,
request_rate,
cpu_threads,
device_memory

}

}



document.getElementById("loginBtn").addEventListener("click",async ()=>{

document.getElementById("statusText").innerText="Analyzing..."

let features = calculateFeatures()

try{

let response = await fetch("http://127.0.0.1:5000/predict",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(features)

})

let result = await response.json()

let icon=document.getElementById("statusIcon")
let text=document.getElementById("statusText")

if(result.result==="human"){

icon.innerHTML="✅"
text.innerText="Human Detected"

}else{

icon.innerHTML="❌"
text.innerText="Bot Detected"

setTimeout(()=>{
alert("Bot detected. Refreshing page.")
location.reload()
},1500)

}

}catch(err){

console.error(err)
alert("Backend not running")

}

})