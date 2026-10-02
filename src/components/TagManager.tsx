import React, { useState } from 'react';
import { RfidTag } from '../types';
import { Plus, Trash2, KeyRound } from 'lucide-react';

interface TagManagerProps {
  tags: RfidTag[];
  onAddTag: (tag: RfidTag) => void;
  onToggleStatus: (uid: string) => void;
  onDeleteTag: (uid: string) => void;
}

export const TagManager: React.FC<TagManagerProps> = ({
  tags,
  onAddTag,
  onToggleStatus,
  onDeleteTag,
}) => {
  const [newUid, setNewUid] = useState('');
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'Engineer' | 'Staff' | 'Guest'>('Staff');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUid.trim() || !newName.trim()) return;

    onAddTag({
      uid: newUid.trim().toUpperCase(),
      userName: newName.trim(),
      department: newDept.trim() || 'General Operations',
      role: newRole,
      status: 'Active',
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    });

    setNewUid('');
    setNewName('');
    setNewDept('');
  };

  return (
    <div className="space-y-6">
      {/* Registration Form */}
      <div className="border border-zinc-800 rounded-lg p-5 bg-zinc-950">
        <h3 className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
          <span>Provision New RFID Credential</span>
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">TAG UID (HEX) *</label>
            <input
              type="text"
              required
              value={newUid}
              onChange={e => setNewUid(e.target.value)}
              placeholder="e.g. 3C:1F:90:A4"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 font-mono text-zinc-100 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">HOLDER NAME *</label>
            <input
              type="text"
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Full name"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">DEPARTMENT</label>
            <input
              type="text"
              value={newDept}
              onChange={e => setNewDept(e.target.value)}
              placeholder="e.g. Security Lab"
              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">ROLE</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-zinc-300 focus:outline-none font-mono"
              >
                <option value="Admin">Admin</option>
                <option value="Engineer">Engineer</option>
                <option value="Staff">Staff</option>
                <option value="Guest">Guest</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-medium flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tags Table */}
      <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/60 border-b border-zinc-800 font-mono text-[11px] text-zinc-400">
            <tr>
              <th className="py-2.5 px-3">UID (HEX)</th>
              <th className="py-2.5 px-3">USER NAME</th>
              <th className="py-2.5 px-3">DEPARTMENT</th>
              <th className="py-2.5 px-3">ROLE</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3">REGISTERED AT</th>
              <th className="py-2.5 px-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {tags.map((tag) => (
              <tr key={tag.uid} className="hover:bg-zinc-900/30 font-mono">
                <td className="py-2.5 px-3 text-zinc-200 font-semibold">{tag.uid}</td>
                <td className="py-2.5 px-3 font-sans text-zinc-100">{tag.userName}</td>
                <td className="py-2.5 px-3 font-sans text-zinc-400">{tag.department}</td>
                <td className="py-2.5 px-3">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                    {tag.role}
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <button
                    onClick={() => onToggleStatus(tag.uid)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                      tag.status === 'Active'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-800'
                        : 'bg-rose-950/80 text-rose-300 border-rose-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-800'
                    }`}
                  >
                    {tag.status}
                  </button>
                </td>
                <td className="py-2.5 px-3 text-zinc-500 text-[11px]">{tag.registeredAt}</td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => onDeleteTag(tag.uid)}
                    className="p-1 text-zinc-500 hover:text-rose-400"
                    title="Delete Tag"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
