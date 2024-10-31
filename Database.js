//This is our database class
//This class will be run after the server started
//It will connect to mongodb database server


var mongoose = require("mongoose");
const reader = require('xlsx');
const User = require('../Models/UserSchema');
const Articles = require('../Models/ArticlesSchema');
mongoose.connect("mongodb://localhost/UserDetails");

let AllCurrentRatedResearchers = [];
let AICurrentRatedResearchers = [];

let WebofScieneData=[];

// Reading the file from NRF and web of science

const file = reader.readFile("documents/ResearcherData.xlsx");
const file2 = reader.readFile("documents/AIResearchers.xlsx");

// This is a method that is going to read NRF raw data
function ReadExcelFileFromNRF(){
    
    const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[0]], {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: false})
    temp.forEach((res) => {
        AllCurrentRatedResearchers.push(res);
    })
}
ReadExcelFileFromNRF();

//This method will read Web of Science raw data
function ReadExcelFileWebofScience(){
    
    const temp = reader.utils.sheet_to_json(
            file2.Sheets[file2.SheetNames[2]], {dateNF:'mm/dd/yyyy;@',cellDates:true, raw: false})
    temp.forEach((res) => {
        WebofScieneData.push(res);
    })
}
ReadExcelFileWebofScience();


//This method is for filtering The data from NRF by Artificial Intelligence Researchers
// The Method is going to return the clean data 
function filterDatabyAIresearch(data){
    countAIresearchers = 0;
    AIData = [];
    AI_PrimaryResearch_Fields = [];
    AI_ResearchersInsititution = [];
    for(let j = 0; j< data.length;j++){

        let combineSentence = data[j]['Primary Research Fields']+" "+data[j]['Secondary Research Fields']+" "+data[j]['Specialisations'];
        let keyWords = ["machine learning","intelligence","neural network","deep Learning","optimization","laguage process","computer vision","reinforcement","expert","robot", "internet of things"];
        
        for(let k = 0; k< keyWords.length;k++){

            let position1 = (combineSentence.toLowerCase()).search(keyWords[k]);
            
            if(position1!==-1){
                countAIresearchers++;
                AICurrentRatedResearchers.push(data[j]);
                tempArray = (data[j]['Primary Research Fields']).split(";");
                tempInstitution = data[j]['Institution'];
                for(let i = 0; i< tempArray.length;i++){
                    if (!AI_PrimaryResearch_Fields.includes(tempArray[i].trim())) {
                        
                        AI_PrimaryResearch_Fields.push(tempArray[i].trim());
                      }
                }
                if (!AI_ResearchersInsititution.includes(tempInstitution.trim())) {
                        
                    AI_ResearchersInsititution.push(tempInstitution.trim());
                  }

                break;
            }
            
        }
    }
    console.log("The number of AI researchers "+countAIresearchers);

}
filterDatabyAIresearch(AllCurrentRatedResearchers);
//console.log(WebofScieneData);

function sendDataToDataase(data,ArticleData){

     for(let k = 0; k< data.length;k++){
        for(let j = 0; j< WebofScieneData.length;j++){
            // console.log(WebofScieneData[j]['Name']);
            SurnameInitials = data[k]['Surname']+", "+data[k]['Initials'];
            //console.log(AICurrentRatedResearchers[j]['Surname'])
            if(SurnameInitials===WebofScieneData[j]['Name']){
                
            }
        }

     }
    User.insertMany(data,function(err,users){
        if(err){
            console.log(err);
        }
    });

    Articles.insertMany(ArticleData,function(err,users){
        if(err){
            console.log(err);
        }
    });
    
    
 }

//print all the researcher details from the data base
function retrieveInfo(){
    User.find({},function(err,users){
        if(err){
            //console.log("erroooor");
            //console.log(err);
        }
        else{
            // const ws = reader.utils.json_to_sheet(AICurrentRatedResearchers);
            // reader.utils.book_append_sheet(file,ws,"Sheet1");
            // reader.writeFile(file,"documents/ResearcherData.xlsx");

        }
    });
}

//Sending data to database and rectrieve it back
setTimeout(()=>{
    // console.log(AICurrentRatedResearchers);
    sendDataToDataase(AICurrentRatedResearchers,WebofScieneData);
    setTimeout(()=>{
        retrieveInfo();
    })
},2000);