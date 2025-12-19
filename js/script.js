let elList = document.querySelector(".list")
let elMessageForm = document.querySelector(".message-form")
let elChooseImgInp = document.querySelector(".img-inp")
let elMicBtn = document.querySelector(".mic-btn")
let elCamBtn = document.querySelector(".cam-btn")
let elMessageInp = document.querySelector(".message-inp")

let messageList = get("messages") || []

let date = new Date()


// Storage save started
function set(key, value){
    localStorage.setItem(key, typeof value == "object" ? JSON.stringify(value) : value)
}

function get(key){
    try{
        const result = JSON.parse(localStorage.getItem(key))
        return result
    }
    catch{
        return localStorage.getItem(key)
    }
}
set("messages", messageList)
// Storage save finished

// Render messages started
function renderMessage(arr, list){
    list.innerHTML = null
    arr.forEach(item => {
        let elItem = document.createElement("li")
        list.appendChild(elItem)
        if(item.image) {
            elItem.outerHTML = `
                <li class="bg-[#0088cc] relative message-item ml-auto text-white text-[16px] text-shadow-md p-2 w-[80%] rounded-tl-[18px] rounded-bl-[18px] rounded-tr-[15px]">
                    <img class="w-full rounded-[18px]" src="${item.image}" alt="Nature image">
                    <p class="mt-[5px]">${item.content}</p>
                    <div class="text-end text-[13px]">
                        <span>${item.createdAt}</span>
                    </div>
                </li>
            `
        }
        else if(item.voiceRecord){
            elItem.outerHTML = `
                <audio class="ml-auto" src="${item.voiceRecord}" id="audio" controls></audio>
            `
        }
        else if(item.videoRecord){
            elItem.outerHTML = `
                <video class="ml-auto rounded-[30px]" src="${item.videoRecord}" controls></video>
            `
        }
        else {
            elItem.outerHTML = `
            <li class="bg-[#0088cc] relative message-item ml-auto text-white text-[16px] text-shadow-md p-2 w-[80%] rounded-tl-[18px] rounded-bl-[18px] rounded-tr-[15px]">
                <p>${item.content}</p>
                <div class="text-end text-[13px]">
                    <span>${item.createdAt}</span>
                </div>
            </li>
        `
        }
    })
}
renderMessage(messageList, elList)
// Render messages dinished

// Choose img part started
let imgUrl
elChooseImgInp.addEventListener("change",  event => {
    imgUrl = (URL.createObjectURL(event.target.files[0]));
})
// Choose img part finished

// Voice Record Start
let mediaRecorder;
let audioChunks = [];
let audioURL;
elMicBtn.addEventListener("pointerdown", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    mediaRecorder.start();

    mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
    };
});

elMicBtn.addEventListener("pointerup", () => {
    mediaRecorder.stop();

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        audioURL = URL.createObjectURL(audioBlob);
    };
});

// Voice Record Finished

// Camera Record Start
let mediaRecorder2;
let videoChunks = [];
let videoURL;
elCamBtn.addEventListener("pointerdown", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    mediaRecorder2 = new MediaRecorder(stream);
    videoChunks = [];
    mediaRecorder2.start();

    mediaRecorder2.ondataavailable = (e) => {
        videoChunks.push(e.data);
    };
});

elCamBtn.addEventListener("pointerup", () => {
    mediaRecorder2.stop();

    mediaRecorder2.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: "video/webm" });
        videoURL = URL.createObjectURL(videoBlob);
    };
});

// Camera Record Finished

// Submit message started
elMessageForm.addEventListener("submit", event => {
    event.preventDefault()
    const time = `${date.toString().split(" ")[4].split(":")[0]}:${date.toString().split(" ")[4].split(":")[1]}`
    const data = {
        id: messageList[messageList.length - 1]?.id ? messageList[messageList.length - 1]?.id + 1 : 1,
        image:imgUrl,
        content:event.target.message.value,
        createdAt:time,
        voiceRecord: audioURL,
        videoRecord: videoURL
    }
    messageList.push(data)
    renderMessage(messageList, elList)
    set("messages", messageList)
    imgUrl = null
    event.target.reset()
    audioURL = null
    videoURL = null
})
// Submit message finished

