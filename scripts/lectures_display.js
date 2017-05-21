
// var lectureTime1 = localStorage.lectureTime;
$( document ).ready(function() {

  var config = {
    apiKey: "AIzaSyCxnL1UyMBU51tJU5MAKmCxHPAaMpb2veY",
    authDomain: "listen-f5fcf.firebaseapp.com",
    databaseURL: "https://listen-f5fcf.firebaseio.com",
    projectId: "listen-f5fcf",
    storageBucket: "listen-f5fcf.appspot.com",
    messagingSenderId: "913421957842"
  };
  
  firebase.initializeApp(config);

  var database = firebase.database();



  var courseKey = localStorage.courseCode;
  console.log(localStorage.courseCode);
  var coursesRef = database.ref("courses/" + courseKey);
  var lecturesRef = database.ref("courses/" + courseKey + "/lectures");
  var lectureToday = 0;
  var lectureKey;


  function setLectureTodayKey() {
    lecturesRef.once("value", function(data) {
      var prev = 0;
      $.when(prev = data.numChildren()).done(function() {
        lectureToday = prev + 1;
        lectureKey = "Lecture " + lectureToday;
        setTodayLectureLabel();
        return;
      });  
    });
  }

  

  function todayDateGet() {
    var months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    return months[month] + " " + day + ", " + year;

  }

  function pushPrevLecture(all) {
    for (var i = all.length-1; i >= 0; i--) {
      var html = '<tr>' + 
                  '<td class="lNumber">' + all[i].num + '</td>' +
                  '<td class="lTitle">' + all[i].title + '</td>' +
                  '<td class="lDate">' + all[i].date + '</td>' +
                  '<td class="lQuestions">' + all[i].questions + '</td>' +
                '</tr>'
      $(html).insertAfter(".starterclass");
    }
  }


  function displayPrevLectures() {
    var all = [];
    lecturesRef.once("value", function(data) {
      $.when(
        data.forEach(function(lecture) {
          all.push({num: lecture.val().number, title: lecture.val().title, date: lecture.val().time});
        })
        ).done(function() {
        pushPrevLecture(all);
      });
    });
  }
  

  function lectureStart(key, title, number) {
    lectureRef = database.ref("courses/" + courseKey + "/lectures/" + key);
    lectureRef.set({time: todayDateGet(), title: title, number: number});

    var activeLecture = database.ref("activeLecture");
    $.when(activeLecture.remove()).done(activeLecture.push({course: localStorage.courseCode + " " + localStorage.courseTitle, lecture: lectureKey}));

  }


  function setTodayLectureLabel() {
    var txt = "Lecture " + lectureToday;
    $("#lecture-today").text(txt);
  }

  function setSomeElements() {
    $("#course-title-current").text(localStorage.courseCode + ": " + localStorage.courseTitle);
    $("#breadcode").text(localStorage.courseCode);
  }


  $("#start-lecture-today").click(function() {
      console.log("here");
      if ($("#today-lecture-title").val() == "") {
        $.confirm({
            title: 'Lecture Title Empty',
            content: 'Do you want to proceed without providing lecture title?',
            confirmButton: 'Yes',
            cancelButton: 'No',
            confirm: function(){
              setTodayLectureLabel();
              console.log(lectureToday);
              var ltitle = $("#today-lecture-title").val();
              lectureStart(lectureKey, ltitle, lectureToday);
              localStorage.courseKey = courseKey;
              localStorage.lectureKey = lectureKey;
              document.location.href = './active_lecture.html';   
            },
            cancel: function(){
              $("#today-lecture-title").select();   
            }
        });
      }else {
      }
      setTodayLectureLabel();
      console.log(lectureToday);
      var ltitle = $("#today-lecture-title").val();
      lectureStart(lectureKey, ltitle, lectureToday);
      localStorage.courseKey = courseKey;
      localStorage.lectureKey = lectureKey;
      localStorage.lectureTitle = ltitle;
      document.location.href = './active_lecture.html';
  });

  setLectureTodayKey();
  setSomeElements();
  displayPrevLectures();
});