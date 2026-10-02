# 🛡️ NodeGuard — ESP8266 IoT RFID Access Control & Telemetry Suite

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-emerald?logo=vercel)](https://nodeguard-toadbigode.vercel.app)
[![ESP8266](https://img.shields.io/badge/ESP8266-NodeMCU-orange?logo=espressif)](https://www.espressif.com/)
[![React 18](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![MQTT](https://img.shields.io/badge/MQTT-HiveMQ-purple?logo=mqtt)](https://mqtt.org/)

> **NodeGuard** is an IoT access control platform combining an ESP8266 NodeMCU microcontroller, RC522 13.56MHz RFID reader, and MQTT telemetry broker with an interactive virtual hardware testbed and real-time audit log stream.

---

## ✨ Features

- **💳 Virtual RFID Reader & Card Scanner**: Test tap-to-authenticate workflows with synthesized hardware buzzer audio and door lock solenoid actuation.
- **📡 Real-Time Telemetry Matrix**: Monitor WiFi RSSI, MAC/IP network configurations, heap memory utilization, and uptime.
- **📜 Live Audit Log Stream**: Timestamped access event logs with status tags (`GRANTED`, `DENIED_REVOKED`, `DENIED_UNREGISTERED`) and CSV export.
- **🔑 RFID Credentials Manager**: Provision and revoke keycards with role-based access control (Admin, Engineer, Staff, Guest).
- **⚙️ Complete Arduino C++ Firmware**: `esp8266/firmware.ino` included with SPI bus wiring mappings.

---

## 🚀 Live Demo

Experience NodeGuard directly in your browser:
👉 **[https://nodeguard-toadbigode.vercel.app](https://nodeguard-toadbigode.vercel.app)**

---

## 🛠️ Local Development

```bash
# Clone repository
git clone https://github.com/davinascimento2/esp8266.git

# Navigate into project
cd esp8266

# Install web dependencies
npm install

# Run Vite development server
npm run dev
```

---

## 👤 Author

Developed by **[Davi Nascimento](https://github.com/davinascimento2)**
Portfolio: [career-command-center-toadbigode.vercel.app](https://career-command-center-toadbigode.vercel.app)
