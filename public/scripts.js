// ? import socket io
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io('/')

const videoGrid = document.getElementById('video-grid')
// ? create element for video
const myVideo = document.createElement('video')
myVideo.muted = true

let myViceoStream
// ? access for video and audio
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myViceoStream = stream
    addVideoStream(myVideo, stream)
}).catch((err) => {
    console.log('err', err);
})

// ? connection to room with socket io
console.log(ROOM_ID)
socket.emit('join-room', ROOM_ID)

// ? create video stream
const addVideoStream = (video, stream) => {
    video.srcObject = stream
    // ? load data for the specific stream we are play video
    video.addEventListener('loadedmetadata', () => {
        // ? we play the video
        video.play()
    })
    // ? put video to element
    videoGrid.append(video)
}

