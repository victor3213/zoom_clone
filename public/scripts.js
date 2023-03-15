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
let mute = document.getElementById('mute')
let camera = document.getElementById('camera')
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

    // ? event for mute or unmute
    mute.addEventListener("click", (event) => {
        const enable = stream.getAudioTracks()[0].enabled
        if (enable) {
            myViceoStream.getAudioTracks()[0].enabled = false
            setUnmuteButton()
        } else {
            setMuteButton()
            myViceoStream.getAudioTracks()[0].enabled = true
        }
    });

    // ? event for open or close camera
    camera.addEventListener("click", (event) => {
        const enable = stream.getVideoTracks()[0].enabled
        console.log(enable)
        if (enable) {
            stream.getVideoTracks()[0].enabled = false
            setCloseVideo() 
        } else {
            setOpenVideo()
            stream.getVideoTracks()[0].enabled = true
        }
    });
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

const setMuteButton = () => {
    let html = `<li class="fa fa-microphone"></i> <span>Mute</span>`
    document.querySelector(`.main__mute_button`).innerHTML = html
}

const setUnmuteButton = () => {
    let html = `<li class="unmute fa fa-microphone-slash"></i> <span>Unmute</span>`
    document.querySelector(`.main__mute_button`).innerHTML = html

}

 const setCloseVideo = () => {
    let html = `<li class="unmute fa fa-video-slash"></i> <span>Close Video</span>`
    document.querySelector(`.main__video_button`).innerHTML = html

 }

 const setOpenVideo = () => {
    let html = `<li class="fa fa-video"></i> <span>Open Video</span>`
    document.querySelector(`.main__video_button`).innerHTML = html

 }