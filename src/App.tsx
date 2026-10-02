import { useState, useEffect } from 'react';
import { Esp8266HardwareState, RfidTag, AccessLog } from './types';
import { INITIAL_HARDWARE_STATE, INITIAL_TAGS, INITIAL_LOGS } from './data/defaultData';
import { Navbar } from './components/Navbar';
import { VirtualDevice } from './components/VirtualDevice';
import { LogsStream } from './components/LogsStream';
import { TagManager } from './components/TagManager';
import { FirmwareViewer } from './components/FirmwareViewer';

export function App() {
  const [hardware, setHardware] = useState<Esp8266HardwareState>(INITIAL_HARDWARE_STATE);
  const [tags, setTags] = useState<RfidTag[]>(() => {
    const saved = localStorage.getItem('nodeguard_tags');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TAGS;
      }
    }
    return INITIAL_TAGS;
  });

  const [logs, setLogs] = useState<AccessLog[]>(() => {
    const saved = localStorage.getItem('nodeguard_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_LOGS;
      }
    }
    return INITIAL_LOGS;
  });

  const [activeTab, setActiveTab] = useState<'simulator' | 'logs' | 'tags' | 'firmware'>('simulator');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    localStorage.setItem('nodeguard_tags', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem('nodeguard_logs', JSON.stringify(logs));
  }, [logs]);

  // Periodic uptime increment
  useEffect(() => {
    const interval = setInterval(() => {
      setHardware(prev => ({
        ...prev,
        uptimeSeconds: prev.uptimeSeconds + 1
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScanTag = (uid: string) => {
    const foundTag = tags.find(t => t.uid.toLowerCase() === uid.toLowerCase());
    const isGranted = foundTag ? foundTag.status === 'Active' : false;

    const newLog: AccessLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      tagUid: uid,
      userName: foundTag ? foundTag.userName : 'Unknown Keycard',
      accessResult: isGranted ? 'GRANTED' : foundTag ? 'DENIED_REVOKED' : 'DENIED_UNREGISTERED',
      doorRelayDurationMs: isGranted ? 3000 : 0,
      signalRssi: Math.floor(Math.random() * 10) - 65
    };

    setLogs(prev => [newLog, ...prev]);

    if (isGranted) {
      // Actuate door relay for 3 seconds
      setHardware(prev => ({ ...prev, relayOpen: true }));
      setTimeout(() => {
        setHardware(prev => ({ ...prev, relayOpen: false }));
      }, 3000);

      // Update tag lastAccessAt
      if (foundTag) {
        setTags(prev => prev.map(t => t.uid === foundTag.uid ? {
          ...t,
          lastAccessAt: newLog.timestamp
        } : t));
      }
    }
  };

  const handleToggleRelay = () => {
    setHardware(prev => ({
      ...prev,
      relayOpen: !prev.relayOpen
    }));
  };

  const handleAddTag = (newTag: RfidTag) => {
    setTags(prev => [newTag, ...prev]);
  };

  const handleToggleStatus = (uid: string) => {
    setTags(prev => prev.map(t => t.uid === uid ? {
      ...t,
      status: t.status === 'Active' ? 'Revoked' : 'Active'
    } : t));
  };

  const handleDeleteTag = (uid: string) => {
    setTags(prev => prev.filter(t => t.uid !== uid));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-100 selection:text-zinc-950">
      {/* Top Navbar */}
      <Navbar
        hardware={hardware}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {activeTab === 'simulator' && (
          <VirtualDevice
            hardware={hardware}
            tags={tags}
            onScanTag={handleScanTag}
            onToggleRelay={handleToggleRelay}
          />
        )}

        {activeTab === 'logs' && <LogsStream logs={logs} />}

        {activeTab === 'tags' && (
          <TagManager
            tags={tags}
            onAddTag={handleAddTag}
            onToggleStatus={handleToggleStatus}
            onDeleteTag={handleDeleteTag}
          />
        )}

        {activeTab === 'firmware' && <FirmwareViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>NodeGuard • ESP8266 IoT RFID Telemetry Suite</span>
          <span>Crafted by <a href="https://github.com/davinascimento2" target="_blank" rel="noreferrer" className="text-zinc-300 hover:underline">Davi Nascimento</a></span>
        </div>
      </footer>
    </div>
  );
}

export default App;
