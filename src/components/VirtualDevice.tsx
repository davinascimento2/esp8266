import React, { useState } from 'react';
import { Esp8266HardwareState, RfidTag } from '../types';
import { CreditCard, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { buzzer } from '../utils/audio';

interface VirtualDeviceProps {
  hardware: Esp8266HardwareState;
  tags: RfidTag[];
  onScanTag: (uid: string) => void;
  onToggleRelay: () => void;
}

export const VirtualDevice: React.FC<VirtualDeviceProps> = ({
  hardware,
  tags,
  onScanTag,
  onToggleRelay,
}) => {
  const [customUid, setCustomUid] = useState('');
  const [lastScanResult, setLastScanResult] = useState<{
    uid: string;
    granted: boolean;
    name: string;
  } | null>(null);

  const handleQuickScan = (uid: string) => {
    const found = tags.find(t => t.uid.toLowerCase() === uid.toLowerCase());
    const granted = found ? found.status === 'Active' : false;

    if (granted) {
      buzzer.playGrantBeep();
      buzzer.playRelayClick();
    } else {
      buzzer.playDenyBeep();
    }

    setLastScanResult({
      uid,
      granted,
      name: found ? found.userName : 'Unknown Keycard'
    });

    onScanTag(uid);

    setTimeout(() => {
      setLastScanResult(null);
    }, 4000);
  };

  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUid.trim()) return;
    handleQuickScan(customUid.trim());
    setCustomUid('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Interactive Hardware Visualizer */}
      <div className="lg:col-span-6 space-y-4">
        <div className="border border-zinc-800 rounded-lg bg-zinc-950 p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider">
              NodeMCU & RC522 Interface
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              SPI Bus Connected
            </span>
          </div>

          {/* Interactive RFID Reader Zone */}
          <div className="border border-zinc-800 rounded-md p-6 bg-zinc-900/30 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full border-2 border-zinc-700 bg-zinc-900 mx-auto flex items-center justify-center text-zinc-400 mb-3">
              <CreditCard className="w-7 h-7" />
            </div>

            <h4 className="text-sm font-semibold text-zinc-100">RC522 13.56MHz Contactless Reader</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              Tap any pre-registered physical badge or type a hex UID to simulate hardware scan interrupt.
            </p>

            {/* Scan Outcome Banner */}
            {lastScanResult && (
              <div
                className={`mt-4 p-3 rounded border text-xs font-mono flex items-center justify-center gap-2 ${
                  lastScanResult.granted
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                }`}
              >
                {lastScanResult.granted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ACCESS GRANTED • {lastScanResult.name} ({lastScanResult.uid})</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>ACCESS DENIED • {lastScanResult.name} ({lastScanResult.uid})</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Quick Badges to Click */}
          <div>
            <span className="text-[11px] font-mono text-zinc-400 block mb-2">Simulated Badges (Click to Tap):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tags.map((t) => (
                <button
                  key={t.uid}
                  onClick={() => handleQuickScan(t.uid)}
                  className="p-2.5 rounded border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60 text-left transition-colors flex items-center justify-between group"
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-medium text-zinc-200 truncate">{t.userName}</p>
                    <p className="text-[10px] font-mono text-zinc-400">{t.uid}</p>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    t.status === 'Active' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-rose-950 text-rose-300 border-rose-800'
                  }`}>
                    {t.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual UID Input */}
          <form onSubmit={handleManualScan} className="flex gap-2 pt-2 border-t border-zinc-800">
            <input
              type="text"
              value={customUid}
              onChange={(e) => setCustomUid(e.target.value)}
              placeholder="e.g. AA:BB:CC:DD (Manual UID)"
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs font-mono transition-colors"
            >
              Test Scan
            </button>
          </form>
        </div>
      </div>

      {/* Right: ESP8266 Live Telemetry & GPIO Actuation */}
      <div className="lg:col-span-6 space-y-4">
        <div className="border border-zinc-800 rounded-lg bg-zinc-950 p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider">
              Telemetry & GPIO Matrix
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">NodeMCU ESP8266</span>
          </div>

          {/* Telemetry Matrix Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block">IP ADDRESS</span>
              <span className="text-zinc-200 font-semibold">{hardware.ip}</span>
            </div>

            <div className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block">MAC ADDRESS</span>
              <span className="text-zinc-200 font-semibold">{hardware.mac}</span>
            </div>

            <div className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block">FREE HEAP MEM</span>
              <span className="text-emerald-400 font-semibold">{hardware.freeHeapKb} KB</span>
            </div>

            <div className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block">WLAN SSID</span>
              <span className="text-zinc-200 truncate block">{hardware.ssid}</span>
            </div>

            <div className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block">MQTT BROKER</span>
              <span className="text-cyan-300 truncate block">{hardware.mqttBroker}</span>
            </div>

            <div className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] block">SIGNAL (RSSI)</span>
              <span className="text-amber-400 font-semibold">{hardware.rssi} dBm</span>
            </div>
          </div>

          {/* Solenoid Door Relay State */}
          <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/20 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Door Lock Solenoid (GPIO D1 / Relay)</span>
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Status: {hardware.relayOpen ? <strong className="text-emerald-400 font-mono">ENERGIZED / UNLOCKED (3000ms pulse)</strong> : <span className="text-zinc-500 font-mono">LOCKED</span>}
              </p>
            </div>

            <button
              onClick={() => {
                buzzer.playRelayClick();
                onToggleRelay();
              }}
              className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition-colors ${
                hardware.relayOpen
                  ? 'bg-rose-500 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              {hardware.relayOpen ? 'Force Lock' : 'Trigger Relay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
