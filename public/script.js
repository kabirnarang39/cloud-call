var socket = io('/');
let myVideoStream;
const videoGrid=document.querySelector('.video-grid')
const myVideoElement=document.createElement('video')
myVideoElement.muted=true;
const peers = {}
var peer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443'
});
window.addEventListener("load", function (event) {
    Dish();
  
    window.onresize = Dish;
  }, false);
//console.log(JSON.parse(myParam))
//console.log(window.location.href.split('?')[1])
//console.log(user);
//console.log(videoGrid)
///////////////////////////////////////////////
////////////////////////////////////////
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
socket.on('user-connected',(userId,username,image)=>{
    //document.querySelector('.flash').innerHTML='User Connected'+userId;
    connectToNewUser(userId,stream);
    document.querySelector('.flash').innerHTML=(`<div class="alert success"><span class="closebtn" onClick="closeBtn();">&times;</span><strong>${username}</strong> connected.</div>`)
    //alert('Somebody connected', userId)
    
})

const text=document.querySelector('input')
text.addEventListener('change',(event)=>{
if(event.target.value.length!==0){
socket.emit('message',event.target.value,username,image)
event.target.value='';
}
})

socket.on('createMessage',(message,username,image)=>{
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
                    <img src=${image} style="  
                    vertical-align: middle;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    padding:2px;">
										<span class="messageSender">${username}</span> 
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
    delete peers[userId];
  })
peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id,username,image)
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
 

const connectToNewUser=(userId,stream)=>{
    var call = peer.call(userId, stream);
    const video=document.createElement('video')
    video.id=userId;
    fetch(`/user?peer=${call.peer}&room=${ROOM_ID}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
       console.log(data)
      });
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
    <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" fill="#cc3b33" class="bi bi-mic-mute" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M12.734 9.613A4.995 4.995 0 0 0 13 8V7a.5.5 0 0 0-1 0v1c0 .274-.027.54-.08.799l.814.814zm-2.522 1.72A4 4 0 0 1 4 8V7a.5.5 0 0 0-1 0v1a5 5 0 0 0 4.5 4.975V15h-3a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-3v-2.025a4.973 4.973 0 0 0 2.43-.923l-.718-.719zM11 7.88V3a3 3 0 0 0-5.842-.963l.845.845A2 2 0 0 1 10 3v3.879l1 1zM8.738 9.86l.748.748A3 3 0 0 1 5 8V6.121l1 1V8a2 2 0 0 0 2.738 1.86zm4.908 3.494l-12-12 .708-.708 12 12-.708.707z"/>
</svg>
    `
    document.querySelector('.main_mute_button').innerHTML=html;
}
const setMuteButton=()=>{
    const html=`
    <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" fill="#00796b" class="bi bi-mic" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
    <path fill-rule="evenodd" d="M10 8V3a2 2 0 1 0-4 0v5a2 2 0 1 0 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
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
    <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" fill="#cc3b33" class="bi bi-camera-video-off" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518l.605.847zM1.428 4.18A.999.999 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634l.58.814zM15 11.73l-3.5-1.555v-4.35L15 4.269v7.462zm-4.407 3.56l-10-14 .814-.58 10 14-.814.58z"/>
  </svg>
    `
    document.querySelector('.main_video_button').innerHTML=html;
   
}
const setStopVideo=()=>{
    const html=`
    <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" fill="#00796b" class="bi bi-camera-video" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175l3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
      </svg>
    `
    document.querySelector('.main_video_button').innerHTML=html;
}
const displayChat=()=>{
    const html=`
    <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" fill="#cc3b33" class="bi bi-chat" viewBox="0 0 16 16">
            <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
          </svg>
    `
    document.querySelector('.main_right').style.display="flex";
    document.querySelector('.chat_display').innerHTML=html;

 }
 const hideChat=()=>{
    const html=`
    <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" fill="#00796b" class="bi bi-chat" viewBox="0 0 16 16">
            <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
          </svg>
    `
    document.querySelector('.main_right').style.display="none";
    
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
    if(x.style.display===''||x.style.display==='none'){
       //heroku console.log('hey ')
        displayChat();
      
      
    }
}





/**
 * Enable/disable video
 
function toggleVid() {
    for (let index in myVideoStream.getVideoTracks()) {
        myVideoStream.getVideoTracks()[index].enabled = !myVideoStream.getVideoTracks()[index].enabled
        // vidButton.innerText = myStream.getVideoTracks()[index].enabled ? "Video Enabled" : "Video Disabled"
    }
}*/
// Enable screen share
const shareScreenBtn = document.getElementById("start");
shareScreenBtn.addEventListener("click", (e) => {
  if (e.target.classList.contains("true")) return;
  e.target.setAttribute("tool_tip", "You are already presenting screen");
  e.target.classList.add("true");
  navigator.mediaDevices
    .getDisplayMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      },
    })
    .then((stream) => {
      var videoTrack = stream.getVideoTracks()[0];
      myVideoTrack = myVideoStream.getVideoTracks()[0];
      setScreenShareDisableButton();
      replaceVideoTrack(myVideoStream, videoTrack);
      for (peer in peers) {
        console.log(peers[peer].peerConnection.getSenders())
        let sender = peers[peer].peerConnection.getSenders().find(function (s) {
          return s.track.kind == videoTrack.kind;
        });
        sender.replaceTrack(videoTrack);
      }
      const elementsWrapper = document.querySelector(".elements-wrapper");
      const stopBtn = document.createElement("button");
      stopBtn.classList.add("video-element");
      stopBtn.classList.add("stop-presenting-button");
      stopBtn.innerHTML = "Stop Sharing";
      elementsWrapper.classList.add("screen-share");
      elementsWrapper.appendChild(stopBtn);
      videoTrack.onended = () => {
        elementsWrapper.classList.remove("screen-share");
        stopBtn.remove();
        stopPresenting(videoTrack);
      };
      stopBtn.onclick = () => {
        videoTrack.stop();
        elementsWrapper.classList.remove("screen-share");
        stopBtn.remove();
        stopPresenting(videoTrack);
      };
    });
});
const stopPresenting = (videoTrack) => {
    setScreenShareButton();
    shareScreenBtn.classList.remove("true");
    shareScreenBtn.setAttribute("tool_tip", "Present Screen");
    for (peer in peers) {
      let sender = peers[peer].peerConnection.getSenders().find(function (s) {
        return s.track.kind == videoTrack.kind;
      });
      sender.replaceTrack(myVideoTrack);
    }
    replaceVideoTrack(myVideoStream, myVideoTrack);
  };
/**
 * Enable/disable video
 */

const replaceVideoTrack = (stream, videoTrack) => {
    stream.removeTrack(stream.getVideoTracks()[0]);
    stream.addTrack(videoTrack);
  };
////////
const setScreenShareButton=()=>{
    const html=`
    <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" fill="#00796b" class="bi bi-box-arrow-up" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"/>
    <path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"/>
  </svg>
    `
    document.querySelector('.main_screen_button').innerHTML=html;
}
const setScreenShareDisableButton=()=>{
    const html=`
  <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" fill="#cc3b33" class="bi bi-file-x" viewBox="0 0 16 16">
  <path d="M6.146 6.146a.5.5 0 0 1 .708 0L8 7.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 8l1.147 1.146a.5.5 0 0 1-.708.708L8 8.707 6.854 9.854a.5.5 0 0 1-.708-.708L7.293 8 6.146 6.854a.5.5 0 0 1 0-.708z"/>
  <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
</svg>
    `
    document.querySelector('.main_screen_button').innerHTML=html;
}
const meetEnd=()=>{
    window.location.href='https://zoom-12.herokuapp.com/meet-end'
}
   
const shareToggleButton = document.getElementById('share-toggle')
shareToggleButton.addEventListener('click', e => {
  const dialogue = document.querySelector('.dialogue-container')
  dialogue.classList.toggle('dialogue-active')
})
const copyButton = document.querySelector('#copy-button')
const shareLink = document.querySelector('.share-link')
console.log(window.location.href.split('?')[0])
shareLink.innerHTML = window.location.href.split('?')[0]
copyButton.setAttribute('meeting_link', window.location.href.split('?')[0])
const dialogueCloseButton = document.querySelector('#close-dialogue')
dialogueCloseButton.addEventListener('click', (e) => {
  const dialogue = document.querySelector('.dialogue-container')
  dialogue.classList.toggle('dialogue-active')
})
copyButton.addEventListener("mousedown", (e) => {
  const copyText = e.target.getAttribute('meeting_link')
  navigator.clipboard.writeText(copyText);
  e.target.setAttribute("tool_tip", 'copied');
});
copyButton.addEventListener("mouseout", (e) => {
  e.target.setAttribute("tool_tip", 'copy');
});
const setTime = () => {
  const timeButton = document.getElementById('time')
  var time = new Date();
  timeButton.innerHTML = `${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
}
setTime()
setInterval(() => {
  setTime()
}, 500);