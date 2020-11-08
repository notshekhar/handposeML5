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
let options = {
    flipHorizontal: false, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: 10, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
    detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
    scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
}
let handpose = ml5.handpose(video, options, modelLoaded)

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
    // clean canvas everytime
    ctx.fillStyle = "rgb(33, 33, 33)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
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
