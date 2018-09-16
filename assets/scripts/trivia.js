/*
 * JavaScript code for Trivia Quiz 
 */

 /* Object containing all the data for the trivia quiz
  * Structured format should make it fairly easy to add
  * and remove questions.
  * ToDo: the 'answer' field should be an index into the 
  * array of options rather than a string. 
  */
 trivia_quiz = {
   "items" : [
     { 
       "question":"Which state is nicknamed \"The Magnolia State\"?",
       "options": ["Arkansas", "Florida", "Mississippi", "South Carolina"],
       "answer" : "Mississippi",
       "moreInfo": "The official nickname for Mississippi is The Magnolia State. The magnolia is also the state flower and the state tree of Mississippi."
     },
     { 
      "question":"Which is the only Great Lake located entirely within the United States?",
      "options": ["Superior", "Erie", "Ontario", "Michigan"],
      "answer" : "Michigan",
      "moreInfo" : "The other lakes - Lake Superior, Lake Erie, Lake Huron and Lake Ontario - form a water boundary between the United States and Canada"
     },
     { 
      "question":"Which state shares the LONGEST border with a FOREIGN COUNTRY?",
      "options": ["Alaska", "Texas", "Michigan", "Montana"],
      "answer" : "Alaska",
      "moreInfo" : "At 1538 miles, Alaska's border with Canada is longer than that of any other border state"
     },
     { 
      "question":"In which city were blue jeans invented?",
      "options": ["Dallas", "Memphis", "New York", "San Francisco"],
      "answer" : "San Francisco",
      "moreInfo" : "May 20, 1873 marked an historic day: the birth of the blue jean. It was on that day that Levi Strauss and Jacob Davis obtained a U.S. patent on the process of putting rivets in men's work pants for the very first time."
     },
     { 
      "question":"Which state has produced the most Presidents of the United States?",
      "options": ["Massachusetts", "Virginia", "Ohio", "Illinois"],
      "answer" : "Virginia",
      "moreInfo" : "George Washington, Thomas Jefferson, James Madison, James Monroe, William Henry Harrison, John Tyler, Zachary Taylor and Woodrow Wilson."
     },
     { 
      "question":"How many oceans does the United States share a coastline with?",
      "options": ["2", "1", "4", "3"],
      "answer" : "3",
      "moreInfo" : "Besides the Pacific and Atlantic Oceans, the United States also borders the Arctic Ocean at Alaska."
     },
     { 
      "question":"Name the city that has the most boulevards in the United States",
      "options": ["Los Angeles", "New Orleans", "New York", "Kansas City"],
      "answer" : "Kansas City",
      "moreInfo" : " The city also has more boulevards than any city except Paris and has been called \"Paris of the Plains\""
     },
  ]
 }

 /*
  * Globals
  */
 var total_items = trivia_quiz.items.length;
 var current_index;
 var num_correct_answers = 0;
 var countdown_timer;
 var time_remaining = 0;

 //console.log("The trivia quiz has "+ total_items +" questions");


 /*******************************************************************
                  
                          FUNCTIONS

 *******************************************************************/
 /*
  * Helper function to keep the countdown timer 'ticking'
  * Once the time limit is reached, display the correct 
  * answer. The time limit is 30 seconds.
  */
function countdown_handler()
{
  time_remaining -= 1;

  $("#time-remaining").text(time_remaining);

  if(time_remaining < 1) {
    // Timed out, display the correct answer
    var correct_answer;

    clearInterval(countdown_timer); 

    correct_answer = trivia_quiz.items[current_index].answer;

    // Call evaluate_answer with user choice set to an empty string
    evaluate_answer("", correct_answer);
  }
}

/*
 * Helper function to display the next question and its options.
 */
function setup_question(index){

  // Get the radio button objects
  var radio_buttons = $("input[type='radio']");

  // This shouldn't happen. 
  // We stop the game. after the last question.  
  if(index >= total_items){
    alert("ERROR - unexpected question number"+index+
          "\n Website designer made a boo-boo");
    return;
  }

  var current_item = trivia_quiz.items[index];
  var current_question = current_item.question;
  var current_option = "";

  // Display the current question
  $("#current-question").text(current_question);
 
  // Display the options for the current question
  for(var i = 0; i < current_item.options.length;i++){
    current_option = "option"+(i+1);
    $("label[for='"+current_option+"']").text(current_item.options[i]);
  }

  $("#question-number").text(index+1);

  // No radio button should be checked by default.
  // So uncheck them all initially.
  $.each(radio_buttons , function(index, element){
    $(this).prop("checked",false);
  });

  // Re-enable the "submit answer" button
  $("#submit-answer").prop("disabled", false);

  time_remaining = 30;
  $("#time-remaining").text(time_remaining);

  // Clear out the message zone. 
  // This will get updated once the user submits an answer 
  // OR when time runs out.
  $("#message-zone").empty();

  // Start a countdown timer
  countdown_timer = setInterval(countdown_handler, 1000);
}

/*
 *  Helper function that evaluates the user selected option.
 * 
 *  This function also gets called when the countdown timer expires, 
 *  however user option in this case would be an empty string. 
 */
function evaluate_answer(user_choice, correct_answer){

  // Firstly, stop the countdown timer by clearing the interval
  clearInterval(countdown_timer);

  var more_info = trivia_quiz.items[current_index].moreInfo;

  var result_paragraph = $("<p>");
  var more_info_paragraph = $("<p>");

  // Compare user choice with correct answer
  if(user_choice === correct_answer){
    result_paragraph.text("CORRECT! The answer is "+user_choice);
    num_correct_answers += 1;
  }else {
    result_paragraph.text("Sorry, the correct answer is "+correct_answer);
  }

  more_info_paragraph.text(more_info);

  current_index += 1;

  $("#message-zone").prepend(result_paragraph);
  $("#message-zone").append(more_info_paragraph);

  if(current_index === total_items){
    //console.log("End of quiz!!");
    var summary_str = "You got "+num_correct_answers+" out of "+
                      total_items+" questions right";
    
    summary_str += "<br> <b>THANKS FOR PLAYING!</b>";
                      
    $("#submit-answer").prop("disabled",true);
    $("#message-zone").append("<p>"+summary_str+"</p>");
  } else{
    // We have more questions.
    // Disable 'submit answer' button, and show the 'next question' button.
    $("#submit-answer").prop("disabled",true);
    $("#next-question").show();
  }
}

$(document).ready(function(){
  current_index = 0;
  $("#next-question").hide();
  $("#total-questions").text(total_items);
  
  setup_question(current_index);

  /*
   *   Click handler for 'submit-answer' button. 
   *   Gets user choice and evaluates it.
   *   Evaluation and UI update is done by invoking another helper function. 
   */
  $("#submit-answer").on("click", function(event){
    var user_choice = "";
    var correct_answer = trivia_quiz.items[current_index].answer;

    var radio_buttons = $("input[type='radio']");

    console.log(radio_buttons);
  
    event.preventDefault();
  
    console.log("Submit answer clicked !!");

    // Find the radio button that was selected and get
    // its label, and eventually the label's associated text.
    $.each(radio_buttons , function(index, element){
      if ($(this).prop("checked") === true){
        var radioID = element.id;
        $("label").each(function(ind, elm){
          if ($(elm).prop("for") === radioID){
            user_choice = $(elm).text();
            console.log("User choice was "+user_choice); 
          }
        });
      }
    });

    evaluate_answer(user_choice, correct_answer);
  });

  $("#next-question").on("click",function(){
    $(this).hide();
    setup_question(current_index);
  });

});

