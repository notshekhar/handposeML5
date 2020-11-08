let spinner = document.querySelector(".spinner")
let video = document.querySelector("video")
let canvas = document.querySelector("canvas")
let ctx = canvas.getContext("2d")

function resizeVideo() {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
}
function showSpinner(message) {
    spinner.style.display = "flex"
    spinner.innerText = message
}
function hideSpinner() {
    spinner.style.display = "none"
}
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream
            // spinner.style.display = "none"
            video.play()
        })
}
let prediction = []
let handpose = ml5.handpose(video, {}, modelLoaded)

showSpinner("loading model..")
function modelLoaded() {
    resizeVideo()
    ctx.fillStyle = "rgb(33, 33, 33)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    hideSpinner()
}

handpose.on("predict", (results) => {
    prediction = results
    if (prediction.length > 0) draw(prediction)
})

function draw(data) {
    // ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    // clean canvas everytime
    ctx.fillStyle = "rgb(33, 33, 33)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let hand of data) {
        for (let landmark of hand.landmarks) {
            let [x, y, z] = landmark
            ctx.beginPath()
            ctx.fillStyle = "white"
            // ctx.arc(x, y, Math.abs(z), 0, 2 * Math.PI)
            ctx.arc(x, y, 10, 0, 2 * Math.PI)
            ctx.fill()
        }
    }
    // if (data.length > 0) console.log(data)
}


