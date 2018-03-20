var tempUserName = "Clay";
var tempLicenseNumber = "2CJC569";

var register = function(){
    var registration = $("#registration");
    registration.on("click",function(event){
        $.ajax({
            method: "POST",
            url: "/waleet/create",
            data : {
                username : tempUserName, 
                licenseNumber : tempLicenseNumber
            },
            success : function(data){
                console.log("Successful registration");
            },
            error : function(data){
                console.log("Error making new account");
            }
        })
    });
}

register();