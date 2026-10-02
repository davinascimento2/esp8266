import React, { useState } from 'react';
import { Code2, Cpu, Check, Copy } from 'lucide-react';

export const FirmwareViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const firmwareCode = `/**
 * NodeGuard ESP8266 + RC522 RFID Access Controller
 * Author: Davi Nascimento
 */

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN  4  // D2 (GPIO4)
#define RST_PIN 5  // D1 (GPIO5)
#define RELAY_PIN 14 // D5 (GPIO14)
#define BUZZER_PIN 12 // D6 (GPIO12)

const char* ssid = "Enterprise-IoT-WLAN";
const char* password = "REDACTED";
const char* mqtt_server = "broker.hivemq.com";
const char* mqtt_topic_access = "nodeguard/lab/rfid/access";

WiFiClient espClient;
PubSubClient client(espClient);
MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect_mqtt();
  }
  client.loop();

  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return;
  }

  String uidStr = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    uidStr += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
    uidStr += String(rfid.uid.uidByte[i], HEX);
    if (i < rfid.uid.size - 1) uidStr += ":";
  }
  uidStr.toUpperCase();

  // Publish to MQTT telemetry
  client.publish(mqtt_topic_access, uidStr.c_str());

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  delay(1000);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(firmwareCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border border-zinc-800 rounded-lg p-5 bg-zinc-950">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-semibold text-zinc-100 uppercase tracking-wider">
              NodeMCU Pinout & SPI Interface Map
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded">
            <span className="text-[10px] text-zinc-500 block">RC522 SS/SDA</span>
            <span className="text-zinc-200 font-bold">GPIO 4 (D2)</span>
          </div>
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded">
            <span className="text-[10px] text-zinc-500 block">RC522 SCK</span>
            <span className="text-zinc-200 font-bold">GPIO 14 (D5)</span>
          </div>
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded">
            <span className="text-[10px] text-zinc-500 block">RC522 MOSI</span>
            <span className="text-zinc-200 font-bold">GPIO 13 (D7)</span>
          </div>
          <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded">
            <span className="text-[10px] text-zinc-500 block">DOOR RELAY</span>
            <span className="text-amber-400 font-bold">GPIO 12 (D6)</span>
          </div>
        </div>
      </div>

      {/* Code viewer */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
        <div className="bg-zinc-900/60 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>esp8266/firmware.ino (C++ Arduino)</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed bg-zinc-950">
          {firmwareCode}
        </pre>
      </div>
    </div>
  );
};
