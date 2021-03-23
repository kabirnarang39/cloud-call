var socket = io('/');
let myVideoStream;
const videoGrid=document.querySelector('.video-grid')
const screen_Share=document.querySelector('.screen_share');
const myVideoElement=document.createElement('video')
const myVideoElementScreen=document.createElement('video')
myVideoElement.muted=true;
const peers = {}
var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443'
});
console.log(window.location.search);
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('user');
console.log(JSON.parse(myParam))
//console.log(window.location.href.split('?')[1])
//console.log(user);
//console.log(videoGrid)
const closeBtn=()=>{
    var close = document.getElementsByClassName("closebtn");
var i;

for (i = 0; i < close.length; i++) {
  close[i].onclick = function(){
    var div = this.parentElement;
    div.style.opacity = "0";
    setTimeout(function(){ div.style.display = "none"; }, 600);
  }
}
}
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
})
.then(stream=>{
myVideoStream=stream;
addStream(myVideoElement,stream);
peer.on('call', call=> {
      call.answer(stream); // Answer the call with an A/V stream.
      const video=document.createElement('video')
      call.on('stream', userVideoStream=> {
      addStream(video,userVideoStream)
    });
})
socket.on('user-connected',(userId)=>{
    //document.querySelector('.flash').innerHTML='User Connected'+userId;
    connectToNewUser(userId,stream);
    document.querySelector('.flash').innerHTML=(`<div class="alert success"><span class="closebtn" onClick="closeBtn();">&times;</span><strong>USER</strong> ${userId} connected.</div>`)
    alert('Somebody connected', userId)
})

const text=document.querySelector('input')
text.addEventListener('change',(event)=>{
if(event.target.value.length!==0){
socket.emit('message',event.target.value)
event.target.value='';
}
})

socket.on('createMessage',message=>{
 /*   const ul=document.querySelector('.messages');
    const node=document.createElement('li');
    const textNode=document.createTextNode(message)
    const bold=document.createElement('b')
    const textNode2=document.createTextNode("user")
    bold.appendChild(textNode2)
    node.appendChild(textNode)
    ul.append(bold,node)
    scrollToBottom();
    //ul.append(`<li class="message"><b>user</b><br/>${message}</li>`)*/
    $('ul').append(`<li >
								<span class="messageHeader">
									<span>
										From 
										<span class="messageSender">Someone</span> 
										to 
										<span class="messageReceiver">Everyone:</span>
									</span>
									${new Date().toLocaleString('en-US', {
										hour: 'numeric',
										minute: 'numeric',
										hour12: true,
									})}
								</span>
								<span class="message">${message}</span>
							
							</li>`)
			scrollToBottom()
})


})
.catch(err=>{
    console.log(err)
})
socket.on('user-disconnected', userId => {
   // document.querySelector('.flash').innerHTML='User Disconnected'+userId;
    if (peers[userId]) peers[userId].close()
  })
peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id)
})
function Area(Increment, Count, Width, Height, Margin = 10) {
    let i =0, w = 0;
    let h = Increment * 0.75 + (Margin * 2);
    while (i < (Count)) {
        if ((w + Increment) > Width) {
            w = 0;
            h = h + (Increment * 0.75) + (Margin * 2);
        }
        w = w + Increment + (Margin * 2);
        i++;
    }
    if (h > Height) return false;
    else return Increment;
  }
  // Dish:
  function Dish() {
  
    // variables:
        let Margin = 2;
        let Scenary = document.getElementById('video-grid') || document.querySelector('.screen_share');
        let Width = Scenary.offsetWidth - (Margin * 2);
        let Height = Scenary.offsetHeight - (Margin * 2);
        let Cameras = document.getElementsByTagName('video');
        let max = 0;
    
    // loop (i recommend you optimize this)
        let i = 1;
        while (i < 5000) {
            let w = Area(i, Cameras.length, Width, Height, Margin);
            if (w === false) {
                max =  i - 1;
                break;
            }
            i++;
        }
    
    // set styles
        max = max - (Margin * 2);
        setWidth(max, Margin);
  }
  
  // Set Width and Margin 
  function setWidth(width, margin) {
    let Cameras = document.getElementsByTagName('video');
    for (var s = 0; s < Cameras.length; s++) {
        Cameras[s].style.width = width + "px";
        Cameras[s].style.margin = margin + "px";
        Cameras[s].style.height = (width * 0.75) + "px";
    }
  }
  
  // Load and Resize Event
  window.addEventListener("load", function (event) {
    if(!loading)
    Dish();
  
    window.onresize = Dish;
  }, false);

const connectToNewUser=(userId,stream)=>{
    var call = peer.call(userId, stream);
    const video=document.createElement('video')
    video.id=userId;
    call.on('stream', userVideoStream=> {
    addStream(video,userVideoStream)
  });
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
  console.log(peers)
}
const addStream=(video,stream)=>{
    video.srcObject=stream;
   
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
   videoGrid.append(video)
  // console.log(videoGrid)
}

    const scrollToBottom = () => {
        var d = document.querySelector('.main_chat_window');
        d.scrollTop = d.scrollHeight;
    }

const muteUnmute=()=>{
    const enabled=myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
myVideoStream.getAudioTracks()[0].enabled=false;
setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}
const setUnmuteButton=()=>{
    const html=`
    <svg width="26px" height="26px" viewBox="0 0 16 16" class="bi bi-mic-mute-fill" fill="#cc3b33" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M12.734 9.613A4.995 4.995 0 0 0 13 8V7a.5.5 0 0 0-1 0v1c0 .274-.027.54-.08.799l.814.814zm-2.522 1.72A4 4 0 0 1 4 8V7a.5.5 0 0 0-1 0v1a5 5 0 0 0 4.5 4.975V15h-3a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-3v-2.025a4.973 4.973 0 0 0 2.43-.923l-.718-.719zM11 7.88V3a3 3 0 0 0-5.842-.963L11 7.879zM5 6.12l4.486 4.486A3 3 0 0 1 5 8V6.121zm8.646 7.234l-12-12 .708-.708 12 12-.708.707z"/>
</svg>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}
const setMuteButton=()=>{
    const html=`
    <svg width="26px" height="26px" viewBox="0 0 16 16" class="bi bi-mic-fill" fill="#00796b" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
    <path fill-rule="evenodd" d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
  </svg>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}
const playStop=()=>{
    const enabled=myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
myVideoStream.getVideoTracks()[0].enabled=false;
setPlayVideo();
    }
    else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled=true;
    } 
}
const setPlayVideo=()=>{
    const html=`
    <svg width="26px" height="26px" viewBox="0 0 16 16" class="bi bi-camera-video-off-fill" fill="#cc3b33" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.429 3.55A1.66 1.66 0 0 0 1 4.667v6.666C1 12.253 1.746 13 2.667 13h6.666c.43 0 .821-.162 1.117-.429l-9.02-9.02zm13.111 8.868a.798.798 0 0 0 .46-.726V4.308c0-.63-.693-1.01-1.233-.696L11 5.218v-.551C11 3.747 10.254 3 9.333 3H5.121l9.419 9.418z"/>
  <path fill-rule="evenodd" d="M13.646 14.354l-12-12 .708-.708 12 12-.708.707z"/>
</svg>
    `
    document.querySelector('.main_video_button').innerHTML=html;
   
}
const setStopVideo=()=>{
    const html=`
    <svg width="26px" height="26px" viewBox="0 0 16 16" class="bi bi-camera-video-fill" fill="#00796b" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.667 3h6.666C10.253 3 11 3.746 11 4.667v6.666c0 .92-.746 1.667-1.667 1.667H2.667C1.747 13 1 12.254 1 11.333V4.667C1 3.747 1.746 3 2.667 3z"/>
            <path d="M7.404 8.697l6.363 3.692c.54.313 1.233-.066 1.233-.697V4.308c0-.63-.693-1.01-1.233-.696L7.404 7.304a.802.802 0 0 0 0 1.393z"/>
          </svg>
    `
    document.querySelector('.main_video_button').innerHTML=html;
}
const displayChat=()=>{
    const html=`
    <svg width="26px" height="26px" viewBox="0 0 16 16" class="bi bi-chat-left-fill" fill="#cc3b33" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          </svg>
    `
    document.querySelector('.main_left').style.flex="0.8";
    document.querySelector('.main_right').style.display="flex";
    document.querySelector('.main_right').style.flex="0.2";
    document.querySelector('.chat_display').innerHTML=html;

 }
 const hideChat=()=>{
    const html=`
    <svg width="26px" height="26px" viewBox="0 0 16 16" class="bi bi-chat-left-fill" fill="#00796b" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          </svg>
    `
    document.querySelector('.main_right').style.display="none";
    document.querySelector('.main_left').style.flex="1.0";
    
    document.querySelector('.main_right').style.flex="0";
    
        document.querySelector('.chat_display').innerHTML=html;

}
//console.log(dis)
const hideShow=()=>{
     const x=document.querySelector('.main_right');
     console.log(x.style.display)
    if(x.style.display==='flex'){
        //console.log('hey')
        hideChat();
       
       
      }
    else
    if(x.style.display==='none'){
       //heroku console.log('hey ')
        displayChat();
      
      
    }
}

const screenShare=()=>{
    navigator.mediaDevices.getDisplayMedia({video: true})
    .then(stream=>{
        const video=document.createElement('video');
        video.srcObject=stream;
        document.querySelector('.screen_share').style.width='600px !important';
        document.querySelector('.screen_share').append(video);
        video.play();
    })
}
/////////
function setScreen() {
    navigator.mediaDevices.getDisplayMedia().then(stream => {
       // toggleVid()
        // document.querySelector(".screen_sharing").style.display = "block";
        return stream;
    })
        .then(stream => {
            const screenTrack = stream.getTracks()[0];
            console.log(myVideoElement.getVideoTracks())
            myVideoElement.srcObject=stream;
            // console.log("stream.getTracks() ", stream.getTracks())
          /*  for (let socket_id in peers) {
                console.log(socket_id,peers[socket_id])
                // console.log("peers[socket_id].streams[0].getTracks() ", peers[socket_id].streams[0].getTracks())
                for (let index in peers[socket_id].streams[0].getTracks()) {
                    for (let index2 in stream.getTracks()) {
                        if (peers[socket_id].streams[0].getTracks()[index].kind === stream.getTracks()[index2].kind) {
                            peers[socket_id].replaceTrack(peers[socket_id].streams[0].getTracks()[index], stream.getTracks()[index2], peers[socket_id].streams[0])
                            break;
                        }
                    }
                }

            }*/



            screenTrack.onended = function () {
                console.log("ended")
                // document.querySelector(".screen_sharing").style.display = "none";
                navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                    for (let socket_id in peers) {
                        for (let index in peers[socket_id].streams[0].getTracks()) {
                            for (let index2 in stream.getTracks()) {
                                if (peers[socket_id].streams[0].getTracks()[index].kind === stream.getTracks()[index2].kind) {
                                    console.log("entered")
                                    peers[socket_id].replaceTrack(peers[socket_id].streams[0].getTracks()[index], stream.getTracks()[index2], peers[socket_id].streams[0])
                                    break;
                                }
                            }
                        }

                    }
                    myVideoStream = stream
                    myVideoElement.srcObject = myVideoStream
                }).catch(function (error) {
                    console.log(error);
                });

            }

        })
}


/**
 * Enable/disable video
 
function toggleVid() {
    for (let index in myVideoStream.getVideoTracks()) {
        myVideoStream.getVideoTracks()[index].enabled = !myVideoStream.getVideoTracks()[index].enabled
        // vidButton.innerText = myStream.getVideoTracks()[index].enabled ? "Video Enabled" : "Video Disabled"
    }
}*/