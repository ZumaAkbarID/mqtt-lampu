#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Biji Bona dan Cimit";
const char* password = "akusayangkamu";

const char* mqtt_server = "test.mosquitto.org";
const char* TOPIC_LED = "HALO_DEK";

WiFiClient espClient;
PubSubClient client(espClient);

const int LED_PIN = D1;
bool lastState = HIGH;

void setup_wifi() {
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");
    String clientId = "esp8266-client-";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str())) {
      Serial.println("Connected to MQTT broker");
      client.subscribe(TOPIC_LED);
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  payload[length] = '\0';
  String message = String((char*)payload);

  Serial.print("Message received on topic: ");
  Serial.println(topic);
  Serial.print("Payload: ");
  Serial.println(message);

  if (message == "OFF") {
    digitalWrite(LED_PIN, HIGH);
    if (lastState == LOW) {
      Serial.println("LED turned OFF");
      lastState = HIGH;
    }
  } else if (message == "ON") {
    digitalWrite(LED_PIN, LOW);
    if (lastState == HIGH) {
      Serial.println("LED turned ON");
      lastState = LOW;
    }
  } else {
    Serial.println("Invalid payload, ignored.");
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}