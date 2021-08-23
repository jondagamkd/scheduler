// Main function to load items from localStorage if any
var loadmyDay = function() {
    $('#currentDay').text(moment().format('dddd, MMMM Do'))
    myDay = JSON.parse(localStorage.getItem("myDay"));
  
    // if nothing in localStorage, create a new object to track all task status arrays
    if (!myDay) {
      myDay = {
        '9AM': "Available",
        '10AM': "Available",
        '11AM': "Available",
        '12PM': "Available",
        '1PM': "Available",
        '2PM': "Available",
        '3PM': "Available",
        '4PM': "Available",
        '5PM': "Available"
      };
    }
    

};
loadmyDay()

// save to localStorage
var savemyDay = function() {
    localStorage.setItem("myDay", JSON.stringify(myDay));
  };

// Display items in myDay object and arrange into bootstrap rows.
var displayDay = function() {
    document.getElementById("mainList").innerHTML = ""
    for (const key in myDay) {
        var inStr = "<div class='row timeRow'><div class='col-1 hour'>" + key + "</div><div class='col appts' id='" + key + "-input'><p>" + myDay[key] + "</p></div><div class='col-1 saveBtn'><span class='oi oi-lock-locked'></span></div></div>"
        document.getElementById("mainList").innerHTML += inStr;
        //var listTime = moment('8:45am', 'h:mma');
        var listHour = key.slice(0, -2)
        var amPM = key.substring(key.length - 2)
        var listTime = moment(listHour + ":00" + amPM, 'h:mmA');

        var stringy = $('#' + key + '-input').text()
        if (moment().isAfter(listTime, 'hour')) {
            $('#' + key + '-input').addClass("past");
            if (stringy === 'Available' || stringy === 'Current Hour') {
                $('#' + key + '-input').html('<p>No Longer Available Today</p>')
                myDay[key] = 'No Longer Available Today'
            }
        }
        if (moment().isSame(listTime, 'hour')) {
            $('#' + key + '-input').addClass("present");
            if (stringy === 'Available' || stringy === 'No Longer Available Today') {
                $('#' + key + '-input').html('<p>Current Hour</p>')
                myDay[key] = 'Current Hour'
            }
        }
        if (moment().isBefore(listTime, 'hour')) {
            $('#' + key + '-input').addClass("future");
            if (stringy === 'No Longer Available Today' || stringy === 'Current Hour') {
                $('#' + key + '-input').html('<p>Available</p>')
                myDay[key] = 'Available'
            }
        }
    }
}
displayDay()

// When main input block is clicked, edit but do not save till save button is clicked.
$(".timeRow").on("click", "p", function() {
    $(this).closest(".timeRow").children(".saveBtn").children("span").addClass("oi-lock-unlocked").removeClass("oi-lock-locked")
    var text = $(this)
      .text()
      .trim();
    var textInput = $("<textarea>")
      .addClass("form-control")
      .val(text)
      console.log(text);
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
  });

// Save what has been typed into the textarea, input block
$(".timeRow").on("click", ".saveBtn", function() {
    $(this).closest(".timeRow").children(".saveBtn").children("span").addClass("oi-lock-locked").removeClass("oi-lock-unlocked")

    var text = $(this)
      .closest(".timeRow")
      .children(".appts")
      .children("textarea")     
      .val()
      .trim();
      console.log('text area = ' + text)

    var rowKey = $(this)
        .closest(".timeRow")
        .children(".hour")
        .text();
        console.log('rowKey area = ' + rowKey)
    
    myDay[rowKey] = text
    savemyDay()

    // recreate p element
    var taskP = $("<p>")
    .text(text);
  
    // replace textarea with p element
    var apptBlock = $(this)
      .closest(".timeRow")
      .children(".appts")
      .children("textarea")    
    $(apptBlock).replaceWith(taskP);

  });

savemyDay()
setInterval(function(){ location.reload();  }, 600000);