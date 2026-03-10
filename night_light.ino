// These constants won't change. They're used to give names to the pins used:
// -----Inputs-----
const int potPin = A0;      //poteniometer
const int lightPin = A2;    //photoresistor

// -----Outputs (LED Pins, PWM)-----
const int redLED = 3;
const int blueLED = 5;
const int yellowLED = 6;

void setup() {
  Serial.begin(9600);
  pinMode(redLED, OUTPUT);
  pinMode(blueLED, OUTPUT);
  pinMode(yellowLED, OUTPUT);
}

void loop() {

  int potValue = analogRead(potPin);      // 0-1023
  int lightValue = analogRead(lightPin);  // 0-1023

  // Convert pot to brightness scale
  int maxBrightness = map(potValue, 0, 1023, 0, 255);

  int brightLight = 150;   // lowest reading (bright)
  int darkLight   = 420;   // highest reading (dark) — adjust after testing

  int darkLevel = map(lightValue, brightLight, darkLight, 0, 255);
  darkLevel = constrain(darkLevel, 0, 255);

  int redVal = 0;
  int blueVal = 0;
  int yellowVal = 0;

  // Mood zones
  if (darkLevel < 80) {
    // Bright room → all off
  }
  else if (darkLevel < 160) {
    blueVal = maxBrightness;
  }
  else if (darkLevel < 220) {
    blueVal = maxBrightness;
    redVal = maxBrightness / 2;
  }
  else {
    redVal = maxBrightness;
    blueVal = maxBrightness;
    yellowVal = maxBrightness;
  }

  analogWrite(redLED, redVal);
  analogWrite(blueLED, blueVal);
  analogWrite(yellowLED, yellowVal);

  // Send to OpenProcessing
  Serial.print(darkLevel);
  Serial.print(",");
  Serial.println(maxBrightness);
  delay(30);

}
