function getJSONByCallbacks(url, succeshandler, errorhandler){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open('GET', url, true);
        xhr.onload = function(){
            if(xhr.status == 200){

                var data = (!xhr.responseType)?JSON.parse(xhr.response):xhr.response;
                succeshandler && succeshandler(data);
                
                
                
            } else {
                errorhandler && errorhandler(`Error: ${xhr.status}`);
                

            }

        }
        xhr.onerror = function(){
            errorhandler && errorhandler("Network error");
        }

    xhr.send(null);
}

getJSONByCallbacks('https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json',
function(data){
    parkeerStats = document.querySelector('.dataContainer');
    dataId = data[0].id;
    var tempStr = '';
    // console.log(data[0]);
    // console.log(data.length);
    var dataLastSession = localStorage.getItem("Available");                               // get the data from last save
    dataLastSession = JSON.parse(dataLastSession);                                         // to parse the string as JSON
    console.log(dataLastSession);                   
    var tempArray = [];                                                                    // tempArray to store data into                                                         
    

    tempStr += `<h2 class="parkeer_lastModifiedDate">Last updated: ${data[0].parkingStatus.lastModifiedDate}</h2>`;
    for(var i = 0; i < data.length; i++){

        var numberAvailable  = data[i].parkingStatus.availableCapacity;                     // save dnumbers into var
        var numberTotal = data[i].parkingStatus.totalCapacity;
        //  console.log(numberAvailable);
        //  console.log(numberTotal);
        
        var result = Math.round((numberAvailable * 100) / numberTotal);                     // get percentage and round it
        
        
        //console.log(typeof result);
        var cssValue = result;  
        //console.log(cssValue); 

        
                                                                                            // string with a literal notation
        tempStr += `    
        
            
            <h3 class="parkeer-adress">Address: ${data[i].address}</h3>
            
            <h3 class="parkeer_available">Available spots: ${data[i].parkingStatus.availableCapacity}</h3>
            
            
            
            <h3 class="parkeer_capacity">Total capacity: ${data[i].parkingStatus.totalCapacity}</h3>
        
        `;
        if (cssValue > 50){                                                                 // if the % availableCapacity is > 50, add and create the following elements thhrought tempStr. Set the width property to the %.
            tempStr += ` <div id="myProgress"><div class="myBarGreen" style="width:${cssValue}%">${cssValue}%</div></div> <br>  `;
            //console.log("groen");
        } else if (cssValue >= 20 || cssValue <= 50) {
            //console.log('orange');
            tempStr +=  `<div id="myProgress"><div class="myBarOrange" style="width:${cssValue}%">${cssValue}%</div></div> <br>  `;
        }else if (cssValue < 20 ) {
            tempStr += ` <div id="myProgress"><div class="myBarRed" style="width:${cssValue}%">${cssValue}%</div></div> <br>  `;
            //console.log('rood');
        }
        
        tempArray.push(data[i].parkingStatus.availableCapacity);                           // push data into tempArray            
        localStorage.setItem("Available", JSON.stringify(tempArray));                      // to convert value to a JSON string
        
        

       
        if (dataLastSession[i] < tempArray[i]){                                             // if data(availablespots) from last save is < than now, create the following elements.
            tempStr += `<div id="statusChange"><i class="fa fa-chevron-circle-up" aria-hidden="true"></i></div> <br> `;
            console.log('hi');
            
        } else if (tempArray[i] == dataLastSession[i]) {
            tempStr += `<div id="statusChange"><i class="fa fa-circle" aria-hidden="true"></i></div> <br> `;
            
        } else {
            tempStr += `<div id="statusChange"><i class="fa fa-chevron-circle-down" aria-hidden="true"></i></div> <br> `;
            
        }

    }    
    console.log(tempArray);
 
   
    
       
       
        
    
    parkeerStats.innerHTML = tempStr;
   



    

       
},

function(error){
    console.log(error);

}
)