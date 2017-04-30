if (document.deviceready) {
    document.addEventlistener('deviceready', onDeviceReady);
} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady)
}

const NOERROR = 0;

var userGuid = "";
var userID = "";
var user = "";
var password = "";
var msg_id = "";
var fromuser = "";
var user_list = "";
var currentimg = "";

/***** Form Data for Logging in and Registering *****/
var formdata = new FormData();
/***** Form Data after Logging in *****/
var newformdata = new FormData();
/***** Form Data for getting Image Data *****/
var getimgformdata = new FormData();
/****** Form data for deleting messages *****/
var deleteformdata = new FormData();
/***** form data for sending messages *****/
var sendformdata = new FormData();

function onDeviceReady() {

    document.getElementById("back").addEventListener("touchstart", back);
    document.getElementById("register").addEventListener("touchend", onRegister);
    document.getElementById("login").addEventListener("touchend", onLogin);
    document.getElementById("takepicture").addEventListener("touchend", takePicture);
    document.getElementById("send").addEventListener("touchend", sendMessage);
    document.getElementById("msgSend").addEventListener("touchstart", msgSendOpenModal);
    document.getElementById("delete").addEventListener("touchend", deleteMessage);
    document.getElementById("DetailsSend").addEventListener("touchstart", detailsSend);
    document.getElementById("DetailsBack").addEventListener("touchstart", detailsBack);
}

function binaryStringToArrayBuffer(binary) {
    var length = binary.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    var i = -1;
    while (++i < length) {
        arr[i] = binary.charCodeAt(i);
    }
    return buf;
}

function dataURLToBlob(dataURL) {
    return Promise.resolve().then(function () {
       var type = dataURL.match(/data:([^;]+)/)[1];
       var base64 = dataURL.replace(/^[^,]+,/, '');
       var buff = binaryStringToArrayBuffer(atob(base64));
          return new Blob([buff], {
            type: type
            });
    });
}

function detailsSend() {
    var closemodal = document.querySelector("#msgDetails");
    closemodal.classList.toggle("active");
    
    var openmodal = document.querySelector("#sendMsg");
    openmodal.classList.toggle("active");
    msgSendOpenModal();

}

function back() {
    var closemodal = document.querySelector("#sendMsg");
    closemodal.classList.toggle("active");
    getMessageList();
}

function detailsBack() {
    var closemodal = document.querySelector("#msgDetails");
    closemodal.classList.toggle("active");
    getMessageList();
}

function onLogin() {

    var url = "https://griffis.edumedia.ca/mad9022/steg/login.php";
    user = document.getElementById("username").value;
    password = document.getElementById("email").value;
    
    formdata = new FormData();
    formdata.append("user_name", user);
    formdata.append("email", password);
    console.log("form data: " + formdata);

    var req = new Request(url, {
        method: 'POST',
        mode: 'cors',
        body: formdata
    });
    
    fetch(req).then(function (response) {
        return response.json();
                    
    }).then(function (data) {
        console.log(data);
        if (data.code == NOERROR) {
            userGuid = data.user_guid;
            userID = data.user_id;


            newformdata.append("user_id", userID);
            newformdata.append("user_guid", userGuid);
            var msglist = document.querySelector("#msglist");
            msglist.classList.toggle("active");

            getMessageList();
        } else {
            /***** Error Message *****/
            document.getElementById("code").innerHTML = data.message;
        }
        console.dir(data.user_id)
    })
}

/***** When you register, this function runs *****/
function onRegister() {

    var url = "https://griffis.edumedia.ca/mad9022/steg/register.php";

    user = document.getElementById("username").value;
    password = document.getElementById("email").value;
    // error check

    formdata = new FormData();

    formdata.append("user_name", user);
    formdata.append("email", password);

    var req = new Request(url, {
        method: 'POST',
        mode: 'cors',
        body: formdata
    });

    fetch(req).then(function (response) {
        return response.json();
    
    }).then(function (data) {
        console.log(formdata);
        console.log(data);
        document.getElementById("code").innerHTML = data.message;
    })
    
    console.dir(req);
    console.log(formdata);

}
/***** The messages are stored in the msg-list.php site *****/
function getMessageList() {

    var url = "https://griffis.edumedia.ca/mad9022/steg/msg-list.php";

    var req = new Request(url, {
        method: 'POST',
        mode: 'cors',
        body: newformdata
    });
    fetch(req).then(function (response) {
        return response.json();
                    
    }).then(function (data) {
        console.log(data);
        var ul = document.getElementById("message-list");
        ul.innerHTML = "";
        var msgs = data.messages;

        msgs.forEach(function (value) {
            var listitem = document.createElement("li");
            listitem.classList.add("table-view-cell");
                     
            var span = document.createElement("span");
            span.classList.add("name");
                     
            var a1 = document.createElement("p");
            a1.classList.add("name");
            a1.setAttribute("message_id", value.msg_id);
            a1.setAttribute("sender_id", value.sender_id);
            a1.setAttribute("user_name", value.user_name);
            a1.innerHTML = "Message from: " + value.user_name;
                     
            var spanDetails = document.createElement("span");
            spanDetails.classList.add("push-right");
            spanDetails.addEventListener("touchend", function (ev) {
                                         
                var msgdet = document.querySelector("#msgDetails");
                msgdet.classList.toggle("active");
                msg_id = a1.getAttribute("message_id");
                fromuser = a1.getAttribute("user_name");
                getMsgDetails();
            });
                     
            span.appendChild(a1);
            listitem.appendChild(span);
            listitem.appendChild(spanDetails);
            ul.appendChild(listitem);
        })
    })

}

/***** Getting the message details are from the msg-get.php file *****/
function getMsgDetails() {

    getimgformdata = new FormData();
    getimgformdata.append("user_id", userID);
    getimgformdata.append("user_guid", userGuid);
    getimgformdata.append("message_id", msg_id);
    console.log(msg_id);

    var url = "https://griffis.edumedia.ca/mad9022/steg/msg-get.php";

    var req = new Request(url, {
        method: 'POST',
        mode: 'cors',
        body: getimgformdata
    });
    
    fetch(req).then(function (response) {
        return response.json();
                    
    }).then(function (data) {
        console.log(data);
        var title = document.getElementById("msgby");
        title.innerHTML = "BY: " + fromuser;

        var imagebox = document.getElementById("picdet");
        imagebox.innerHTML = "";

        var newCanvas = document.createElement("canvas");
        newCanvas.id = "msgPic";
            
        var imgTag = document.createElement("img");
        imgTag.src = "https://griffis.edumedia.ca/mad9022/steg/" + data.image;
        imgTag.crossOrigin = "anonymous";

        var ctx = newCanvas.getContext('2d');
        imgTag.crossOrigin = "anonymous";
        imgTag.addEventListener("load", function (ev) {
                                
            var w = imgTag.width;
            var h = imgTag.height;
            newCanvas.width = w;
            newCanvas.height = h;
            ctx.drawImage(imgTag, 0, 0);

            var message = BITS.getMessage(userID, newCanvas);
            console.log("message recieved: " + message);
            document.getElementById("recmsg").innerHTML = message;

        });

        imagebox.appendChild(newCanvas);

    })

}
/***** function when you send a message *****/
function msgSendOpenModal() {

    var imagebox = document.getElementById("myimage");
    imagebox.innerHTML = "";

    document.getElementById("takepicture").style.display = "block";
    document.getElementById("send").style.display = "none";
    document.getElementById("messagetosend").value = "";
    document.getElementById("user-list").innerHTML = "";

    var url = "https://griffis.edumedia.ca/mad9022/steg/user-list.php";

    var req = new Request(url, {
        method: 'POST',
        mode: 'cors',
        body: newformdata
    });
    fetch(req).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        user_list = data.users;

        var select = document.getElementById("user-list");

        user_list.forEach(function (value) {
            var newOption = document.createElement("option");
            newOption.value = value.user_id;
            newOption.text = value.user_name;
            select.appendChild(newOption);
        })

    })

}
/***** Function to take a picture, PNG is much better to use than JPEG and quality can be adjusted. *****/
function takePicture() {

    var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.PNG,
        pictureSourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        targetHeight: 300
        targetWidth: 300,
    }

    function successCallback(img_URI) {

        document.getElementById("takepicture").style.display = "none";
        document.getElementById("send").style.display = "block";

        currentimage = document.createElement("img");
        currentimage.classList.add("bigpic");
        currentimage.src = "data:image/jpeg;base64," + img_URI;
        console.log(currentimage.src);

        var newCanvas = document.createElement("canvas");
        newCanvas.id = "sendPicCanvas";
        var imagebox = document.getElementById("myimage");
        imagebox.innerHTML = "";

        var ctx = newCanvas.getContext('2d');
        currentimage.crossOrigin = "anonymous";
        currentimage.addEventListener("load", function (ev) {
            var w = currentimage.width;
            var h = currentimage.height;
            newCanvas.width = w;
            newCanvas.height = h;
            ctx.drawImage(currentimage, 0, 0);
        });

        imagebox.appendChild(newCanvas);
    }
    /***** If there's any issues with the picture *****/
    function errorCallback() {
        console.log("Picture failure");
    }
    navigator.camera.getPicture(successCallback, errorCallback, options);
}
/***** Function to send a message *****/
function sendMessage() {

    var canvas = document.getElementById("sendPicCanvas");
    var select = document.getElementById("user-list");
    var useridtosend = select.value; 
    console.log(useridtosend);
    var bitID = BITS.numberToBitArray(useridtosend);
    var message = document.getElementById("messagetosend").value.trim();
    var bitMsg = BITS.stringToBitArray(message);
    var msgLength = message.length;
    var bitLngth = BITS.numberToBitArray(msgLength * 16);

    canvas = BITS.setUserId(bitID, canvas);
    canvas = BITS.setMsgLength(bitLngth, canvas);
    canvas = BITS.setMessage(bitMsg, canvas);

    let dataURL = canvas.toDataURL();
    dataURLToBlob(dataURL)
        .then(function (blob) {
            sendformdata = new FormData();
            sendformdata.append("image", blob);
            sendformdata.append("user_id", userID);
            sendformdata.append("user_guid", userGuid);
            sendformdata.append("recipient_id", useridtosend);

            var url = "https://griffis.edumedia.ca/mad9022/steg/msg-send.php";

            var req = new Request(url, {
                method: 'POST',
                mode: 'cors',
                body: sendformdata
            });
            fetch(req).then(function (response) {
                return response.json();
            }).then(function (data) {
                var closemodal = document.querySelector("#sendMsg");
                closemodal.classList.toggle("active");
                getMessageList();
            });
        });
}
/***** Function to delete a message *****/
function deleteMessage() {

    var url = "https://griffis.edumedia.ca/mad9022/steg/msg-delete.php";

    deleteformdata = new FormData();

    deleteformdata.append("user_id", userID);
    deleteformdata.append("user_guid", userGuid);
    deleteformdata.append("message_id", msg_id);

    var req = new Request(url, {
        method: 'POST',
        mode: 'cors',
        body: deleteformdata
    });
    
    fetch(req).then(function (response) {
        return response.json();
                    
    }).then(function (data) {
        var closemodal = document.querySelector("#msgDetails");
        closemodal.classList.toggle("active");
        getMessageList();
    })
}
