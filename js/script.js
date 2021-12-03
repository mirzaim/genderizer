// waits to load html structure.
window.addEventListener( "load", function () {
    const form = document.getElementById("req_form");

    // get lowercased name from form
    function get_name_input(){
        return form.name.value.toLowerCase();
    }

    // show loading gif
    function loading(){
        document.getElementById("status").querySelector("span").hidden = true;
        document.getElementById("status").querySelector("img").hidden = false;
        document.getElementById("status").querySelector("span").innerHTML = "";
    }

    // hide loading gif and display a message to user.
    function message_user(message){
        document.getElementById("status").querySelector("img").hidden = true;
        document.getElementById("status").querySelector("span").hidden = false;
        document.getElementById("status").querySelector("span").innerHTML = message;
    }

    // update prediction results.
    function set_prediction_results(gender, prob){
        document.getElementById("gender_result").innerHTML = gender;
        document.getElementById("probability_result").innerHTML = prob;
    }

    // loads saved results from Local Storage.
    function load_saved_result(key){
        if (localStorage.getItem(key)){
            document.getElementById("saved_ans").querySelector("span").innerHTML = localStorage.getItem(key);
            document.getElementById("saved_ans").style.visibility = "visible";
        } else {
            document.getElementById("saved_ans").style.visibility = "hidden";
            document.getElementById("saved_ans").querySelector("span").innerHTML = "";
        }    
    }

    // event listener for submit button.
    form.addEventListener("submit", function(event){
        // disable default behavior.
        event.preventDefault();
        
        const XHR = new XMLHttpRequest();

        // event listener for http success response.
        XHR.addEventListener("load", function(event) {
            let response = JSON.parse(event.target.responseText);
            // check if there is a prediction for specified name.
            if (response.gender){
                message_user("");
                set_prediction_results(response.gender, response.probability);
            } else{
                message_user("No prediction for " + get_name_input());
                set_prediction_results("?", "?");
            }
            // load saved result for input name.
            load_saved_result(get_name_input());
        });

        // event listener for when http req. fails.
        XHR.addEventListener("error", function(event) {
            set_prediction_results("", "");
            message_user(event.type);
            load_saved_result(get_name_input());
        });

        XHR.open("GET", "https://api.genderize.io/?name=" + get_name_input());

        // turn on loading status and send a request.
        loading();
        XHR.send();
    });

    // event listener for save button.
    // if every thing is OK, then save the name and its gender to local storage.
    document.getElementById("save_bt").addEventListener("click", function(event){
        let gender = form.querySelector('input[name="gender"]:checked').value;
        if (get_name_input() && gender){
            localStorage.setItem(get_name_input(), gender);
            message_user("Saved.");
        }
        load_saved_result(get_name_input());
    });

    // event listener for clear button.
    // if the name present if local storage then delete it.
    document.getElementById("clear_bt").addEventListener("click", function(event){
        if (localStorage.getItem(get_name_input())){
            localStorage.removeItem(get_name_input());
            message_user("Cleared.");
        }
        load_saved_result(get_name_input());
    });
});