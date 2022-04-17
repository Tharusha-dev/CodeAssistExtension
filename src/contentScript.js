import { createWorker , createScheduler } from "tesseract.js"
import * as prismjs from "prismjs"

var test_btn = document.createElement("button")
var prismStyleSheetLink = document.createElement("link")
var ytVideoCanvasOverlay = document.createElement("canvas")
var videoMainUiRight = document.createElement("div")


var second
var testText
let ytVideoPlaying
let ytVideoPlayingContainer
let yt_control_pane
let c


const scheduler = createScheduler();
let timerId = null;
const language = "css"
var observerConfig = { attributes: false, childList: true, subtree: true };


let isthingOpen = false


window.addEventListener("load",function(){

        let videoPageManagerElement = document.querySelector("body > ytd-app")

        console.log("fetching text")
        // fetch("https://raw.githubusercontent.com/jeromewu/tesseract.js-video/master/css/style.css")
        //   .then( r => r.text() )
        //   .then((t) => {console.log(testText) ; testText = t})



        const getElements = function(){

            ytVideoPlaying = document.querySelector("#movie_player > div.html5-video-container > video")
            ytVideoPlayingContainer = document.querySelector("#movie_player > div.html5-video-container")

            second = document.querySelector("#secondary")
  
            
            yt_control_pane = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls")


            if(checkElemnt(second) && checkElemnt(yt_control_pane) & checkElemnt(ytVideoPlaying) & checkElemnt(ytVideoPlayingContainer)){

              console.log("all not null")

              videoPageManagerObserver.disconnect()
              appendElements()
              setElementProperties()
              
            }

            // else {
            //   console.log([second,yt_control_pane,ytVideoPlaying,ytVideoPlayingContainer])
            // }

        }

        const checkElemnt = function(element){
          return (element !== "null" && element !== null && element !== undefined && element !== "undefined")
        }


        const appendElements = function(){
          
          console.log("appending elements")

          document.querySelector("head").appendChild(prismStyleSheetLink)
          ytVideoPlayingContainer.appendChild(ytVideoCanvasOverlay)
          yt_control_pane.prepend(test_btn)

          
        }
        
        const setElementProperties = function(){

          prismStyleSheetLink.setAttribute("rel", "stylesheet");
          prismStyleSheetLink.setAttribute("href", "https://cdn.jsdelivr.net/npm/prismjs@1.27.0/themes/prism.css");


          // ytVideoCanvasOverlay.style.cssText = "position:absolute;top:0;left:0"
          ytVideoCanvasOverlay.style.position = "absolute"
          ytVideoCanvasOverlay.style.left = 0
          ytVideoCanvasOverlay.style.top = 0

          // console.log("ytvidoe height " + ytVideoPlaying.getBoundingClientRect().width)
          // ytVideoCanvasOverlay.style.height = "300px"

          ytVideoCanvasOverlay.style.height = ytVideoPlaying.getBoundingClientRect().height.toString() + "px"

          ytVideoCanvasOverlay.style.width = ytVideoPlaying.getBoundingClientRect().width.toString() + "px"
  
          videoMainUiRight.classList.add("mainUiRightScrollbar")
          videoMainUiRight.innerHTML = "<h1>Hello</h1>"
          videoMainUiRight.style.cssText = "width: var(--ytd-watch-flexy-sidebar-width); min-width: var(--ytd-watch-flexy-sidebar-min-width); height:55vh ;z-index:999;background-color:#202020;position:absolute;top:0.9%;color:white;overflow:scroll;border: 1rem #303030 solid ; box-sizing:border-box ; padding:2.5rem"
          
          test_btn.innerHTML = "test"

        

        }


        // const doOCR = async () => {
        //   // console.log(ytVideoPlaying)
        //     // ytVideoPlaying =
        //   // let testVideo =  document.querySelector("#movie_player > div.html5-video-container > video")
        //   c = document.createElement('canvas');
        //   c.width = ytVideoPlaying.getBoundingClientRect().width;
        //   c.height =ytVideoPlaying.getBoundingClientRect().height;
  

        //   if(!!ytVideoPlaying) {

        //     c.getContext('2d').drawImage(ytVideoPlaying, 0, 0,ytVideoPlaying.getBoundingClientRect().width, ytVideoPlaying.getBoundingClientRect().height);

        //   }
        //   else {
        //     console.log("video is null")
        //   }



        //   let imgText = c.toDataURL("image/png")
        //   // console.log("context " + imgText)
        //   // videoMainUiRight.appendChild(c)
        //   console.log("writetetete")

        //   const { data: { text } } = await scheduler.addJob('recognize', c);
          
        //  console.log(text)
        // }

        // (async () => {

        //   for (let i = 0; i < 6 ; i++) {
        //     const worker = createWorker();
        //     await worker.load();
        //     await worker.loadLanguage('eng');
        //     await worker.initialize('eng');
        //     scheduler.addWorker(worker);
        //   }

        //   this.setInterval(doOCR, 1000)


        // })();

        const addMessage = (m, bold) => {
          let msg = `<p>${m}</p>`;
          if (bold) {
            msg = `<p class="bold">${m}</p>`;
          }
          // messages.innerHTML += msg;
          // messages.scrollTop = messages.scrollHeight;
          if(checkElemnt(videoMainUiRight)){
            videoMainUiRight.innerHTML += msg;

          }
          // videoMainUiRight.scrollTop = mess
        }
    
        const doOCR = async () => {
          const c = document.createElement('canvas');
          c.width = ytVideoPlaying.getBoundingClientRect().width;
          c.height = ytVideoPlaying.getBoundingClientRect().height;
          c.getContext('2d').drawImage(ytVideoPlaying, 0, 0, ytVideoPlaying.getBoundingClientRect().width, ytVideoPlaying.getBoundingClientRect().height);
          const start = new Date();
          const { data: { text } } = await scheduler.addJob('recognize', c);
          const end = new Date()
          addMessage(`[${start.getMinutes()}:${start.getSeconds()} - ${end.getMinutes()}:${end.getSeconds()}], ${(end - start) / 1000} s`);
          text.split('\n').forEach((line) => {
            addMessage(line);
          });
        };
    
        (async () => {
          addMessage('Initializing Tesseract.js');
          for (let i = 0; i < 4; i++) {
            const worker = createWorker();
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            scheduler.addWorker(worker);
          }
          addMessage('Initialized Tesseract.js');
          ytVideoPlaying.addEventListener('play', () => {
            timerId = setInterval(doOCR, 1000);
          });
          ytVideoPlaying.addEventListener('pause', () => {
            clearInterval(timerId);
          });
          addMessage('Now you can play the video. :)');
          ytVideoPlaying.controls = true;
        })();
        
        var videoPageManagerObserver = new MutationObserver(getElements)
        
        videoPageManagerObserver.observe(videoPageManagerElement,observerConfig)

        test_btn.addEventListener("click",function(){
            console.log("clicked")
            isthingOpen = !isthingOpen

            if(isthingOpen && checkElemnt(second)){
                
                // col.appendChild(testIn)

                second.style.position = "relative"
                // const prismCode = prismjs.highlight(testText, Prism.languages[language], language);
                // videoMainUiRight.innerHTML = '<p style="white-space: pre-wrap;font-size:1.8rem">' + prismCode + '</p>'
                // videoMainUiRight.innerHTML = c.getContext("2d")
                // videoMainUiRight.appendChild(c)


                // videoMainUiRight.innerHTML = prismCode 

                second.appendChild(videoMainUiRight)

            }
            if(!isthingOpen && checkElemnt(second)) {
                second.removeChild(videoMainUiRight)
            }
            
            
        })

})




// var canvas = document.getElementById('canvas'),
// ctx = canvas.getContext('2d'),
// rect = {},
// drag = false,
// mouseX,
// mouseY,
// closeEnough = 10,
// dragTL = dragBL = dragTR = dragBR = false;

// function init() {
// canvas.addEventListener('mousedown', mouseDown, false);
// canvas.addEventListener('mouseup', mouseUp, false);
// canvas.addEventListener('mousemove', mouseMove, false);

// rect = {
//     startX: 100,
//     startY: 200,
//     w: 300,
//     h: 200
// }
// }

// function mouseDown(e) {
// mouseX = e.pageX - this.offsetLeft;
// mouseY = e.pageY - this.offsetTop;

// // if there isn't a rect yet
// if (rect.w === undefined) {
//     rect.startX = mouseY;
//     rect.startY = mouseX;
//     dragBR = true;
// }

// // if there is, check which corner
// //   (if any) was clicked
// //
// // 4 cases:
// // 1. top left
// else if (checkCloseEnough(mouseX, rect.startX) && checkCloseEnough(mouseY, rect.startY)) {
//     dragTL = true;
// }
// // 2. top right
// else if (checkCloseEnough(mouseX, rect.startX + rect.w) && checkCloseEnough(mouseY, rect.startY)) {
//     dragTR = true;

// }
// // 3. bottom left
// else if (checkCloseEnough(mouseX, rect.startX) && checkCloseEnough(mouseY, rect.startY + rect.h)) {
//     dragBL = true;

// }
// // 4. bottom right
// else if (checkCloseEnough(mouseX, rect.startX + rect.w) && checkCloseEnough(mouseY, rect.startY + rect.h)) {
//     dragBR = true;

// }
// // (5.) none of them
// else {
//     // handle not resizing
// }

// ctx.clearRect(0, 0, canvas.width, canvas.height);
// draw();

// }

// function checkCloseEnough(p1, p2) {
// return Math.abs(p1 - p2) < closeEnough;
// }

// function mouseUp() {
// dragTL = dragTR = dragBL = dragBR = false;
// }

// function mouseMove(e) {
// mouseX = e.pageX - this.offsetLeft;
// mouseY = e.pageY - this.offsetTop;
// if (dragTL) {
//     rect.w += rect.startX - mouseX;
//     rect.h += rect.startY - mouseY;
//     rect.startX = mouseX;
//     rect.startY = mouseY;
// } else if (dragTR) {
//     rect.w = Math.abs(rect.startX - mouseX);
//     rect.h += rect.startY - mouseY;
//     rect.startY = mouseY;
// } else if (dragBL) {
//     rect.w += rect.startX - mouseX;
//     rect.h = Math.abs(rect.startY - mouseY);
//     rect.startX = mouseX;
// } else if (dragBR) {
//     rect.w = Math.abs(rect.startX - mouseX);
//     rect.h = Math.abs(rect.startY - mouseY);
// }
// ctx.clearRect(0, 0, canvas.width, canvas.height);
// draw();
// }

// function draw() {
// ctx.fillStyle = "#222222";
// ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
// drawHandles();
// }

// function drawCircle(x, y, radius) {
// ctx.fillStyle = "#FF0000";
// ctx.beginPath();
// ctx.arc(x, y, radius, 0, 2 * Math.PI);
// ctx.fill();
// }

// function drawHandles() {
// drawCircle(rect.startX, rect.startY, closeEnough);
// drawCircle(rect.startX + rect.w, rect.startY, closeEnough);
// drawCircle(rect.startX + rect.w, rect.startY + rect.h, closeEnough);
// drawCircle(rect.startX, rect.startY + rect.h, closeEnough);
// }
// draw()
// init();