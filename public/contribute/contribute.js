let gl_language = "";
let gl_framework = "";
let gl_platform = "";
let gl_category = "";
let colorCh = "#f5f5f5";

$(document).ready(() => {

    renderUserMenu(); // function declaration is in /header/username.js
    renderColorPick();

    // Set the page title
    $("#pageTitleID").html("Project Upload");

    // PROJECT TITLE change
    $("#titleInput").on("keyup", () => {
        let val = $("#titleInput").val();
        $(".panel-heading").html("<h4>" + val + "</h4>");
    });

    // LANGUAGE change
    $("#lngList").change(() => {
        let val = $("#lngList option:selected").val();
        gl_language = (val != "default") ? val : "";
        $("#lngInput").val("");
        renderFooter();
    });

    $("#lngInput").change(() => {
        gl_language = $("#lngInput").val();
        $("#lngList").val("default");
        renderFooter();

    });

    // FRAMEWORK change
    $("#frmList").change(() => {
        let val = $("#frmList option:selected").val();
        gl_framework = (val == "default") ? "" : val;
        $("#frmInput").val("");
        renderFooter();
    });

    $("#frmInput").change(() => {
        gl_framework = $("#frmInput").val();
        $("#frmList").val("default");
        renderFooter();
    });

    // PLATFORM change
    $("#pltList").change(() => {
        let val = $("#pltList option:selected").val();
        gl_platform = (val != "default") ? val : "";
        $("#pltInput").val("");
        renderFooter();
    });

    $("#pltInput").change(() => {
        gl_platform = $("#pltInput").val();
        $("#pltList").val("default");
        renderFooter();
    });

    // CATEGORY change
    $("#ctgList").change(() => {
        let val = $("#ctgList option:selected").val();
        gl_category = (val != "default") ? val : "";
        $("#ctgInput").val("");
    });

    $("#ctgInput").change(() => {
        gl_category = (this).val();
        $("#ctgList").val("default");
    });

    // DISPLAY image
    $("#photo").change(function () {
        displayImage(this);
        //displayColors();
    });

    // DISPLAY video
    $("#video").change(function () {
        displayVideo(this);
    });

    // FORM SUBMISSION LOGIC
    //$("#uform").on("submit", submitProject);

});
window.addEventListener("load", function () {
    function submitProject() {
        console.log("in submitting");
        var recordedVideo = document.getElementById("videoUpload");
        if (recordedVideo){
            var recordedVideoPath = document.getElementById("videoUpload").value;
        }
        if(recordedVideoPath){
            
            console.log("submission: ", recordedVideoPath);
        }
        else{
            console.log("even if it is not present, it still goes into else", recordedVideoPath);
        }
        var XHR = new XMLHttpRequest();
        //Validation
        
        if (gl_language == "") {
            $("#lngList").focus();
            return;
        } else if (gl_framework == "") {
            $("#frmList").focus();
            return;
        } else if (gl_platform == "") {
            $("#pltList").focus();
            return;
        }

        // Developer processing
        var developers = [];
        //var color = document.getElementById("colChoice").value;
        var color = colorCh;
        // Image processing
        var date = new Date().getTime();        
        var image = document.getElementById("photo").files[0];
        // Video processing
        if(!recordedVideoPath) {
            var video = document.getElementById("video").files[0];
        }
    
        // Creating a processed form
        var formData = new FormData();
        formData.append("userID", $("#userIDhtml").val());
        formData.append("title", $("#titleInput").val());
        formData.append("language", gl_language);
        formData.append("framework", gl_framework);
        formData.append("platform", gl_platform);
        formData.append("category", gl_category);
        formData.append("desc", $("#desc").val());
        formData.append("developers", developers);
        formData.append("color", color);
        if(!recordedVideoPath) {
            formData.append("video", video);
        }
        else{
            formData.append("videoUpload", recordedVideoPath);
        }
        formData.append("image", image);
        //console.log(formData);

         //create progress report
         var progressElement = document.getElementById("media-progress");
         progressElement.style.visibility = "visible";
         
         XHR.addEventListener("progress", function(event){
            if (event.lengthComputable){
                var percentComplete = (event.loaded/event.total) * 100;
                var pElement = document.getElementById("percentComplete");
                var text = "..." + percentComplete + "%";
                pElement.value = text;
                }
                else {
                    alert("Not uploaded properly.");
                }
        });




        // listening for server response to the POST request
        XHR.addEventListener("load", function(event) {        
            if (event.target.responseText == "success"){
                alert ("Your project is uploaded successfully! Thank you.");
                window.location.replace("/profile");
            } else if (event.target.responseText === "validation error"){
                alert ("Missing text field");
            } else if (event.target.responseText === "validation error - file") {
                alert ("Missing file upload");
            } else if (event.target.responseText === "validation error - field length") {
                alert ("Invalid field length");
            }
        });

        // Sending a form
        if(!recordedVideoPath){
            console.log("uploading project");
            XHR.open("POST", "/upload-project");
            XHR.send(formData);
        }
        else {
            console.log("uploading recorded video");
            XHR.open("POST", "/upload-recording");
            XHR.send(formData);
        }
    }
    document.getElementById("uForm").addEventListener("submit", function (event) {
        event.preventDefault();
        submitProject();  
    });
});

// Render Tile footer: Language, gl_framework, Platform
// TODO to make a dynamic list from DB
function renderFooter() {
    let footerHtml = "";

    if (gl_language != "") {
        footerHtml += "<b>Language: </b>" + gl_language;
    }

    if (gl_framework != "") {
        footerHtml += (footerHtml != "") ? ", " : "";
        footerHtml += "<b>Framework: </b>" + gl_framework;
    }
    if (gl_platform != "") {
        footerHtml += (footerHtml != "") ? ", " : "";
        footerHtml += "<b>Platform: </b>" + gl_platform;
    }

    $(".panel-footer").html(footerHtml);
}

// Display image preview before uploaded
function displayImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#img').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

// Display video preview before uploaded
function displayVideo(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            videoHtml = "<video id='vd'controls><source src='" +
                e.target.result + "' type='video/mp4'></video>";
            $("#videoPrv").html(videoHtml);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

// TODO

function renderColorPick() {
    var colRow = $("#colRow");
    var colorArray = ["#f5f5f5", "#eda3a3", "#efeba0", "#a0efa1", "#a0d9ef", "#cca9d8"];
    var colHtml = "";

    $.each(colorArray, (key, color) => {
        colHtml +=
            "<td class='colTile'>" +
            "  <button type='button' class='btn colBtn' onclick='changeColor(\"" + color +"\")'" +
            "    style='background-color:"+color+"; border:solid 0.5px #dcdcdc;'></button>"+
            "</td>";
    });
   colRow.html(colHtml);
   return;
}

function changeColor(col) {
    var styleH = $(".panel-heading").attr("style");
    var styleF = $(".panel-footer").attr("style");

    $(".panel-heading").attr('style', styleH + "background-color:" + col + ";");
    $(".panel-footer").attr('style', styleF + "background-color:" + col + ";");
    $(".swTile").attr('style', "border: solid 1px " + col + ";" );

    colorCh = col; // assigning to global var
    return;
}

