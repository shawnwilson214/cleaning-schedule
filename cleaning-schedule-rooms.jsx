import React, { useState } from "react";

// --- FAMILY ---
const FAMILY = [
  { id: "dad", name: "Dad", isKid: false },
  { id: "mom", name: "Mom", isKid: false },
  { id: "kid1", name: "Kid 1", isKid: true, ownRoomId: "room1" },
  { id: "kid2", name: "Kid 2", isKid: true, ownRoomId: "room2" },
  { id: "kid3", name: "Kid 3", isKid: true, ownRoomId: "room3" }
];

// --- ROOMS / TASKS ---
const ROOMS = [
  {
    id: "room1",
    name: "Kid 1 Room",
    tasks: [{ id: "t1", title: "Make bed" }]
  },
  {
    id: "room2",
    name: "Kid 2 Room",
    tasks: [{ id: "t2", title: "Pick up toys" }]
  },
  {
    id: "room3",
    name: "Kid 3 Room",
    tasks: [{ id: "t3", title: "Clean desk" }]
  },
  {
    id: "kitchen",
    name: "Kitchen",
    tasks: [
      { id: "t4", title: "Wipe counters" },
      { id: "t5", title: "Sweep floor" }
    ]
  }
];

// --- FIXED VISIBILITY LOGIC ---
function isTaskVisibleToKid(task, roomId, member) {
  if (!member?.isKid) return true;

  // Always show their own room
  if (roomId === member.ownRoomId) return true;

  // ✅ CRITICAL FIX: show unassigned tasks
  if (!task.assignees || task.assignees.length === 0) return true;

  return task.assignees.includes(member.id);
}

// --- ROOM COMPONENT ---
function Room({ room, activeMember }) {
  const isKidMode = activeMember?.isKid;

  const visibleTasks = room.tasks.filter(task =>
    isTaskVisibleToKid(task, room.id, activeMember)
  );

  // Hide empty rooms ONLY in kid mode
  if (isKidMode && visibleTasks.length === 0) return null;

  return (
    <div className="p-4 border rounded-2xl mb-4">
      <h2 className="text-lg font-bold mb-2">{room.name}</h2>

      {visibleTasks.map(task => (
        <div key={task.id} className="p-2 bg-gray-100 rounded mb-2">
          {task.title}
        </div>
      ))}
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function CleaningSchedule() {
  const [activeMember, setActiveMember] = useState(FAMILY[0]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cleaning Schedule</h1>

      {/* PROFILE SWITCHER */}
      <div className="flex gap-2 mb-6">
        {FAMILY.map(member => (
          <button
            key={member.id}
            onClick={() => setActiveMember(member)}
            className={`px-3 py-2 rounded-xl border ${
              activeMember.id === member.id
                ? "bg-blue-500 text-white"
                : "bg-white"
            }`}
          >
            {member.name}
          </button>
        ))}
      </div>

      {/* 🔥 FORCE RE-RENDER ON PROFILE SWITCH */}
      <div key={activeMember.id}>
        {ROOMS.map(room => (
          <Room
            key={room.id}
            room={room}
            activeMember={activeMember}
          />
        ))}
      </div>
    </div>
  );
}