// ? import socket io
const socket = io('/')

const videoGrid = document.getElementById('video-grid')
// ? create element for video
const myVideo = document.createElement('video')
myVideo.muted = true

// ? connect peer
let peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});

let myViceoStream
// ? access for video and audio
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    myViceoStream = stream
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
        call.answer(stream);
        const video =  document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream)
    })
}).catch((err) => {
    console.log('err', err);
})

peer.on('open', id => {
    // ? connection to room with socket io
    socket.emit('join-room', ROOM_ID, id)
})

const connectToNewUser = (userId, stream) => {
    // ? call user
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

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

