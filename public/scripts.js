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
    audio: true
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

// ? sendig message
let text = $('input')
$('html').keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val());
        socket.emit('message', text.val())
        text.val('')
        scrollButton()
    }
})

// ? send message back to users
socket.on('createMessage', message => {
    $('ul').append(`<li class="message"><b>user</b></br>${message}</li>`)
})

const scrollButton = () => {
    let d = $('.main__chat_window')
    d.scrollTop(d.prop('scrollHeight'))

}
