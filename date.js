// console.log(module);

// module.exports=getDate;

// module.exports.getDate = getDate;

/* 
    Instead of writing    module.exports   
    we can also write it as only   exports
*/

// using anonymous function shorten our code

// exports.getDate = getDate;   <--  this was written before 

exports.getDate = function () {
    
    
    let today = new Date();
    
    const currentDay = today.getDay();
    // var day = "";
    /*  
    switch (currentDay) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
            break;
            
        default:
            console.log("Current Day is "+ day);
    }*/
            
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
            
    
            
    if (currentDay === 0 || currentDay === 6) {
        // day = "Weekend";
        // return res.send("Yeah it's weekend !");
    } else {
        // day = "Weekday";
        // res.write("Ohh! It's week Day !");
        // return res.sendFile(__dirname+"/index.html");
    }
    return today.toLocaleDateString("en-us", options);
}

exports.getDay = function (){
    let today = new Date();

    var options = {
        weekday: "long"
    }

    

    return today.toLocaleDateString("en-us",options);
}

// console.log(module.exports);