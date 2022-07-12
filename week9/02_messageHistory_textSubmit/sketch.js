

let dataServer;
let pubKey = "pub-c-8023b38b-b78d-4dc5-80cb-ea56808e1983";
let subKey = "sub-c-1c02ba5e-e002-4851-9f24-cb7062034440";
let secretKey = "sec-c-Y2FjZjRmMTktMzdmYS00ZjY5LTk1Y2EtMWJhYzI3MmY3YjEz";

let channelName = "history";

let you;

//input variables for the form to PubNub
var sendText;
var sendButton;

let history;

function preload() { 

  // logic to create a random UUID
    you = random(0,1000000); 
    console.log(you);
    you = int(you);
    console.log(you);
    you = you.toString();
  
}


function setup() {

    createCanvas(windowWidth, windowHeight);

    dataServer = new PubNub({
      subscribeKey: subKey,
      publishKey: pubKey,
      uuid: you,
      secretKey: secretKey,
      heartbeatInterval: 0,
    });

     // listen for messages coming through the subcription feed on this specific channel. 

    dataServer.subscribe({ channels: [channelName] });
    dataServer.addListener({ message: readIncoming });
   
  
    textAlign(CENTER);
  
    //create the text fields for the message to be sent
    sendText = createInput();
    sendText.position((windowWidth/2) - 100, windowHeight *0.8);
  
    sendButton = createButton("Send a message");
    sendButton.position(sendText.x + sendText.width, windowHeight * 0.8);
    sendButton.mousePressed(sendTheMessage);

    fetchMessages();

}
  
function draw() {
 


}


function fetchMessages() {
console.log("fetching");

  dataServer.fetchMessages(
    {
        channels: [channelName],
        end: '15343325004275466',
        count: 100
    },
    (status, response) => {
    // console.log(response.channels.history);
      drawMessages(response.channels.history);
    }
  );
   
}

function drawMessages(messageHistory) {

  console.log("in draw messages");

  console.log(messageHistory);
  textSize(80);
  for (let i = 0; i < messageHistory.length; i++) {
    
      console.log(messageHistory[i]);
      text(messageHistory[i].message.messageText, windowWidth/2, 100 * (i+1));

  }

}
  // PubNub logic below
function sendTheMessage() {
  // Send Data to the server to draw it in all other canvases
  dataServer.publish({
    channel: channelName,
    message: {
      messageText: sendText.value()
    },
  });

  sendText.value("");

}

function readIncoming(inMessage) {
  console.log(inMessage);
  fetchMessages();

}
