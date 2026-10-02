export interface RfidTag {
  uid: string;
  userName: string;
  department: string;
  role: 'Admin' | 'Engineer' | 'Staff' | 'Guest';
  status: 'Active' | 'Revoked';
  registeredAt: string;
  lastAccessAt?: string;
}

export interface AccessLog {
  id: string;
  timestamp: string;
  tagUid: string;
  userName: string;
  accessResult: 'GRANTED' | 'DENIED_REVOKED' | 'DENIED_UNREGISTERED';
  doorRelayDurationMs: number;
  signalRssi: number;
}

export interface Esp8266HardwareState {
  wifiConnected: boolean;
  ssid: string;
  ip: string;
  mac: string;
  rssi: number;
  mqttConnected: boolean;
  mqttBroker: string;
  mqttTopic: string;
  relayOpen: boolean;
  ledPinState: boolean;
  freeHeapKb: number;
  uptimeSeconds: number;
}
