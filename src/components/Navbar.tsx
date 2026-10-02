import React from 'react';
import { Cpu, Wifi, Radio, Lock, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { Esp8266HardwareState } from '../types';
import { buzzer } from '../utils/audio';

interface NavbarProps {
  hardware: Esp8266HardwareState;
  activeTab: 'simulator' | 'logs' | 'tags' | 'firmware';
  setActiveTab: (tab: 'simulator' | 'logs' | 'tags' | 'firmware') => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hardware,
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted
}) => {
  const toggleAudio = () => {
    buzzer.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  const navItems = [
    { id: 'simulator', label: 'Device Telemetry & Scanner', icon: Cpu },
    { id: 'logs', label: 'Access Audit Logs', icon: ShieldCheck },
    { id: 'tags', label: 'RFID Credentials', icon: Lock },
    { id: 'firmware', label: 'C++ Firmware & Pinout', icon: Radio },
  ] as const;

  const formatUptime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
      {/* Brand & Telemetry Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold text-xs">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs text-zinc-100 tracking-tight">NodeGuard</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            ESP8266-12E
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-zinc-800 text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <Wifi className="w-3 h-3" /> {hardware.rssi} dBm
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-zinc-300">
            <Radio className="w-3 h-3 text-cyan-400" /> MQTT Active
          </span>
          <span>•</span>
          <span>Up: {formatUptime(hardware.uptimeSeconds)}</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <nav className="flex items-center gap-1 bg-zinc-900 p-1 rounded-md border border-zinc-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Audio Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleAudio}
          className="p-1.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-100"
          title={isMuted ? 'Unmute hardware buzzer' : 'Mute buzzer'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>
    </header>
  );
};
