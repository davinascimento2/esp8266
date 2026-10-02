import { RfidTag, AccessLog, Esp8266HardwareState } from '../types';

export const INITIAL_HARDWARE_STATE: Esp8266HardwareState = {
  wifiConnected: true,
  ssid: 'Enterprise-IoT-WLAN',
  ip: '192.168.1.188',
  mac: '5C:CF:7F:1B:42:0A',
  rssi: -58,
  mqttConnected: true,
  mqttBroker: 'broker.hivemq.com:1883',
  mqttTopic: 'nodeguard/lab/rfid/access',
  relayOpen: false,
  ledPinState: false,
  freeHeapKb: 43.8,
  uptimeSeconds: 14820
};

export const INITIAL_TAGS: RfidTag[] = [
  {
    uid: 'E4:A1:09:82',
    userName: 'Davi Nascimento',
    department: 'Core Architecture',
    role: 'Admin',
    status: 'Active',
    registeredAt: '2026-01-15 10:00:00',
    lastAccessAt: '2026-10-01 21:10:45'
  },
  {
    uid: '7F:2B:4C:11',
    userName: 'Elena Rostova',
    department: 'Firmware Engineering',
    role: 'Engineer',
    status: 'Active',
    registeredAt: '2026-02-01 14:30:00',
    lastAccessAt: '2026-10-01 19:42:10'
  },
  {
    uid: '9D:18:6E:33',
    userName: 'Marcus Vance',
    department: 'Operations',
    role: 'Staff',
    status: 'Revoked',
    registeredAt: '2026-03-10 09:15:00',
    lastAccessAt: '2026-09-28 17:05:22'
  },
  {
    uid: 'B2:5C:88:90',
    userName: 'Guest Badge #04',
    department: 'External Audit',
    role: 'Guest',
    status: 'Active',
    registeredAt: '2026-10-01 08:00:00',
    lastAccessAt: '2026-10-01 14:15:30'
  }
];

export const INITIAL_LOGS: AccessLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-01 21:10:45',
    tagUid: 'E4:A1:09:82',
    userName: 'Davi Nascimento',
    accessResult: 'GRANTED',
    doorRelayDurationMs: 3000,
    signalRssi: -58
  },
  {
    id: 'log-2',
    timestamp: '2026-10-01 19:42:10',
    tagUid: '7F:2B:4C:11',
    userName: 'Elena Rostova',
    accessResult: 'GRANTED',
    doorRelayDurationMs: 3000,
    signalRssi: -60
  },
  {
    id: 'log-3',
    timestamp: '2026-10-01 18:22:04',
    tagUid: '9D:18:6E:33',
    userName: 'Marcus Vance',
    accessResult: 'DENIED_REVOKED',
    doorRelayDurationMs: 0,
    signalRssi: -59
  },
  {
    id: 'log-4',
    timestamp: '2026-10-01 16:05:18',
    tagUid: '44:C9:10:FE',
    userName: 'Unknown Keycard',
    accessResult: 'DENIED_UNREGISTERED',
    doorRelayDurationMs: 0,
    signalRssi: -62
  }
];
