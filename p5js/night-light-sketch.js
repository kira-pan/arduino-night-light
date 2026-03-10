// A button for setting up Web Serial using serial.js !
// This sketch adapts the basic web serial template for p5.js from:
// https://makeabilitylab.github.io/physcomp/communication/p5js-serial
// 
// HELLO! PLS READ ME!!!! :D 
//
// STEP 1/4: 
// Copy Line 12 in this index.html file to YOUR index.html file!!
// (the 3rd file tab that you can access using the toolbar above)
// (if ur also using openprocessing, you need to enable HTML/CSS/JS mode using the right sidebar. )
// 
// uses code created by Jon E. Froehlich
// @jonfroehlich
// http://makeabilitylab.io/
// 
// prepared with love by shm for DESINV23
//

//-- Step 2/4: Copy these 3 lines to the top of your file! -- //
let serialOptions = { baudRate: 9600  };
let serial;
let receivedData;
let darkLevel = 0;
let maxBrightness = 0;
let stars = [];
let starCount = 80;
// ------------------------//

function setup() {
  createCanvas(windowWidth, windowHeight);
	textSize(24); // text size
	fill(255); //white text
	colorMode(HSB, 360, 100, 100, 100);
for (let i = 0; i < starCount; i++) {
  stars.push({
    x: random(width),
    y: random(height),
    size: random(1.5, 3.5),
    phase: random(TWO_PI),
    speed: random(0.02, 0.06)
  });
}	

	
	// ----- Step 3/4: COPY EVERYTHING HERE INTO YOUR SETUP FUNCTION ----//
  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

  // If we have previously approved ports, attempt to connect with them
  // serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions); // I have this commented out, as it sometimes causes issues! but you can try turning it on.
	
	// this creates the button. you could optionally use something else
	// to call the connect() function and start the connection! 
  button = createButton('Click me to connect to your Arduino!');
  button.position(0, 0);
  button.mousePressed(connect);
	
	// ------------------------------------------------------------------ //
}

function draw() {

  // --- Background ---
  // darkLevel: 0 (bright room) → 255 (dark room)
  // So invert for background brightness
  let bgBrightness = map(darkLevel, 0, 255, 100, 5);
  background(210, 20, bgBrightness); // soft blue tone

  // Draw stars when it gets dark
  if (darkLevel > 120) {
  for (let s of stars) {

    let twinkle = map(
      sin(frameCount * s.speed + s.phase),
      -1,
      1,
      20,
      100
    );

    noStroke();

    // brighter white stars with more visible alpha change
    fill(0, 0, 100, twinkle);

    circle(s.x, s.y, s.size);
  }
}
	
  // --- Pot controls saturation ---
  let saturation = map(maxBrightness, 0, 255, 0, 100);

  // --- Orb color based on same mood zones as Arduino ---
  let hue;
  let value = 100; // brightness of orb

  if (darkLevel < 80) {
    // bright room → orb faint
    hue = 0;
    saturation = 0;
    value = 20;
  }
  else if (darkLevel < 160) {
    // blue zone
    hue = 210;
  }
  else if (darkLevel < 220) {
    // purple zone
    hue = 280;
  }
  else {
    // warm yellow zone
    hue = 45;
  }

  // --- Orb size reacts to potentiometer (saturation) ---
  let orbSize = map(maxBrightness, 0, 255, 60, min(width, height) * 0.6);

  noStroke();

  // glow halo
  fill(hue, saturation, value, 20);
  circle(width / 2, height / 2, orbSize * 1.3);

  // main orb
  fill(hue, saturation, value, 90);
  circle(width / 2, height / 2, orbSize);

  // --- Debug text ---
  fill(0, 0, 100);
  textSize(18);
  text("darkLevel: " + darkLevel, 30, 40);
  text("saturation (pot): " + Math.round(saturation), 30, 70);
}


// -----Step 4/4: COPY EVERYTHING BELOW TO THE BOTTOM OF YOUR FILE! ----//
/**
 * Callback function by serial.js when there is an error on web serial
 * 
 * @param {} eventSender 
 */
 function onSerialErrorOccurred(eventSender, error) {
  console.log("onSerialErrorOccurred", error);
}

/**
 * Callback function by serial.js when web serial connection is opened
 * 
 * @param {} eventSender 
 */
function onSerialConnectionOpened(eventSender) {
  console.log("onSerialConnectionOpened");
}

/**
 * Callback function by serial.js when web serial connection is closed
 * 
 * @param {} eventSender 
 */
function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");
}

/**
 * Callback function serial.js when new web serial data is received
 * 
 * @param {*} eventSender 
 * @param {String} newData new data received over serial
 */
function onSerialDataReceived(eventSender, newData) {
  let s = String(newData).trim();
  if (s.length === 0) return;

  let parts = s.split(",");
  if (parts.length >= 2) {
    let d = Number(parts[0]);
    let b = Number(parts[1]);

    if (!Number.isNaN(d)) darkLevel = d;
    if (!Number.isNaN(b)) maxBrightness = b;

    receivedData = s; // optional: keep displaying the raw line
  }
}



function onSerialConnectionClosed(eventSender) {
  console.log("onSerialConnectionClosed");
  portName = "Not connected";
}


/**
 * Called by the browser when our special button is clicked
 */
function connect() {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null, serialOptions);
  }
}