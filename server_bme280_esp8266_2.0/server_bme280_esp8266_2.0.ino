#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>
#include <Adafruit_BME280.h>
#include <Adafruit_Sensor.h> //INCLUSÃO DE BIBLIOTECA

#include <ESPDateTime.h>

Adafruit_BME280 bmp; //OBJETO DO TIPO Adafruit_BMP280 (I2C)


#define USE_SERIAL Serial
#define LED 2

double TEMPERATURE;
double HUMIDITY;
double PRESSURE;
double ALTITUDE;

#define SERVER_IP "telemetry1.herokuapp.com"

#ifndef STASSID
#define STASSID "SSID-WIFI"
#define STAPSK  "PASSWORD-WIFI"
#endif

const char* ssid = STASSID;
const char* password = STAPSK;

ESP8266WebServer server(3001);

void setupDateTime(){
  DateTime.setTimeZone(+3);
  DateTime.begin();
  if(!DateTime.isTimeValid()){
    Serial.println("Failed to get time from server.");
  }
}

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);

}

void GetTemperature(){
 
    TEMPERATURE = bmp.readTemperature(); // chama método de leitura da classe dht,
                    
    Serial.print(F("Temperatura: ")); //IMPRIME O TEXTO NO MONITOR SERIAL
    Serial.print(TEMPERATURE); //IMPRIME NO MONITOR SERIAL A TEMPERATURA
    Serial.println(" *C (Grau Celsius)"); //IMPRIME O TEXTO NO MONITOR SERIAL

}

void GetHumidity(){  
    HUMIDITY = bmp.readHumidity(); // chama método de leitura da classe dht,
                    
    Serial.print(F("Humidity: ")); //IMPRIME O TEXTO NO MONITOR SERIAL
    Serial.print(HUMIDITY); //IMPRIME NO MONITOR SERIAL A HUMIDITY
    Serial.println(" % (Percentual)"); //IMPRIME O TEXTO NO MONITOR SERIAL
}

void GetPressure(){
    PRESSURE = bmp.readPressure();
  
    Serial.print(F("Pressão: ")); //IMPRIME O TEXTO NO MONITOR SERIAL
    Serial.print(PRESSURE); //IMPRIME NO MONITOR SERIAL A PRESSÃO
    Serial.println(" Pa (Pascal)"); //IMPRIME O TEXTO NO MONITOR SERIAL
}

void GetAltitude(){
    ALTITUDE = bmp.readAltitude(1013.25);
  
    Serial.print(F("Altitude aprox.: ")); //IMPRIME O TEXTO NO MONITOR SERIAL
    Serial.print(ALTITUDE,0); //IMPRIME NO MONITOR SERIAL A ALTITUDE APROXIMADA
    Serial.println(" m (Metros)"); //IMPRIME O TEXTO NO MONITOR SERIAL

}

int Post(){
    //WiFiClientSecure *client = new WiFiClientSecure;
    WiFiClient client;
    HTTPClient http;

    USE_SERIAL.print("[HTTP] begin...\n");
    // configure traged server and url
    http.begin(client,"http://" SERVER_IP "/telemetry/"); //HTTP
    http.addHeader("Content-Type", "application/json");
    Serial.println("http://" SERVER_IP "/telemetry/");
    USE_SERIAL.print("[HTTP] POST...\n");
    // start connection and send HTTP header and body
    

    //Encode JSON    
    //Instantiate objects        
    StaticJsonDocument<200> doc;
    JsonObject object = doc.to<JsonObject>();
    object["temperature"] = TEMPERATURE;
    object["humidity"] = HUMIDITY;
    object["pressure"] = PRESSURE;
    object["altitude"] = ALTITUDE;

    char json[300];
    
    serializeJson(doc, json);
    int httpCode = http.POST(json);
    
    // httpCode will be negative on error
    if (httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      USE_SERIAL.printf("[HTTP] POST... code: %d\n", httpCode);

      // file found at server
      if (httpCode == HTTP_CODE_OK) {
        const String& payload = http.getString();
        USE_SERIAL.println("received payload:\n<<");
        USE_SERIAL.println(payload);
        USE_SERIAL.println(">>");
      }
      
    } else {
      USE_SERIAL.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());      
    }

    http.end();
    return httpCode;
}

void handleBody() { //Handler for the body path
  if (server.method() == HTTP_GET){
    //Encode JSON    
    //Instantiate objects        
    StaticJsonDocument<200> doc;
    JsonObject object = doc.to<JsonObject>();
    object["temperature"] = TEMPERATURE;
    object["humidity"] = HUMIDITY;
    object["pressure"] = PRESSURE;
    object["altitude"] = ALTITUDE;
    object["status_led"] = !digitalRead(LED);
    char json[300];
    serializeJson(doc,json);     
    server.send(200, "text/json", json);
    Serial.println(json);
  }
  if(server.method() == HTTP_POST){
    if (server.hasArg("plain")== false){ //Check if body received
 
            server.send(200, "text/plain", "Body not received");
            return;
 
    }
 
      String message = "status:\n";
             message += server.arg("plain");
             message += "\n";
      String body = server.arg("plain");             

      StaticJsonDocument<200> doc;                
      
      deserializeJson(doc, body);
      
      const int STATUS_LED = doc["status_led"];
      const bool SAVE_DB = doc["save_db"];
      
      Serial.println("Status Led recebido: " + STATUS_LED);
      Serial.println("Comando recebido: " + SAVE_DB);
      
     if(STATUS_LED == 1){          
        digitalWrite(LED, LOW);
     }else{
        digitalWrite(LED, HIGH);
     }

     if(SAVE_DB == true){
      Post();
     }
                      
      
      server.send(200, "text/json", message);
      Serial.println(message);
  }
  
}
void setup(void) {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  WiFi.setSleepMode(WIFI_NONE_SLEEP);
  Serial.println("");

  if(!bmp.begin(0x76)){ //SE O SENSOR NÃO FOR INICIALIZADO NO ENDEREÇO I2C 0x76, FAZ
      Serial.println(F("Sensor BMP280 não foi identificado! Verifique as conexões.")); //IMPRIME O TEXTO NO MONITOR SERIAL
      while(1); //SEMPRE ENTRE NO LOOP
  }

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  
  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }
  
  server.on("/data",handleBody);

    

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");

}

void loop(void) {
  // wait for WiFi connection
  if ((WiFi.status() == WL_CONNECTED)) {
    digitalWrite(LED, HIGH);
    DateTime.begin();
    GetTemperature();
    GetHumidity();
    GetPressure();
    GetAltitude();  
    int minutes = DateTime.getParts().getMinutes();  
    int seconds = DateTime.getParts().getSeconds();
    Serial.println(minutes);
    
    if(minutes == 0){
      digitalWrite(LED, LOW);
      Serial.println("----------------------------------------Post executed--------------------------------------------------------");      
      int httpCode = Post();
      
      while(httpCode != 200){
        httpCode = Post();
      }
      //delay(30000);
      Serial.printf("Meu log: %d\n", httpCode);
    }
    digitalWrite(LED, HIGH);
    server.handleClient();
    MDNS.update();    
  }else{
    ESP.restart();
  }
  delay(1000);
}
