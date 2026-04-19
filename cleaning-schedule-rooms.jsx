import { useState, useEffect, useCallback, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAecwgL1eJHcbOTAJuAkahf_uWcDN5FNUc",
  authDomain: "cleaning-schedule-4c327.firebaseapp.com",
  projectId: "cleaning-schedule-4c327",
  storageBucket: "cleaning-schedule-4c327.firebasestorage.app",
  messagingSenderId: "689730223216",
  appId: "1:689730223216:web:cd01249d6ebc2fb1f008b5"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function dbGet(key) {
  try {
    const snap = await getDoc(doc(db, "schedule", key));
    if (snap.exists()) return { value: snap.data().value };
    return null;
  } catch (_) { return null; }
}

async function dbSet(key, value) {
  try {
    await setDoc(doc(db, "schedule", key), { value });
    return { value };
  } catch (_) { return null; }
}

function dbListen(key, callback) {
  return onSnapshot(doc(db, "schedule", key), (snap) => {
    if (snap.exists()) callback({ value: snap.data().value });
    else callback(null);
  }, () => {});
}

const FAMILY = [
  { id: "dad",   name: "Dad",   color: "#5B9BD5", avatar: { type: "emoji",  value: "\uD83D\uDC68" } },
  { id: "mom",   name: "Mom",   color: "#D47F6B", avatar: { type: "emoji",  value: "\uD83D\uDC69" } },
  { id: "zach",  name: "Zach",  color: "#6B7FD4", avatar: { type: "letter", value: "Z" } },
  { id: "kyle",  name: "Kyle",  color: "#E8784A", avatar: { type: "letter", value: "K" } },
  { id: "lucas", name: "Lucas", color: "#3DAA6E", avatar: { type: "letter", value: "L" } },
];

function Avatar({ member, size = 32, fontSize }) {
  const fs = fontSize || Math.round(size * 0.45);
  if (!member?.avatar) return null;
  if (member.avatar.type === "emoji") {
    return (
      <span style={{ width: size, height: size, borderRadius: "50%", background: member.color + "22", border: "2px solid " + member.color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: Math.round(size * 0.5), flexShrink: 0 }}>
        {member.avatar.value}
      </span>
    );
  }
  return (
    <span style={{ width: size, height: size, borderRadius: "50%", background: member.color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: fs, fontWeight: "bold", color: "#fff", flexShrink: 0, fontFamily: "Georgia, serif" }}>
      {member.avatar.value}
    </span>
  );
}

function RoomIcon({ icon, size = 17 }) {
  if (typeof icon === "object" && icon.type === "letter") {
    return (
      <span style={{ width: size + 4, height: size + 4, borderRadius: "50%", background: icon.color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: Math.round((size + 4) * 0.5), fontWeight: "bold", color: "#fff", flexShrink: 0, fontFamily: "Georgia, serif" }}>
        {icon.value}
      </span>
    );
  }
  return <span style={{ fontSize: size, flexShrink: 0 }}>{icon}</span>;
}

const levels = [
  { id: "basement", label: "Basement", color: "#6B7FD4", icon: "\uD83C\uDFE0", rooms: [
    { id: "bsmt-bedroom", name: "Basement Bedroom", icon: "\uD83D\uDECF\uFE0F", tasks: { Daily: [], Weekly: [],
      Monthly: ["Vacuum or sweep floor","Dust surfaces & furniture","Empty trash bin","Clean window & sill"],
      Quarterly: ["Wipe baseboards & light switches","Dust blinds","Change & launder bed linens","Wash curtains","Declutter & donate unused items"],
      Annually: ["Deep clean carpets or rugs","Wipe walls"] }},
    { id: "bsmt-bathroom", name: "Basement Bathroom", icon: "\uD83D\uDEBF", tasks: { Daily: [], Weekly: [],
      Monthly: ["Scrub toilet (inside & outside)","Clean sink & countertop","Scrub tub or shower","Mop floor","Wipe mirror","Replace hand towel","Empty trash"],
      Quarterly: ["Wipe baseboards & light switches","Wipe cabinet fronts","Wash bath mat","Wash shower curtain or clean door","Declutter toiletries"],
      Annually: ["Wipe walls"] }},
    { id: "bsmt-family", name: "Basement Family Room", icon: "\uD83C\uDFAE", tasks: {
      Daily: ["Tidy up - return items to their place"], Weekly: [],
      Monthly: ["Vacuum or sweep floor","Dust surfaces, shelves & electronics","Empty trash","Vacuum upholstered furniture","Wipe down remote controls","Dust toys & shelving","Clean window & sill"],
      Quarterly: ["Wipe baseboards & light switches","Dust blinds","Wash throw blankets & pillow covers","Declutter games, toys & media"],
      Annually: ["Deep clean carpets or rugs","Wipe walls"] }},
    { id: "bsmt-utility", name: "Utility Room", icon: "\uD83D\uDD27", tasks: {
      Daily: [], Weekly: [], Monthly: [],
      Quarterly: ["Change furnace filter","Wipe baseboards & light switches"],
      Annually: ["Wipe walls"] }},
  ]},
  { id: "first", label: "First Level", color: "#D47F6B", icon: "\uD83C\uDF73", rooms: [
    { id: "kitchen-dining", name: "Kitchen & Dining Area", icon: "\uD83C\uDF73", tasks: {
      Daily: ["Clear countertops & table","Wipe countertops & stovetop","Wash dishes / run dishwasher","Put dishes away","Wipe sink & faucet","Wipe down kitchen table","Push in chairs","Empty trash & recycling"],
      Weekly: ["Mop floor","Clean microwave inside & out","Wipe small appliances","Wipe exterior of fridge, oven & dishwasher","Throw out old & expired food from refrigerator","Change dish towels","Wipe chair seats & backs","Clean sliding glass door"],
      Monthly: ["Clean refrigerator inside (wipe shelves & drawers)","Clean behind & under small appliances","Clean windows","Dust light fixture over table"],
      Quarterly: ["Wipe cabinet fronts & handles","Wipe baseboards & light switches","Dust blinds","Deep clean oven","Organize pantry & check for expired items","Wash or replace dish rack","Deep clean chairs (scrub or wipe thoroughly)","Launder curtains"],
      Annually: ["Pull out fridge & clean behind","Deep clean all cabinets inside","Wipe walls"] }},
    { id: "living", name: "Living Room", icon: "\uD83D\uDECB\uFE0F", tasks: {
      Daily: ["Tidy up - put items away","Run robot vacuum on floor","Empty robot vacuum bin"], Weekly: [],
      Monthly: ["Dust surfaces, shelves, TV & decor","Vacuum upholstered furniture & under cushions","Clean windows","Wipe remotes & electronics"],
      Quarterly: ["Wipe baseboards & light switches","Dust ceiling fan","Dust blinds","Wash throw blankets & pillow covers","Move furniture to clean underneath","Launder curtains","Declutter shelves & decor"],
      Annually: ["Deep clean carpet or rugs","Wipe walls"] }},
    { id: "main-bathroom", name: "Main Bathroom", icon: "\uD83D\uDEBD", tasks: {
      Daily: ["Wipe sink & faucet"],
      Weekly: ["Scrub toilet (inside & outside)","Clean sink & countertop","Mop floor","Wipe mirror","Empty trash","Replace hand towel"],
      Monthly: ["Clean window & sill"],
      Quarterly: ["Wipe baseboards & light switches","Wipe cabinet fronts & shelves","Wash window treatment","Declutter medicine cabinet & toiletries"],
      Annually: ["Wipe walls"] }},
    { id: "office", name: "Office", icon: "\uD83D\uDCBB", tasks: {
      Daily: ["Clear desk of dishes & trash"],
      Weekly: ["Wipe desk surface"],
      Monthly: ["Dust desk, monitor & shelves","Dust keyboard, mouse & cords","Clean window","Organize paperwork & files"],
      Quarterly: ["Wipe baseboards & light switches","Dust ceiling fan","Dust blinds","Clean chair","Launder curtains","Declutter desk & shelves","Shred unnecessary documents"],
      Annually: ["Deep clean carpet or rugs","Wipe walls"] }},
    { id: "entryway", name: "Entryway", icon: "\uD83D\uDEAA", tasks: {
      Daily: ["Hang up coats, bags & shoes to their spots","Clear items from stairs"],
      Weekly: ["Mop floor","Organize shoes & jackets"],
      Monthly: ["Dust furniture & decor","Vacuum stairs","Clean light fixture","Clean window & sill"],
      Quarterly: ["Wipe baseboards & light switches","Wipe front door inside & out","Wipe baseboards & door frame","Dust blinds","Deep clean door mat","Declutter coats & shoes for season"],
      Annually: ["Wipe walls"] }},
  ]},
  { id: "top", label: "Top Level", color: "#6DB894", icon: "\uD83D\uDECC", rooms: [
    { id: "master-bed", name: "Master Bedroom", icon: "\uD83D\uDC51", tasks: {
      Daily: ["Make bed","Put clothes away or in hamper","Clear room of dirty dishes"],
      Weekly: ["Run robot vacuum on floor","Empty robot vacuum bin","Change bed linens"],
      Monthly: ["Dust surfaces & furniture","Clean windows"],
      Quarterly: ["Wipe baseboards & light switches","Dust ceiling fan","Dust blinds","Launder curtains","Declutter closet"],
      Annually: ["Deep clean carpets or rugs","Wipe walls"] }},
    { id: "master-bath", name: "Master Bathroom", icon: "\uD83D\uDEC1", tasks: {
      Daily: [],
      Weekly: ["Clean toilet","Clean sink & countertop","Clean mirror","Scrub shower","Mop floor","Replace hand towel"],
      Monthly: ["Scrub tub / shower deeply","Wash bath mat","Clean window & sill"],
      Quarterly: ["Wipe baseboards & light switches","Wipe cabinet fronts","Dust blinds","Wash window treatment"],
      Annually: ["Wipe walls"] }},
    { id: "zach-room", name: "Zach's Bedroom (12)", icon: { type: "letter", value: "Z", color: "#6B7FD4" }, tasks: {
      Daily: ["Make bed","Put clothes away or in hamper","Clear room of dirty dishes"],
      Weekly: ["Change bed linens","Empty trash bin"],
      Monthly: ["Dust desk, shelves & electronics","Clean windows & window sills","Organize desk & shelves"],
      Quarterly: ["Wipe baseboards & light switch","Dust ceiling fan","Dust blinds","Clean computer tower","Declutter clothes, games & items"],
      Annually: ["Deep clean carpets or rugs","Wipe walls"] }},
    { id: "kyle-room", name: "Kyle's Bedroom (10)", icon: { type: "letter", value: "K", color: "#E8784A" }, tasks: {
      Daily: ["Make bed","Put clothes away or in hamper","Clear room of dirty dishes"],
      Weekly: ["Change bed linens","Empty trash bin"],
      Monthly: ["Dust desk, shelves & electronics","Clean windows & window sills","Organize desk & shelves"],
      Quarterly: ["Wipe baseboards & light switch","Dust ceiling fan","Dust blinds","Clean computer tower","Declutter clothes & items"],
      Annually: ["Deep clean carpets or rugs","Wipe walls"] }},
    { id: "lucas-room", name: "Lucas's Bedroom (3)", icon: { type: "letter", value: "L", color: "#3DAA6E" }, tasks: {
      Daily: ["Tidy toys and books","Make bed (assisted)","Put clothes away or in hamper"],
      Weekly: ["Change bed linens"],
      Monthly: ["Dust desk, shelves & electronics","Clean windows & window sills","Sanitize frequently touched toys"],
      Quarterly: ["Wipe baseboards & light switch","Dust ceiling fan","Dust blinds","Declutter outgrown toys & clothes"],
      Annually: ["Deep clean carpets or rugs","Wipe walls"] }},
    { id: "kids-bathroom", name: "Kids Bathroom", icon: "\uD83D\uDEC1", tasks: {
      Daily: ["Wipe sink after use","Tidy bathroom - pick up laundry from floor"],
      Weekly: ["Scrub toilet (inside & outside)","Clean sink & countertop","Scrub tub or shower","Mop floor","Wipe mirror","Empty trash","Replace hand towel"],
      Monthly: ["Wash bath mat","Organize kids toiletries & products"],
      Quarterly: ["Wipe baseboards & light switches","Wipe cabinet fronts","Wash shower curtain & liner","Declutter expired or unused products"],
      Annually: ["Wipe walls"] }},
    { id: "laundry", name: "Laundry Room", icon: "\uD83D\uDC55", tasks: {
      Daily: ["Move laundry along (wash, dry, fold, put away)"],
      Weekly: ["Wipe down washer & dryer exterior","Mop floor","Wipe surfaces"],
      Monthly: [],
      Quarterly: ["Wipe baseboards & light switches","Deep clean dryer vent duct","Declutter laundry supplies","Check hoses for leaks or wear"],
      Annually: ["Wipe walls"] }},
    { id: "loft", name: "Loft / Hallway", icon: "\uD83D\uDEB6", tasks: {
      Daily: ["Clear any items left in hallway"],
      Weekly: ["Sweep or vacuum floor"],
      Monthly: ["Dust furniture & decor"],
      Quarterly: ["Wipe baseboards & light switches","Declutter any stored items"],
      Annually: ["Deep clean carpet & stairs","Wipe walls"] }},
  ]},
  { id: "yard", label: "Yard", color: "#5A9E4B", icon: "\uD83C\uDF3F", rooms: [
    { id: "yard-main", name: "Yard (Apr - Oct)", icon: "\uD83C\uDF3F", tasks: {
      Daily: [],
      Weekly: ["Clean up dog poop","Mow & trim grass","Weed garden","Spray weeds"],
      Monthly: [], Quarterly: [], Annually: [] }},
  ]},
];

const allRooms = levels.flatMap(l => l.rooms);
const frequencies = ["Daily", "Weekly", "Monthly", "Quarterly", "Annually"];
const freqMeta = {
  Daily:     { dot: "#E8C547", bg: "#FEFAEC", text: "#7A6010", border: "#F0DC7A", lightBg: "#FFFDF0" },
  Weekly:    { dot: "#5B9BD5", bg: "#EBF4FC", text: "#1A4F7A", border: "#8BBDE8", lightBg: "#F4F9FE" },
  Monthly:   { dot: "#6DB894", bg: "#E8F5EE", text: "#1A6640", border: "#8FD0AE", lightBg: "#F2FAF5" },
  Quarterly: { dot: "#A67DC4", bg: "#F2EBF9", text: "#5A2A82", border: "#C8A8E0", lightBg: "#F8F3FD" },
  Annually:  { dot: "#D4445A", bg: "#FDEAED", text: "#7A1020", border: "#EE8898", lightBg: "#FEF4F5" },
};

function getPeriodKey(freq, date = new Date()) {
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate(), day = date.getDay();
  if (freq === "Daily") return "Daily:" + y + "-" + String(m+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
  if (freq === "Weekly") {
    const sun = new Date(date); sun.setDate(d - day);
    return "Weekly:" + sun.getFullYear() + "-" + String(sun.getMonth()+1).padStart(2,"0") + "-" + String(sun.getDate()).padStart(2,"0");
  }
  if (freq === "Monthly") return "Monthly:" + y + "-" + String(m+1).padStart(2,"0");
  if (freq === "Quarterly") return "Quarterly:" + y + "-Q" + (Math.floor(m/3)+1);
  if (freq === "Annually") return "Annually:" + y;
  return freq + ":unknown";
}

function periodLabel(periodKey) {
  if (!periodKey) return "";
  const [freq, val] = periodKey.split(":");
  if (freq === "Daily") return new Date(val + "T12:00:00").toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  if (freq === "Weekly") {
    const sun = new Date(val + "T12:00:00"), sat = new Date(sun);
    sat.setDate(sat.getDate() + 6);
    return "Week of " + sun.toLocaleDateString([], { month: "short", day: "numeric" }) + " - " + sat.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  }
  if (freq === "Monthly") { const [y,mo] = val.split("-"); return new Date(Number(y), Number(mo)-1, 1).toLocaleDateString([], { month: "long", year: "numeric" }); }
  if (freq === "Quarterly") {
    const [y,q] = val.split("-");
    return ({ Q1:"Jan",Q2:"Apr",Q3:"Jul",Q4:"Oct" })[q] + " - " + ({ Q1:"Mar",Q2:"Jun",Q3:"Sep",Q4:"Dec" })[q] + " " + y;
  }
  if (freq === "Annually") return "Year " + val;
  return periodKey;
}

function storageKey(periodKey) { return periodKey.replace(/:/g,"-").replace(/\s/g,""); }

function fmt(ts) {
  if (!ts) return "";
  const diff = Math.floor((Date.now() - ts) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return diff + "m ago";
  if (diff < 1440) return Math.floor(diff/60) + "h ago";
  return new Date(ts).toLocaleDateString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function toDateStr(ts) {
  const d = new Date(ts);
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

// Get date 30 days ago as YYYY-MM-DD
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

function today() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

export default function CleaningSchedule() {
  const [activeFreq, setActiveFreq] = useState("Daily");
  const [activeMember, setActiveMember] = useState(FAMILY[0]);
  const [completions, setCompletions] = useState({});
  const [collapsed, setCollapsed] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("tasks");
  const [taskLayout, setTaskLayout] = useState("frequency");
  const [activeRoom, setActiveRoom] = useState(levels[0].rooms[0]);
  const [editLevel, setEditLevel] = useState(levels[0]);
  const [editRoom, setEditRoom] = useState(levels[0].rooms[0]);
  const [customTasks, setCustomTasks] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskFreq, setNewTaskFreq] = useState("Daily");
  const [newTaskAssignees, setNewTaskAssignees] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);

  // History / reporting state
  const [allArchiveData, setAllArchiveData] = useState({}); // periodKey -> completions object
  const [archiveIndex, setArchiveIndex] = useState([]);
  const [archiveLoading, setArchiveLoading] = useState(false);

  // Report filters
  const [reportDateFrom, setReportDateFrom] = useState(daysAgo(30));
  const [reportDateTo, setReportDateTo] = useState(today());
  const [reportMembers, setReportMembers] = useState([]); // empty = all
  const [reportRooms, setReportRooms] = useState([]);     // empty = all
  const [reportFreqs, setReportFreqs] = useState([]);     // empty = all
  const [reportGroupBy, setReportGroupBy] = useState("date"); // date | person | room
  const [showFilters, setShowFilters] = useState(true);

  const writingRef = useRef(false);
  const fm = freqMeta[activeFreq];

  const archivePeriod = useCallback(async (periodKey, data) => {
    if (!data || Object.keys(data).length === 0) return;
    const sk = "archive-" + storageKey(periodKey);
    try {
      let existing = {};
      const r = await dbGet(sk);
      if (r?.value) existing = JSON.parse(r.value);
      await dbSet(sk, JSON.stringify({ ...existing, ...data }));
      const idxResult = await dbGet("archive-index");
      const index = idxResult?.value ? JSON.parse(idxResult.value) : [];
      if (!index.includes(periodKey)) { index.push(periodKey); await dbSet("archive-index", JSON.stringify(index)); }
    } catch (_) {}
  }, []);

  const pruneAndArchive = useCallback(async (current) => {
    const now = new Date(), live = {}, byPeriod = {};
    Object.entries(current).forEach(([key, val]) => {
      if (!val?.freq) return;
      if (val.periodKey === getPeriodKey(val.freq, now)) { live[key] = val; }
      else { const pk = val.periodKey || "unknown"; if (!byPeriod[pk]) byPeriod[pk] = {}; byPeriod[pk][key] = val; }
    });
    for (const [pk, data] of Object.entries(byPeriod)) await archivePeriod(pk, data);
    return live;
  }, [archivePeriod]);

  // Real-time listener for completions
  useEffect(() => {
    let initialized = false;
    const unsub = dbListen("completions", async (result) => {
      if (writingRef.current) return;
      if (result?.value) {
        const raw = JSON.parse(result.value);
        if (!initialized) {
          initialized = true;
          const pruned = await pruneAndArchive(raw);
          setCompletions(pruned);
        } else {
          setCompletions(raw);
        }
      } else { initialized = true; }
      setLoading(false);
    });
    return () => unsub();
  }, [pruneAndArchive]);

  // Real-time listener for customTasks
  useEffect(() => {
    const unsub = dbListen("customTasks", (result) => {
      if (writingRef.current) return;
      if (result?.value) setCustomTasks(JSON.parse(result.value));
    });
    return () => unsub();
  }, []);

  const saveCompletions = useCallback(async (data) => {
    writingRef.current = true;
    await dbSet("completions", JSON.stringify(data));
    setTimeout(() => { writingRef.current = false; }, 500);
  }, []);

  const saveCustomTasks = useCallback(async (data) => {
    writingRef.current = true;
    await dbSet("customTasks", JSON.stringify(data));
    setTimeout(() => { writingRef.current = false; }, 500);
  }, []);

  // Load all archive data when switching to history
  useEffect(() => {
    if (view !== "history") return;
    async function loadAll() {
      setArchiveLoading(true);
      try {
        const idxResult = await dbGet("archive-index");
        const index = idxResult?.value ? JSON.parse(idxResult.value) : [];
        setArchiveIndex(index);
        const dataMap = {};
        await Promise.all(index.map(async (pk) => {
          const r = await dbGet("archive-" + storageKey(pk));
          if (r?.value) dataMap[pk] = JSON.parse(r.value);
        }));
        setAllArchiveData(dataMap);
      } catch (_) {}
      setArchiveLoading(false);
    }
    loadAll();
  }, [view]);

  function getTaskList(roomId, freq) {
    if (customTasks[roomId]?.[freq] !== undefined) return customTasks[roomId][freq];
    const room = allRooms.find(r => r.id === roomId);
    return (room?.tasks[freq] || []).map(text => ({ text, assignees: [] }));
  }

  function ensureSnapshot(roomId, freq, prev) {
    if (prev[roomId]?.[freq] !== undefined) return prev;
    const room = allRooms.find(r => r.id === roomId);
    const base = (room?.tasks[freq] || []).map(text => ({ text, assignees: [] }));
    return { ...prev, [roomId]: { ...(prev[roomId] || {}), [freq]: base } };
  }

  const getMergedTasks = (roomId, freq) => getTaskList(roomId, freq);

  const toggleTask = (key, freq) => {
    setCompletions(prev => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = { by: activeMember.id, name: activeMember.name, color: activeMember.color, at: Date.now(), freq, periodKey: getPeriodKey(freq) };
      saveCompletions(next);
      return next;
    });
  };

  const toggleRoom = (key) => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  // ── Build all report items from archive + current completions ─────────────
  const buildReportItems = useCallback(() => {
    const items = [];

    // Helper to add items from a completions object
    function addFromCompletions(completionsObj) {
      Object.entries(completionsObj).forEach(([key, c]) => {
        if (!c || !c.at) return;
        const dateStr = toDateStr(c.at);
        if (dateStr < reportDateFrom || dateStr > reportDateTo) return;
        if (reportMembers.length > 0 && !reportMembers.includes(c.by)) return;
        if (reportFreqs.length > 0 && !reportFreqs.includes(c.freq)) return;

        // Parse room from key: roomId-freq-index
        const parts = key.split("-");
        // freq is the second-to-last group before index — find room by matching known room ids
        const room = allRooms.find(r => key.startsWith(r.id + "-"));
        if (!room) return;
        if (reportRooms.length > 0 && !reportRooms.includes(room.id)) return;

        const freq = c.freq;
        const taskIndex = parseInt(key.split("-").pop());
        const taskList = getTaskList(room.id, freq);
        const taskText = taskList[taskIndex]?.text || key;

        items.push({
          key,
          task: taskText,
          roomId: room.id,
          roomName: room.name,
          roomIcon: room.icon,
          freq,
          by: c.by,
          name: c.name,
          color: c.color,
          at: c.at,
          dateStr,
        });
      });
    }

    // Current period completions
    addFromCompletions(completions);

    // Archived completions
    Object.values(allArchiveData).forEach(periodCompletions => {
      addFromCompletions(periodCompletions);
    });

    // Sort by date descending
    items.sort((a, b) => b.at - a.at);
    return items;
  }, [completions, allArchiveData, reportDateFrom, reportDateTo, reportMembers, reportRooms, reportFreqs, customTasks]);

  const reportItems = buildReportItems();

  // Group items
  function groupItems(items) {
    const groups = {};
    items.forEach(item => {
      let key;
      if (reportGroupBy === "date") {
        key = item.dateStr;
      } else if (reportGroupBy === "person") {
        key = item.by;
      } else if (reportGroupBy === "room") {
        key = item.roomId;
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }

  function groupLabel(key) {
    if (reportGroupBy === "date") {
      return new Date(key + "T12:00:00").toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    }
    if (reportGroupBy === "person") {
      return FAMILY.find(f => f.id === key)?.name || key;
    }
    if (reportGroupBy === "room") {
      return allRooms.find(r => r.id === key)?.name || key;
    }
    return key;
  }

  function groupColor(key) {
    if (reportGroupBy === "person") return FAMILY.find(f => f.id === key)?.color || "#888";
    if (reportGroupBy === "room") {
      const level = levels.find(l => l.rooms.some(r => r.id === key));
      return level?.color || "#888";
    }
    return "#5B9BD5";
  }

  const grouped = groupItems(reportItems);
  const groupKeys = Object.keys(grouped).sort((a, b) => {
    if (reportGroupBy === "date") return b.localeCompare(a);
    return grouped[b].length - grouped[a].length;
  });

  // Summary stats
  const totalCompleted = reportItems.length;
  const uniquePeople = [...new Set(reportItems.map(i => i.by))];
  const uniqueRoomsInReport = [...new Set(reportItems.map(i => i.roomId))];

  let totalTasks = 0, doneTasks = 0;
  levels.forEach(lv => lv.rooms.forEach(room => {
    const tasks = getMergedTasks(room.id, activeFreq);
    totalTasks += tasks.length;
    tasks.forEach((_, i) => { if (completions[room.id + "-" + activeFreq + "-" + i]) doneTasks++; });
  }));
  const overallPct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F5F2EC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
      <p style={{ color: "#AAA" }}>Loading...</p>
    </div>
  );

  const inputStyle = { fontSize: 12, padding: "6px 8px", border: "1px solid #DDD8CE", borderRadius: 8, fontFamily: "Georgia, serif", background: "#fff", color: "#1A1A1A", width: "100%", boxSizing: "border-box" };
  const chipStyle = (active, color) => ({ padding: "4px 10px", borderRadius: 12, border: "1px solid " + (active ? color : "#DDD8CE"), background: active ? color + "22" : "#fff", color: active ? color : "#777", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: active ? "bold" : "normal", whiteSpace: "nowrap" });

  return (
    <div style={{ minHeight: "100vh", background: "#F5F2EC", fontFamily: "Georgia, serif" }}>

      {/* HEADER */}
      <div style={{ background: "#1A1A1A", color: "#F5F2EC", padding: "20px 20px 14px" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "#555", margin: "0 0 4px", textTransform: "uppercase" }}>Home Management</p>
        <h1 style={{ fontSize: 24, fontWeight: "normal", margin: "0 0 12px" }}>Cleaning Schedule</h1>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FAMILY.map(m => (
            <button key={m.id} onClick={() => setActiveMember(m)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, cursor: "pointer", border: "2px solid " + (activeMember.id === m.id ? m.color : "transparent"), background: activeMember.id === m.id ? m.color + "22" : "rgba(255,255,255,0.07)", color: activeMember.id === m.id ? "#fff" : "#888", fontFamily: "inherit", fontSize: 12, fontWeight: activeMember.id === m.id ? "bold" : "normal" }}>
              <Avatar member={m} size={22} fontSize={11} /><span>{m.name}</span>
            </button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#555", margin: "8px 0 0" }}>Completing as <strong style={{ color: activeMember.color }}>{activeMember.name}</strong></p>
      </div>

      {/* VIEW TOGGLE */}
      <div style={{ display: "flex", background: "#111", borderTop: "1px solid #2A2A2A" }}>
        {[["tasks","Tasks"],["history","Reports"],["edit","Edit"]].map(([v,label]) => (
          <button key={v} onClick={() => setView(v)} style={{ flex: 1, background: "none", border: "none", padding: "10px", cursor: "pointer", fontFamily: "inherit", fontSize: 11, color: view === v ? "#F5F2EC" : "#555", borderBottom: view === v ? "2px solid #F5F2EC" : "2px solid transparent", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</button>
        ))}
      </div>

      {/* ═══════════════════ HISTORY / REPORTS VIEW ═══════════════════ */}
      {view === "history" && (
        <div style={{ paddingBottom: 60 }}>

          {/* Filter panel toggle */}
          <div style={{ padding: "10px 16px", background: "#F5F2EC", borderBottom: "1px solid #E4E0D8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: "bold", color: "#1A1A1A" }}>Report Builder</span>
            <button onClick={() => setShowFilters(f => !f)} style={{ fontSize: 11, color: "#5B9BD5", background: "none", border: "1px solid #8BBDE8", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && (
            <div style={{ background: "#fff", borderBottom: "1px solid #E4E0D8", padding: "14px 16px" }}>

              {/* Date range */}
              <p style={{ margin: "0 0 6px", fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em" }}>Date Range</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 3px", fontSize: 10, color: "#888" }}>From</p>
                  <input type="date" value={reportDateFrom} onChange={e => setReportDateFrom(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 3px", fontSize: 10, color: "#888" }}>To</p>
                  <input type="date" value={reportDateTo} onChange={e => setReportDateTo(e.target.value)} style={inputStyle} />
                </div>
              </div>

              {/* Quick date presets */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {[["Today", 0],["7 days", 7],["30 days", 30],["90 days", 90],["This year", 365]].map(([label, days]) => (
                  <button key={label} onClick={() => { setReportDateFrom(daysAgo(days)); setReportDateTo(today()); }} style={{ ...chipStyle(reportDateFrom === daysAgo(days) && reportDateTo === today(), "#5B9BD5") }}>{label}</button>
                ))}
              </div>

              {/* People filter */}
              <p style={{ margin: "0 0 6px", fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em" }}>People <span style={{ color: "#CCC", fontStyle: "italic", textTransform: "none" }}>(all if none selected)</span></p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {FAMILY.map(m => {
                  const active = reportMembers.includes(m.id);
                  return (
                    <button key={m.id} onClick={() => setReportMembers(prev => active ? prev.filter(x => x !== m.id) : [...prev, m.id])} style={{ display: "flex", alignItems: "center", gap: 5, ...chipStyle(active, m.color) }}>
                      <Avatar member={m} size={16} fontSize={8} />{m.name}
                    </button>
                  );
                })}
              </div>

              {/* Frequency filter */}
              <p style={{ margin: "0 0 6px", fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em" }}>Frequency <span style={{ color: "#CCC", fontStyle: "italic", textTransform: "none" }}>(all if none selected)</span></p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {frequencies.map(f => {
                  const active = reportFreqs.includes(f);
                  const meta = freqMeta[f];
                  return (
                    <button key={f} onClick={() => setReportFreqs(prev => active ? prev.filter(x => x !== f) : [...prev, f])} style={chipStyle(active, meta.dot)}>
                      {f}
                    </button>
                  );
                })}
              </div>

              {/* Room filter */}
              <p style={{ margin: "0 0 6px", fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em" }}>Rooms <span style={{ color: "#CCC", fontStyle: "italic", textTransform: "none" }}>(all if none selected)</span></p>
              {levels.map(lv => (
                <div key={lv.id} style={{ marginBottom: 8 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 10, color: lv.color, fontWeight: "bold", textTransform: "uppercase" }}>{lv.label}</p>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {lv.rooms.map(room => {
                      const active = reportRooms.includes(room.id);
                      return (
                        <button key={room.id} onClick={() => setReportRooms(prev => active ? prev.filter(x => x !== room.id) : [...prev, room.id])} style={{ display: "flex", alignItems: "center", gap: 4, ...chipStyle(active, lv.color) }}>
                          <RoomIcon icon={room.icon} size={11} />{room.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Group by */}
              <p style={{ margin: "14px 0 6px", fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.1em" }}>Group By</p>
              <div style={{ display: "flex", gap: 6 }}>
                {[["date","Date"],["person","Person"],["room","Room"]].map(([v,label]) => (
                  <button key={v} onClick={() => setReportGroupBy(v)} style={{ ...chipStyle(reportGroupBy === v, "#1A1A1A"), background: reportGroupBy === v ? "#1A1A1A" : "#fff", color: reportGroupBy === v ? "#fff" : "#777" }}>{label}</button>
                ))}
              </div>

              {/* Clear filters */}
              <button onClick={() => { setReportMembers([]); setReportRooms([]); setReportFreqs([]); setReportDateFrom(daysAgo(30)); setReportDateTo(today()); }} style={{ marginTop: 14, fontSize: 11, color: "#D47F6B", background: "none", border: "1px solid #EE8898", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                Clear All Filters
              </button>
            </div>
          )}

          {/* Summary bar */}
          {archiveLoading ? (
            <div style={{ padding: "24px", textAlign: "center" }}>
              <p style={{ color: "#AAA", fontSize: 13 }}>Loading archive data...</p>
            </div>
          ) : (
            <>
              <div style={{ padding: "12px 16px", background: "#ECEAE3", borderBottom: "1px solid #DDD8CE", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: "bold", color: "#6DB894" }}>{totalCompleted}</p>
                  <p style={{ margin: 0, fontSize: 10, color: "#888" }}>tasks completed</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: "bold", color: "#5B9BD5" }}>{uniquePeople.length}</p>
                  <p style={{ margin: 0, fontSize: 10, color: "#888" }}>people active</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: "bold", color: "#A67DC4" }}>{uniqueRoomsInReport.length}</p>
                  <p style={{ margin: 0, fontSize: 10, color: "#888" }}>rooms covered</p>
                </div>
                {totalCompleted > 0 && (
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 10, color: "#888" }}>Top contributor</p>
                    {(() => {
                      const counts = {};
                      reportItems.forEach(i => { counts[i.by] = (counts[i.by] || 0) + 1; });
                      const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
                      const member = FAMILY.find(f => f.id === top[0]);
                      return member ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Avatar member={member} size={20} fontSize={10} />
                          <span style={{ fontSize: 12, color: member.color, fontWeight: "bold" }}>{member.name}</span>
                          <span style={{ fontSize: 11, color: "#AAA" }}>{top[1]} tasks</span>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Per-person breakdown bar */}
              {totalCompleted > 0 && (
                <div style={{ padding: "10px 16px", background: "#F5F2EC", borderBottom: "1px solid #E4E0D8" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.08em" }}>Breakdown by person</p>
                  <div style={{ display: "flex", height: 8, borderRadius: 6, overflow: "hidden", marginBottom: 6 }}>
                    {FAMILY.map(m => {
                      const count = reportItems.filter(i => i.by === m.id).length;
                      if (count === 0) return null;
                      const pct = Math.round(count / totalCompleted * 100);
                      return <div key={m.id} style={{ width: pct + "%", background: m.color, transition: "width 0.4s" }} title={m.name + ": " + count} />;
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {FAMILY.map(m => {
                      const count = reportItems.filter(i => i.by === m.id).length;
                      if (count === 0) return null;
                      return (
                        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.color }} />
                          <span style={{ fontSize: 11, color: m.color, fontWeight: "bold" }}>{m.name}</span>
                          <span style={{ fontSize: 11, color: "#AAA" }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Results */}
              <div style={{ padding: "12px 12px 0" }}>
                {totalCompleted === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px" }}>
                    <p style={{ fontSize: 14, color: "#CCC", margin: 0 }}>No completed tasks found</p>
                    <p style={{ fontSize: 12, color: "#CCC", margin: "6px 0 0", fontStyle: "italic" }}>Try adjusting your date range or filters</p>
                  </div>
                ) : (
                  groupKeys.map(gk => {
                    const items = grouped[gk];
                    const color = groupColor(gk);
                    const label = groupLabel(gk);
                    const memberForGroup = reportGroupBy === "person" ? FAMILY.find(f => f.id === gk) : null;
                    const roomForGroup = reportGroupBy === "room" ? allRooms.find(r => r.id === gk) : null;
                    return (
                      <div key={gk} style={{ marginBottom: 14, borderRadius: 12, overflow: "hidden", border: "1px solid " + color + "44" }}>
                        {/* Group header */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: color + "15", borderBottom: "1px solid " + color + "33" }}>
                          {memberForGroup && <Avatar member={memberForGroup} size={26} fontSize={12} />}
                          {roomForGroup && <RoomIcon icon={roomForGroup.icon} size={18} />}
                          {reportGroupBy === "date" && <span style={{ fontSize: 15 }}>📅</span>}
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: "bold", color }}>{label}</p>
                            <p style={{ margin: 0, fontSize: 10, color: "#AAA" }}>{items.length} task{items.length !== 1 ? "s" : ""} completed</p>
                          </div>
                        </div>
                        {/* Items */}
                        <div style={{ background: "#fff" }}>
                          {items.map((item, idx) => {
                            const member = FAMILY.find(f => f.id === item.by);
                            const fmr = freqMeta[item.freq] || freqMeta.Daily;
                            return (
                              <div key={item.key + idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderBottom: idx < items.length - 1 ? "1px solid #F5F2EC" : "none" }}>
                                <div style={{ width: 16, height: 16, borderRadius: "50%", background: item.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5.5L7.5 1" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ margin: 0, fontSize: 13, color: "#1A1A1A" }}>{item.task}</p>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                                    {reportGroupBy !== "room" && (
                                      <span style={{ fontSize: 10, color: "#AAA" }}><RoomIcon icon={allRooms.find(r=>r.id===item.roomId)?.icon} size={10} /> {item.roomName}</span>
                                    )}
                                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 6, background: fmr.bg, color: fmr.text, fontWeight: "bold" }}>{item.freq}</span>
                                    {reportGroupBy !== "date" && (
                                      <span style={{ fontSize: 10, color: "#CCC" }}>{fmt(item.at)}</span>
                                    )}
                                  </div>
                                </div>
                                {reportGroupBy !== "person" && member && (
                                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                    <Avatar member={member} size={20} fontSize={9} />
                                    <p style={{ margin: 0, fontSize: 10, color: item.color, fontWeight: "bold" }}>{item.name}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══════════════════ TASKS VIEW ═══════════════════ */}
      {view === "tasks" && (<>
        <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#F5F2EC", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 16px 6px" }}>
            <div style={{ display: "flex", background: "#ECEAE3", borderRadius: 20, padding: 3, gap: 2 }}>
              {[["frequency","By Frequency"],["room","By Room"]].map(([l,label]) => (
                <button key={l} onClick={() => setTaskLayout(l)} style={{ padding: "5px 14px", borderRadius: 16, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: taskLayout === l ? "bold" : "normal", background: taskLayout === l ? "#1A1A1A" : "transparent", color: taskLayout === l ? "#F5F2EC" : "#888" }}>{label}</button>
              ))}
            </div>
          </div>
          {taskLayout === "frequency" && (<>
            <div style={{ display: "flex", background: "#ECEAE3", borderBottom: "2px solid " + fm.dot }}>
              {frequencies.map(f => { const meta = freqMeta[f], active = activeFreq === f; return (
                <button key={f} onClick={() => setActiveFreq(f)} style={{ flex: 1, background: active ? meta.bg : "none", border: "none", padding: "12px 4px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 10, fontWeight: active ? "bold" : "normal", color: active ? meta.text : "#999", textTransform: "uppercase" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: meta.dot, margin: "0 auto 4px", opacity: active ? 1 : 0.4 }} />{f}
                </button>
              ); })}
            </div>
            <div style={{ padding: "9px 20px", background: fm.lightBg, borderBottom: "1px solid " + fm.border }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 10, color: fm.text, textTransform: "uppercase", opacity: 0.7 }}>{activeFreq} - {periodLabel(getPeriodKey(activeFreq))}</span>
                <span style={{ fontSize: 11, color: fm.text, fontWeight: "bold" }}>{overallPct === 100 && totalTasks > 0 ? "All done!" : doneTasks + " / " + totalTasks}</span>
              </div>
              <div style={{ height: 4, background: "rgba(0,0,0,0.08)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: overallPct + "%", background: fm.dot, borderRadius: 4, transition: "width 0.4s" }} />
              </div>
            </div>
          </>)}
          {taskLayout === "room" && (
            <div style={{ borderBottom: "1px solid #DDD8CE" }}>
              {levels.map(lv => (
                <div key={lv.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px 4px", borderLeft: "3px solid " + lv.color, background: "#ECEAE3" }}>
                    <span style={{ fontSize: 12 }}>{lv.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: "bold", color: lv.color, textTransform: "uppercase" }}>{lv.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, padding: "6px 12px", overflowX: "auto" }}>
                    {lv.rooms.map(room => { const isActive = activeRoom.id === room.id; return (
                      <button key={room.id} onClick={() => setActiveRoom(room)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 16, border: "1px solid " + (isActive ? lv.color : "#DDD8CE"), background: isActive ? lv.color : "#fff", color: isActive ? "#fff" : "#555", cursor: "pointer", fontFamily: "inherit", fontSize: 11, whiteSpace: "nowrap", flexShrink: 0 }}>
                        <RoomIcon icon={room.icon} size={13} /><span>{room.name}</span>
                      </button>
                    ); })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {taskLayout === "frequency" && (
          <div style={{ padding: "12px 0 48px" }}>
            {levels.map(lv => (
              <div key={lv.id} style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", background: "#ECEAE3", borderLeft: "4px solid " + lv.color }}>
                  <span style={{ fontSize: 15 }}>{lv.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: "bold", color: lv.color, textTransform: "uppercase" }}>{lv.label}</span>
                </div>
                <div style={{ padding: "6px 12px 2px" }}>
                  {lv.rooms.map(room => {
                    const mergedTasks = getMergedTasks(room.id, activeFreq), tasks = mergedTasks.map(t => t.text);
                    const colKey = room.id+"-"+activeFreq, isOpen = !collapsed[colKey];
                    const doneCount = tasks.filter((_, i) => completions[room.id+"-"+activeFreq+"-"+i]).length;
                    const roomPct = tasks.length ? Math.round(doneCount/tasks.length*100) : 0;
                    const allDone = tasks.length > 0 && doneCount === tasks.length;
                    return (
                      <div key={room.id} style={{ marginBottom: 7, borderRadius: 10, overflow: "hidden", border: "1px solid " + (tasks.length > 0 ? fm.border : "#E4E0D8"), opacity: tasks.length === 0 ? 0.5 : 1 }}>
                        <div onClick={() => tasks.length > 0 && toggleRoom(colKey)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: allDone ? fm.bg : "#fff", cursor: tasks.length > 0 ? "pointer" : "default" }}>
                          <RoomIcon icon={room.icon} size={17} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                              <span style={{ fontSize: 13, fontWeight: "bold", color: tasks.length === 0 ? "#CCC" : "#1A1A1A" }}>{room.name}</span>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                                {tasks.length > 0 && <span style={{ fontSize: 11, color: allDone ? fm.text : "#AAA", fontWeight: allDone ? "bold" : "normal" }}>{allDone ? "Done" : doneCount+"/"+tasks.length}</span>}
                                {tasks.length > 0 && <span style={{ fontSize: 11, color: "#CCC", display: "inline-block", transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }}>v</span>}
                              </div>
                            </div>
                            {tasks.length > 0 && <div style={{ height: 3, background: "#F0EDE6", borderRadius: 2, marginTop: 5, overflow: "hidden" }}><div style={{ height: "100%", width: roomPct+"%", background: fm.dot, borderRadius: 2, transition: "width 0.3s" }} /></div>}
                            {tasks.length === 0 && <span style={{ fontSize: 11, color: "#CCC", fontStyle: "italic" }}>No {activeFreq.toLowerCase()} tasks</span>}
                          </div>
                        </div>
                        {tasks.length > 0 && isOpen && (
                          <div style={{ borderTop: "1px solid " + fm.border, background: fm.lightBg }}>
                            {tasks.map((task, i) => {
                              const key = room.id+"-"+activeFreq+"-"+i, completion = completions[key], done = !!completion;
                              const member = done ? FAMILY.find(f => f.id === completion.by) : null;
                              return (
                                <div key={key} onClick={() => toggleTask(key, activeFreq)} style={{ padding: "10px 14px", borderBottom: i < tasks.length-1 ? "1px solid "+fm.border : "none", cursor: "pointer", background: done ? "rgba(255,255,255,0.6)" : "transparent" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 19, height: 19, borderRadius: "50%", flexShrink: 0, border: "2px solid "+(done?completion.color:"#CCC"), background: done?completion.color:"transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      {done && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                    </div>
                                    <span style={{ flex: 1, fontSize: 13, color: done?"#AAA":fm.text, textDecoration: done?"line-through":"none" }}>{task}</span>
                                    {done && member && (
                                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                        <Avatar member={member} size={24} fontSize={11} />
                                        <div style={{ textAlign: "right" }}>
                                          <p style={{ margin: 0, fontSize: 10, color: completion.color, fontWeight: "bold", lineHeight: 1.2 }}>{completion.name}</p>
                                          <p style={{ margin: 0, fontSize: 9, color: "#CCC", lineHeight: 1.2 }}>{fmt(completion.at)}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {taskLayout === "room" && (
          <div style={{ padding: "12px 12px 48px" }}>
            {frequencies.map(freq => {
              const mergedTasks = getMergedTasks(activeRoom.id, freq), tasks = mergedTasks.map(t => t.text);
              const fmr = freqMeta[freq], colKey = "room-"+activeRoom.id+"-"+freq, isOpen = !collapsed[colKey];
              const doneCount = tasks.filter((_, i) => completions[activeRoom.id+"-"+freq+"-"+i]).length;
              const roomPct = tasks.length ? Math.round(doneCount/tasks.length*100) : 0;
              const allDone = tasks.length > 0 && doneCount === tasks.length;
              return (
                <div key={freq} style={{ marginBottom: 10, borderRadius: 10, overflow: "hidden", border: "1px solid "+(tasks.length > 0 ? fmr.border : "#E4E0D8"), opacity: tasks.length === 0 ? 0.4 : 1 }}>
                  <div onClick={() => tasks.length > 0 && toggleRoom(colKey)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: allDone ? fmr.bg : "#fff", cursor: tasks.length > 0 ? "pointer" : "default" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: fmr.dot, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, fontWeight: "bold", color: tasks.length === 0 ? "#CCC" : fmr.text, textTransform: "uppercase" }}>{freq}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {tasks.length > 0 && <span style={{ fontSize: 11, color: allDone ? fmr.text : "#AAA", fontWeight: allDone ? "bold" : "normal" }}>{allDone ? "Done" : doneCount+"/"+tasks.length}</span>}
                          {tasks.length > 0 && <span style={{ fontSize: 11, color: "#CCC", display: "inline-block", transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }}>v</span>}
                        </div>
                      </div>
                      {tasks.length > 0 && <div style={{ height: 3, background: "#F0EDE6", borderRadius: 2, marginTop: 5, overflow: "hidden" }}><div style={{ height: "100%", width: roomPct+"%", background: fmr.dot, borderRadius: 2, transition: "width 0.3s" }} /></div>}
                      {tasks.length === 0 && <span style={{ fontSize: 11, color: "#CCC", fontStyle: "italic" }}>No {freq.toLowerCase()} tasks</span>}
                    </div>
                  </div>
                  {tasks.length > 0 && isOpen && (
                    <div style={{ borderTop: "1px solid "+fmr.border, background: fmr.lightBg }}>
                      {tasks.map((task, i) => {
                        const key = activeRoom.id+"-"+freq+"-"+i, completion = completions[key], done = !!completion;
                        const member = done ? FAMILY.find(f => f.id === completion.by) : null;
                        return (
                          <div key={key} onClick={() => toggleTask(key, freq)} style={{ padding: "10px 14px", borderBottom: i < tasks.length-1 ? "1px solid "+fmr.border : "none", cursor: "pointer", background: done ? "rgba(255,255,255,0.6)" : "transparent" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 19, height: 19, borderRadius: "50%", flexShrink: 0, border: "2px solid "+(done?completion.color:"#CCC"), background: done?completion.color:"transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {done && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <span style={{ flex: 1, fontSize: 13, color: done?"#AAA":fmr.text, textDecoration: done?"line-through":"none" }}>{task}</span>
                              {done && member && (
                                <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                  <Avatar member={member} size={24} fontSize={11} />
                                  <div style={{ textAlign: "right" }}>
                                    <p style={{ margin: 0, fontSize: 10, color: completion.color, fontWeight: "bold", lineHeight: 1.2 }}>{completion.name}</p>
                                    <p style={{ margin: 0, fontSize: 9, color: "#CCC", lineHeight: 1.2 }}>{fmt(completion.at)}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </>)}

      {/* ═══════════════════ EDIT VIEW ═══════════════════ */}
      {view === "edit" && (
        <div style={{ paddingBottom: 60 }}>
          <div style={{ display: "flex", background: "#ECEAE3", borderBottom: "1px solid #DDD8CE" }}>
            {levels.map(lv => (
              <button key={lv.id} onClick={() => { setEditLevel(lv); setEditRoom(lv.rooms[0]); setShowAddTask(false); setEditingTask(null); }} style={{ flex: 1, background: editLevel.id === lv.id ? lv.color+"18" : "none", border: "none", padding: "12px 4px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 10, fontWeight: editLevel.id === lv.id ? "bold" : "normal", color: editLevel.id === lv.id ? lv.color : "#999", borderBottom: editLevel.id === lv.id ? "3px solid "+lv.color : "3px solid transparent", textTransform: "uppercase" }}>
                <div style={{ fontSize: 16, marginBottom: 3 }}>{lv.icon}</div>{lv.label}
              </button>
            ))}
          </div>
          <div style={{ padding: "10px 12px 0", display: "flex", gap: 6, overflowX: "auto" }}>
            {editLevel.rooms.map(room => (
              <button key={room.id} onClick={() => { setEditRoom(room); setShowAddTask(false); setEditingTask(null); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 16, border: "1px solid "+(editRoom.id === room.id ? editLevel.color : "#DDD8CE"), background: editRoom.id === room.id ? editLevel.color : "#fff", color: editRoom.id === room.id ? "#fff" : "#555", cursor: "pointer", fontFamily: "inherit", fontSize: 11, whiteSpace: "nowrap", flexShrink: 0 }}>
                <RoomIcon icon={room.icon} size={13} /><span>{room.name}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: "12px 12px 0" }}>
            {frequencies.map(freq => {
              const tasks = getTaskList(editRoom.id, freq), fmr = freqMeta[freq];
              return (
                <div key={freq} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: fmr.dot }} />
                      <span style={{ fontSize: 11, fontWeight: "bold", color: fmr.text, textTransform: "uppercase" }}>{freq}</span>
                      <span style={{ fontSize: 10, color: "#BBB" }}>({tasks.length})</span>
                    </div>
                    <button onClick={() => { setShowAddTask(true); setNewTaskFreq(freq); setNewTaskText(""); setNewTaskAssignees([]); setEditingTask(null); }} style={{ fontSize: 11, color: fmr.text, background: fmr.bg, border: "1px solid "+fmr.border, borderRadius: 10, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit" }}>+ Add</button>
                  </div>
                  {showAddTask && newTaskFreq === freq && editingTask === null && (
                    <div style={{ marginBottom: 8, padding: "10px 12px", background: fmr.bg, border: "1px solid "+fmr.border, borderRadius: 10 }}>
                      <input autoFocus value={newTaskText} onChange={e => setNewTaskText(e.target.value)} placeholder="Task description" style={{ width: "100%", fontSize: 13, padding: "6px 8px", border: "1px solid "+fmr.border, borderRadius: 6, fontFamily: "inherit", marginBottom: 8, boxSizing: "border-box" }} />
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                        {FAMILY.map(m => (<button key={m.id} onClick={() => setNewTaskAssignees(prev => prev.includes(m.id) ? prev.filter(x => x !== m.id) : [...prev, m.id])} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 12, border: "1px solid "+(newTaskAssignees.includes(m.id)?m.color:"#DDD"), background: newTaskAssignees.includes(m.id)?m.color+"22":"#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}><Avatar member={m} size={16} fontSize={8} /><span style={{ color: newTaskAssignees.includes(m.id)?m.color:"#777" }}>{m.name}</span></button>))}
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { if (!newTaskText.trim()) return; const updated = (prev => { const snap = ensureSnapshot(editRoom.id, freq, prev); return { ...snap, [editRoom.id]: { ...snap[editRoom.id], [freq]: [...snap[editRoom.id][freq], { text: newTaskText.trim(), assignees: newTaskAssignees }] } }; })(customTasks); setCustomTasks(updated); saveCustomTasks(updated); setShowAddTask(false); setNewTaskText(""); setNewTaskAssignees([]); }} style={{ flex: 1, padding: "7px", background: fmr.dot, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: "bold" }}>Save</button>
                        <button onClick={() => { setShowAddTask(false); setNewTaskText(""); setNewTaskAssignees([]); }} style={{ padding: "7px 14px", background: "#fff", border: "1px solid #DDD", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, color: "#888" }}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {tasks.length === 0 && !(showAddTask && newTaskFreq === freq) && <p style={{ fontSize: 12, color: "#CCC", fontStyle: "italic", margin: "0 0 4px" }}>No {freq.toLowerCase()} tasks</p>}
                  {tasks.map((task, i) => (
                    <div key={i} style={{ marginBottom: 5 }}>
                      {editingTask?.roomId === editRoom.id && editingTask?.freq === freq && editingTask?.index === i ? (
                        <div style={{ padding: "10px 12px", background: fmr.bg, border: "1px solid "+fmr.border, borderRadius: 10 }}>
                          <input autoFocus value={newTaskText} onChange={e => setNewTaskText(e.target.value)} style={{ width: "100%", fontSize: 13, padding: "6px 8px", border: "1px solid "+fmr.border, borderRadius: 6, fontFamily: "inherit", marginBottom: 8, boxSizing: "border-box" }} />
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                            {FAMILY.map(m => (<button key={m.id} onClick={() => setNewTaskAssignees(prev => prev.includes(m.id) ? prev.filter(x => x !== m.id) : [...prev, m.id])} style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 12, border: "1px solid "+(newTaskAssignees.includes(m.id)?m.color:"#DDD"), background: newTaskAssignees.includes(m.id)?m.color+"22":"#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}><Avatar member={m} size={16} fontSize={8} /><span style={{ color: newTaskAssignees.includes(m.id)?m.color:"#777" }}>{m.name}</span></button>))}
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => { if (!newTaskText.trim()) return; const updated = (prev => { const snap = ensureSnapshot(editRoom.id, freq, prev); const arr = [...snap[editRoom.id][freq]]; arr[i] = { text: newTaskText.trim(), assignees: newTaskAssignees }; return { ...snap, [editRoom.id]: { ...snap[editRoom.id], [freq]: arr } }; })(customTasks); setCustomTasks(updated); saveCustomTasks(updated); setEditingTask(null); setNewTaskText(""); setNewTaskAssignees([]); }} style={{ flex: 1, padding: "7px", background: fmr.dot, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: "bold" }}>Save</button>
                            <button onClick={() => { setEditingTask(null); setNewTaskText(""); setNewTaskAssignees([]); }} style={{ padding: "7px 14px", background: "#fff", border: "1px solid #DDD", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, color: "#888" }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "#fff", border: "1px solid #E4E0D8", borderRadius: 10 }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 13 }}>{task.text}</p>
                            {task.assignees?.length > 0 && <div style={{ display: "flex", gap: 3, marginTop: 4 }}>{task.assignees.map(aid => { const m = FAMILY.find(f => f.id === aid); return m ? <Avatar key={aid} member={m} size={16} fontSize={8} /> : null; })}</div>}
                          </div>
                          <button onClick={() => { setEditingTask({ roomId: editRoom.id, freq, index: i }); setNewTaskText(task.text); setNewTaskAssignees(task.assignees || []); setShowAddTask(false); }} style={{ fontSize: 11, color: "#AAA", background: "none", border: "none", cursor: "pointer", padding: "4px 6px" }}>Edit</button>
                          <button onClick={() => { const updated = (prev => { const snap = ensureSnapshot(editRoom.id, freq, prev); return { ...snap, [editRoom.id]: { ...snap[editRoom.id], [freq]: snap[editRoom.id][freq].filter((_,idx) => idx !== i) } }; })(customTasks); setCustomTasks(updated); saveCustomTasks(updated); }} style={{ fontSize: 11, color: "#D47F6B", background: "none", border: "none", cursor: "pointer", padding: "4px 6px" }}>Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
