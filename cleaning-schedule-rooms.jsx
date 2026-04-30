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
  { id: "dad",   name: "Dad",   color: "#5B9BD5", avatar: { type: "emoji",  value: "\uD83D\uDC68" }, isKid: false, ownRoomId: null },
  { id: "mom",   name: "Mom",   color: "#D47F6B", avatar: { type: "emoji",  value: "\uD83D\uDC69" }, isKid: false, ownRoomId: null },
  { id: "zach",  name: "Zach",  color: "#6B7FD4", avatar: { type: "letter", value: "Z" }, isKid: true,  ownRoomId: "zach-room" },
  { id: "kyle",  name: "Kyle",  color: "#E8784A", avatar: { type: "letter", value: "K" }, isKid: true,  ownRoomId: "kyle-room" },
  { id: "lucas", name: "Lucas", color: "#3DAA6E", avatar: { type: "letter", value: "L" }, isKid: true,  ownRoomId: "lucas-room" },
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
      Monthly: [
        { text: "Vacuum or sweep floor", time: "6-15 min" },
        { text: "Dust surfaces & furniture", time: "6-15 min" },
        { text: "Empty trash bin", time: "0-5 min" },
        { text: "Clean window & sill", time: "6-15 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Dust blinds", time: "6-15 min" },
        { text: "Change & launder bed linens", time: "31 min - 1 hr" },
        { text: "Wash curtains", time: "1-2 hrs" },
        { text: "Declutter & donate unused items", time: "1-2 hrs" },
      ],
      Annually: [
        { text: "Deep clean carpets or rugs", time: "1-2 hrs" },
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "bsmt-bathroom", name: "Basement Bathroom", icon: "\uD83D\uDEBF", tasks: { Daily: [], Weekly: [],
      Monthly: [
        { text: "Scrub toilet (inside & outside)", time: "6-15 min" },
        { text: "Clean sink & countertop", time: "6-15 min" },
        { text: "Scrub tub or shower", time: "16-30 min" },
        { text: "Mop floor", time: "6-15 min" },
        { text: "Wipe mirror", time: "0-5 min" },
        { text: "Replace hand towel", time: "0-5 min" },
        { text: "Empty trash", time: "0-5 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Wipe cabinet fronts", time: "6-15 min" },
        { text: "Wash bath mat", time: "31 min - 1 hr" },
        { text: "Wash shower curtain or clean door", time: "16-30 min" },
        { text: "Declutter toiletries", time: "6-15 min" },
      ],
      Annually: [
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "bsmt-family", name: "Basement Family Room", icon: "\uD83C\uDFAE", tasks: {
      Daily: [
        { text: "Tidy up - return items to their place", time: "6-15 min" },
      ],
      Weekly: [],
      Monthly: [
        { text: "Vacuum or sweep floor", time: "6-15 min" },
        { text: "Dust surfaces, shelves & electronics", time: "16-30 min" },
        { text: "Empty trash", time: "0-5 min" },
        { text: "Vacuum upholstered furniture", time: "6-15 min" },
        { text: "Wipe down remote controls", time: "0-5 min" },
        { text: "Dust toys & shelving", time: "6-15 min" },
        { text: "Clean window & sill", time: "6-15 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Dust blinds", time: "6-15 min" },
        { text: "Wash throw blankets & pillow covers", time: "31 min - 1 hr" },
        { text: "Declutter games, toys & media", time: "31 min - 1 hr" },
      ],
      Annually: [
        { text: "Deep clean carpets or rugs", time: "1-2 hrs" },
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "bsmt-utility", name: "Utility Room", icon: "\uD83D\uDD27", tasks: {
      Daily: [], Weekly: [], Monthly: [],
      Quarterly: [
        { text: "Change furnace filter", time: "6-15 min" },
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
      ],
      Annually: [
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
  ]},
  { id: "first", label: "First Level", color: "#D47F6B", icon: "\uD83C\uDF73", rooms: [
    { id: "kitchen-dining", name: "Kitchen & Dining Area", icon: "\uD83C\uDF73", tasks: {
      Daily: [
        { text: "Clear countertops & table", time: "0-5 min" },
        { text: "Wipe countertops & stovetop", time: "6-15 min" },
        { text: "Wash dishes / run dishwasher", time: "6-15 min" },
        { text: "Put dishes away", time: "6-15 min" },
        { text: "Wipe sink & faucet", time: "0-5 min" },
        { text: "Wipe down kitchen table", time: "0-5 min" },
        { text: "Push in chairs", time: "0-5 min" },
        { text: "Empty trash & recycling", time: "0-5 min" },
        { text: "Clean up after meals & snacks - dishes in sink (Zach)", time: "0-5 min", assignees: ["zach"] },
        { text: "Clean up after meals & snacks - dishes in sink (Kyle)", time: "0-5 min", assignees: ["kyle"] },
      ],
      Weekly: [
        { text: "Mop floor", time: "16-30 min" },
        { text: "Clean microwave inside & out", time: "6-15 min" },
        { text: "Wipe small appliances", time: "6-15 min" },
        { text: "Wipe exterior of fridge, oven & dishwasher", time: "6-15 min" },
        { text: "Throw out old & expired food from refrigerator", time: "6-15 min" },
        { text: "Change dish towels", time: "0-5 min" },
        { text: "Wipe chair seats & backs", time: "6-15 min" },
        { text: "Clean sliding glass door", time: "6-15 min" },
      ],
      Monthly: [
        { text: "Clean refrigerator inside (wipe shelves & drawers)", time: "31 min - 1 hr" },
        { text: "Clean behind & under small appliances", time: "16-30 min" },
        { text: "Clean windows", time: "16-30 min" },
        { text: "Dust light fixture over table", time: "6-15 min" },
      ],
      Quarterly: [
        { text: "Wipe cabinet fronts & handles", time: "16-30 min" },
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Dust blinds", time: "6-15 min" },
        { text: "Deep clean oven", time: "1-2 hrs" },
        { text: "Organize pantry & check for expired items", time: "31 min - 1 hr" },
        { text: "Wash or replace dish rack", time: "6-15 min" },
        { text: "Deep clean chairs (scrub or wipe thoroughly)", time: "16-30 min" },
        { text: "Launder curtains", time: "1-2 hrs" },
      ],
      Annually: [
        { text: "Pull out fridge & clean behind", time: "31 min - 1 hr" },
        { text: "Deep clean all cabinets inside", time: "2-4 hrs" },
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "living", name: "Living Room", icon: "\uD83D\uDECB\uFE0F", tasks: {
      Daily: [
        { text: "Tidy up - put items away", time: "0-5 min" },
        { text: "Run robot vacuum on floor", time: "0-5 min" },
        { text: "Empty robot vacuum bin", time: "0-5 min" },
      ],
      Weekly: [],
      Monthly: [
        { text: "Dust surfaces, shelves, TV & decor", time: "16-30 min" },
        { text: "Vacuum upholstered furniture & under cushions", time: "16-30 min" },
        { text: "Clean windows", time: "16-30 min" },
        { text: "Wipe remotes & electronics", time: "6-15 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Dust ceiling fan", time: "6-15 min" },
        { text: "Dust blinds", time: "6-15 min" },
        { text: "Wash throw blankets & pillow covers", time: "31 min - 1 hr" },
        { text: "Move furniture to clean underneath", time: "16-30 min" },
        { text: "Launder curtains", time: "1-2 hrs" },
        { text: "Declutter shelves & decor", time: "31 min - 1 hr" },
      ],
      Annually: [
        { text: "Deep clean carpet or rugs", time: "1-2 hrs" },
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "main-bathroom", name: "Main Bathroom", icon: "\uD83D\uDEBD", tasks: {
      Daily: [
        { text: "Wipe sink & faucet", time: "0-5 min" },
      ],
      Weekly: [
        { text: "Scrub toilet (inside & outside)", time: "6-15 min" },
        { text: "Clean sink & countertop", time: "6-15 min" },
        { text: "Mop floor", time: "6-15 min" },
        { text: "Wipe mirror", time: "0-5 min" },
        { text: "Empty trash", time: "0-5 min" },
        { text: "Replace hand towel", time: "0-5 min" },
      ],
      Monthly: [
        { text: "Clean window & sill", time: "6-15 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Wipe cabinet fronts & shelves", time: "6-15 min" },
        { text: "Wash window treatment", time: "31 min - 1 hr" },
        { text: "Declutter medicine cabinet & toiletries", time: "6-15 min" },
      ],
      Annually: [
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "office", name: "Office", icon: "\uD83D\uDCBB", tasks: {
      Daily: [
        { text: "Clear desk of dishes & trash", time: "0-5 min" },
      ],
      Weekly: [
        { text: "Wipe desk surface", time: "0-5 min" },
      ],
      Monthly: [
        { text: "Dust desk, monitor & shelves", time: "16-30 min" },
        { text: "Dust keyboard, mouse & cords", time: "6-15 min" },
        { text: "Clean window", time: "6-15 min" },
        { text: "Organize paperwork & files", time: "16-30 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Dust ceiling fan", time: "6-15 min" },
        { text: "Dust blinds", time: "6-15 min" },
        { text: "Clean chair", time: "6-15 min" },
        { text: "Launder curtains", time: "1-2 hrs" },
        { text: "Declutter desk & shelves", time: "31 min - 1 hr" },
        { text: "Shred unnecessary documents", time: "16-30 min" },
      ],
      Annually: [
        { text: "Deep clean carpet or rugs", time: "1-2 hrs" },
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "entryway", name: "Entryway", icon: "\uD83D\uDEAA", tasks: {
      Daily: [
        { text: "Hang up coats, bags & shoes to their spots", time: "0-5 min" },
        { text: "Clear items from stairs", time: "0-5 min" },
      ],
      Weekly: [
        { text: "Mop floor", time: "6-15 min" },
        { text: "Organize shoes & jackets", time: "6-15 min" },
      ],
      Monthly: [
        { text: "Dust furniture & decor", time: "6-15 min" },
        { text: "Vacuum stairs", time: "6-15 min" },
        { text: "Clean light fixture", time: "6-15 min" },
        { text: "Clean window & sill", time: "6-15 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Wipe front door inside & out", time: "6-15 min" },
        { text: "Wipe baseboards & door frame", time: "6-15 min" },
        { text: "Dust blinds", time: "6-15 min" },
        { text: "Deep clean door mat", time: "6-15 min" },
        { text: "Declutter coats & shoes for season", time: "16-30 min" },
      ],
      Annually: [
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
  ]},
  { id: "top", label: "Top Level", color: "#6DB894", icon: "\uD83D\uDECC", rooms: [
    { id: "master-bed", name: "Master Bedroom", icon: "\uD83D\uDC51", tasks: {
      Daily: [
        { text: "Make bed", time: "0-5 min" },
        { text: "Put clothes away or in hamper", time: "0-5 min" },
        { text: "Clear room of dirty dishes", time: "0-5 min" },
      ],
      Weekly: [
        { text: "Run robot vacuum on floor", time: "0-5 min" },
        { text: "Empty robot vacuum bin", time: "0-5 min" },
        { text: "Change bed linens", time: "16-30 min" },
      ],
      Monthly: [
        { text: "Dust surfaces & furniture", time: "16-30 min" },
        { text: "Clean windows", time: "16-30 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Dust ceiling fan", time: "6-15 min" },
        { text: "Dust blinds", time: "6-15 min" },
        { text: "Launder curtains", time: "1-2 hrs" },
        { text: "Declutter closet", time: "1-2 hrs" },
      ],
      Annually: [
        { text: "Deep clean carpets or rugs", time: "1-2 hrs" },
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "master-bath", name: "Master Bathroom", icon: "\uD83D\uDEC1", tasks: {
      Daily: [],
      Weekly: [
        { text: "Clean toilet", time: "6-15 min" },
        { text: "Clean sink & countertop", time: "6-15 min" },
        { text: "Clean mirror", time: "0-5 min" },
        { text: "Scrub shower", time: "16-30 min" },
        { text: "Mop floor", time: "6-15 min" },
        { text: "Replace hand towel", time: "0-5 min" },
      ],
      Monthly: [
        { text: "Scrub tub / shower deeply", time: "16-30 min" },
        { text: "Wash bath mat", time: "31 min - 1 hr" },
        { text: "Clean window & sill", time: "6-15 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Wipe cabinet fronts", time: "6-15 min" },
        { text: "Dust blinds", time: "6-15 min" },
        { text: "Wash window treatment", time: "31 min - 1 hr" },
      ],
      Annually: [
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "zach-room", name: "Zach's Bedroom", icon: { type: "letter", value: "Z", color: "#6B7FD4" }, tasks: {
      Daily: [
        { text: "Make bed", time: "0-5 min" },
        { text: "Put clothes away or in hamper", time: "0-5 min" },
        { text: "Clear room of dirty dishes", time: "0-5 min" },
      ],
      Weekly: [
        { text: "Change bed linens", time: "16-30 min" },
        { text: "Empty trash bin", time: "0-5 min" },
      ],
      Monthly: [
        { text: "Dust desk, shelves & electronics", time: "16-30 min" },
        { text: "Clean windows & window sills", time: "16-30 min" },
        { text: "Organize desk & shelves", time: "16-30 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switch", time: "16-30 min" },
        { text: "Dust ceiling fan", time: "6-15 min" },
        { text: "Dust blinds", time: "6-15 min" },
        { text: "Clean computer tower", time: "6-15 min" },
        { text: "Declutter clothes, games & items", time: "1-2 hrs" },
      ],
      Annually: [
        { text: "Deep clean carpets or rugs", time: "1-2 hrs" },
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "kyle-room", name: "Kyle's Bedroom", icon: { type: "letter", value: "K", color: "#E8784A" }, tasks: {
      Daily: [
        { text: "Make bed", time: "0-5 min" },
        { text: "Put clothes away or in hamper", time: "0-5 min" },
        { text: "Clear room of dirty dishes", time: "0-5 min" },
      ],
      Weekly: [
        { text: "Change bed linens", time: "16-30 min" },
        { text: "Empty trash bin", time: "0-5 min" },
      ],
      Monthly: [
        { text: "Dust desk, shelves & electronics", time: "16-30 min" },
        { text: "Clean windows & window sills", time: "16-30 min" },
        { text: "Organize desk & shelves", time: "16-30 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switch", time: "16-30 min" },
        { text: "Dust ceiling fan", time: "6-15 min" },
        { text: "Dust blinds", time: "6-15 min" },
        { text: "Clean computer tower", time: "6-15 min" },
        { text: "Declutter clothes & items", time: "1-2 hrs" },
      ],
      Annually: [
        { text: "Deep clean carpets or rugs", time: "1-2 hrs" },
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "lucas-room", name: "Lucas's Bedroom", icon: { type: "letter", value: "L", color: "#3DAA6E" }, tasks: {
      Daily: [
        { text: "Tidy toys and books", time: "0-5 min" },
        { text: "Make bed (assisted)", time: "0-5 min" },
        { text: "Put clothes away or in hamper", time: "0-5 min" },
      ],
      Weekly: [
        { text: "Change bed linens", time: "16-30 min" },
      ],
      Monthly: [
        { text: "Dust desk, shelves & electronics", time: "16-30 min" },
        { text: "Clean windows & window sills", time: "16-30 min" },
        { text: "Sanitize frequently touched toys", time: "16-30 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switch", time: "16-30 min" },
        { text: "Dust ceiling fan", time: "6-15 min" },
        { text: "Dust blinds", time: "6-15 min" },
        { text: "Declutter outgrown toys & clothes", time: "1-2 hrs" },
      ],
      Annually: [
        { text: "Deep clean carpets or rugs", time: "1-2 hrs" },
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "kids-bathroom", name: "Kids Bathroom", icon: "\uD83D\uDEC1", tasks: {
      Daily: [
        { text: "Wipe sink after use (Zach)", time: "0-5 min" },
        { text: "Wipe sink after use (Kyle)", time: "0-5 min" },
        { text: "Tidy bathroom - pick up laundry from floor", time: "0-5 min" },
      ],
      Weekly: [
        { text: "Scrub toilet (inside & outside)", time: "6-15 min" },
        { text: "Clean sink & countertop", time: "6-15 min" },
        { text: "Scrub tub or shower", time: "16-30 min" },
        { text: "Mop floor", time: "6-15 min" },
        { text: "Wipe mirror", time: "0-5 min" },
        { text: "Empty trash", time: "0-5 min" },
        { text: "Replace hand towel", time: "0-5 min" },
      ],
      Monthly: [
        { text: "Wash bath mat", time: "31 min - 1 hr" },
        { text: "Organize kids toiletries & products", time: "6-15 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Wipe cabinet fronts", time: "6-15 min" },
        { text: "Wash shower curtain & liner", time: "31 min - 1 hr" },
        { text: "Declutter expired or unused products", time: "6-15 min" },
      ],
      Annually: [
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "laundry", name: "Laundry Room", icon: "\uD83D\uDC55", tasks: {
      Daily: [
        { text: "Move laundry along (wash, dry, fold, put away)", time: "16-30 min" },
      ],
      Weekly: [
        { text: "Wipe down washer & dryer exterior", time: "6-15 min" },
        { text: "Mop floor", time: "6-15 min" },
        { text: "Wipe surfaces", time: "0-5 min" },
      ],
      Monthly: [],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Deep clean dryer vent duct", time: "31 min - 1 hr" },
        { text: "Declutter laundry supplies", time: "6-15 min" },
        { text: "Check hoses for leaks or wear", time: "6-15 min" },
      ],
      Annually: [
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
    { id: "loft", name: "Loft / Hallway", icon: "\uD83D\uDEB6", tasks: {
      Daily: [
        { text: "Clear any items left in hallway", time: "0-5 min" },
      ],
      Weekly: [
        { text: "Sweep or vacuum floor", time: "6-15 min" },
      ],
      Monthly: [
        { text: "Dust furniture & decor", time: "6-15 min" },
      ],
      Quarterly: [
        { text: "Wipe baseboards & light switches", time: "16-30 min" },
        { text: "Declutter any stored items", time: "16-30 min" },
      ],
      Annually: [
        { text: "Deep clean carpet & stairs", time: "1-2 hrs" },
        { text: "Wipe walls", time: "31 min - 1 hr" },
      ] }},
  ]},
  { id: "yard", label: "Yard", color: "#5A9E4B", icon: "\uD83C\uDF3F", rooms: [
    { id: "yard-main", name: "Yard (Apr - Oct)", icon: "\uD83C\uDF3F", tasks: {
      Daily: [],
      Weekly: [
        { text: "Clean up dog poop", time: "6-15 min" },
        { text: "Mow & trim grass", time: "31 min - 1 hr" },
        { text: "Weed garden", time: "16-30 min" },
        { text: "Spray weeds", time: "6-15 min" },
      ],
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

const TASK_POINTS = {
  "0-5 min":        1,
  "6-15 min":       2,
  "16-30 min":      3,
  "31 min - 1 hr":  5,
  "1-2 hrs":        8,
  "2-4 hrs":        12,
  "4+ hrs":         18,
};

function taskPoints(task) {
  return TASK_POINTS[task?.time] || 1;
}

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

function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

function today() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

const selectStyle = {
  fontSize: 13, padding: "8px 10px", border: "1px solid #DDD8CE", borderRadius: 8,
  fontFamily: "Georgia, serif", background: "#fff", color: "#1A1A1A",
  width: "100%", boxSizing: "border-box", appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", paddingRight: 30,
};

const labelStyle = { fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", display: "block" };

// ─── STATUS VIEW COMPONENT ────────────────────────────────────────────────────
function StatusView({ completions, allArchiveData, getTaskList, allRooms, levels, expandedCard, setExpandedCard, Avatar, RoomIcon, FAMILY }) {
  const now = new Date();

  // Time boundaries
  const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
  const todayEnd = new Date(now); todayEnd.setHours(23,59,59,999);
  const weekDay = now.getDay();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - weekDay); weekStart.setHours(0,0,0,0);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6); weekEnd.setHours(23,59,59,999);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth()+1, 0, 23,59,59,999);

  // For each frequency, only look at completions within the natural reset window
  // Daily = today, Weekly = this week, Monthly = this month, Quarterly/Annually = this year
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear(), 11, 31, 23,59,59,999);

  function windowForFreq(freq) {
    if (freq === "Daily") return { from: todayStart.getTime(), to: todayEnd.getTime() };
    if (freq === "Weekly") return { from: weekStart.getTime(), to: weekEnd.getTime() };
    if (freq === "Monthly") return { from: monthStart.getTime(), to: monthEnd.getTime() };
    return { from: yearStart.getTime(), to: yearEnd.getTime() };
  }

  // Build completion lookup: baseKey -> completion object
  // baseKey = roomId-freq-taskIndex (strip member suffix if present)
  const completionMap = {};
  Object.entries(completions).forEach(([key, c]) => {
    if (!c || !c.at || !c.freq) return;
    const room = allRooms.find(r => key.startsWith(r.id + "-"));
    if (!room) return;
    const afterRoom = key.slice(room.id.length + 1);
    const afterFreq = afterRoom.slice(c.freq.length + 1);
    const taskIndex = parseInt(afterFreq.split("-")[0]);
    if (isNaN(taskIndex)) return;
    const win = windowForFreq(c.freq);
    if (c.at < win.from || c.at > win.to) return;
    const baseKey = room.id + "-" + c.freq + "-" + taskIndex;
    if (!completionMap[baseKey] || c.at > completionMap[baseKey].at) {
      completionMap[baseKey] = c;
    }
  });

  // ── 7-day rolling daily completion data ─────────────────────────────────
  // Build per-day completion maps from both live + archive data
  const sevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i)); // oldest first
    d.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999);
    return { date: d, dayEnd, label: i === 6 ? "Today" : d.toLocaleDateString([], { weekday: "short" }), dateStr: d.toDateString() };
  });

  // Total daily tasks (same every day)
  let dailyTotal = 0;
  allRooms.forEach(room => { dailyTotal += getTaskList(room.id, "Daily").length; });

  // Count completions per day across all sources
  const dailyDoneCounts = sevenDays.map(() => new Set());

  function scanForSevenDay(obj) {
    Object.entries(obj).forEach(([key, c]) => {
      if (!c || !c.at || c.freq !== "Daily") return;
      const room = allRooms.find(r => key.startsWith(r.id + "-"));
      if (!room) return;
      const afterRoom = key.slice(room.id.length + 1);
      const afterFreq = afterRoom.slice("Daily".length + 1);
      const taskIndex = parseInt(afterFreq.split("-")[0]);
      if (isNaN(taskIndex)) return;
      const baseKey = room.id + "-Daily-" + taskIndex;
      const cDate = new Date(c.at).toDateString();
      sevenDays.forEach((day, i) => {
        if (cDate === day.dateStr) dailyDoneCounts[i].add(baseKey);
      });
    });
  }

  scanForSevenDay(completions);
  Object.values(allArchiveData || {}).forEach(d => scanForSevenDay(d));

  const sevenDayData = sevenDays.map((day, i) => ({
    ...day,
    done: dailyDoneCounts[i].size,
    pct: dailyTotal > 0 ? Math.min(100, Math.round(dailyDoneCounts[i].size / dailyTotal * 100)) : 0,
  }));

  // Compute stats for a given set of frequencies
  function computeStats(freqList) {
    let total = 0, done = 0;
    const byLevel = {};
    const byRoom = {};

    levels.forEach(lv => {
      let lvTotal = 0, lvDone = 0;
      lv.rooms.forEach(room => {
        let rTotal = 0, rDone = 0;
        freqList.forEach(freq => {
          const tasks = getTaskList(room.id, freq);
          tasks.forEach((t, i) => {
            rTotal++;
            const baseKey = room.id + "-" + freq + "-" + i;
            if (completionMap[baseKey]) rDone++;
          });
        });
        if (rTotal > 0) byRoom[room.id] = { name: room.name, icon: room.icon, total: rTotal, done: rDone, levelColor: lv.color };
        lvTotal += rTotal;
        lvDone += rDone;
        total += rTotal;
        done += rDone;
      });
      if (lvTotal > 0) byLevel[lv.id] = { label: lv.label, icon: lv.icon, color: lv.color, total: lvTotal, done: lvDone };
    });

    return { total, done: Math.min(done, total), byLevel, byRoom };
  }

  const freqCards = [
    { id: "daily",     label: "Daily",     freq: ["Daily"],     color: "#E8C547", period: now.toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"}), sevenDayData },
    { id: "weekly",    label: "Weekly",    freq: ["Weekly"],    color: "#5B9BD5", period: weekStart.toLocaleDateString([],{month:"short",day:"numeric"})+" - "+weekEnd.toLocaleDateString([],{month:"short",day:"numeric"}) },
    { id: "monthly",   label: "Monthly",   freq: ["Monthly"],   color: "#6DB894", period: now.toLocaleDateString([],{month:"long",year:"numeric"}) },
    { id: "quarterly", label: "Quarterly", freq: ["Quarterly"], color: "#A67DC4", period: "Q"+Math.ceil((now.getMonth()+1)/3)+" "+now.getFullYear() },
    { id: "annually",  label: "Annual",    freq: ["Annually"],  color: "#D4445A", period: now.getFullYear().toString() },
  ];

  return (
    <div style={{ padding: "14px 14px 60px", background: "#F5F2EC", minHeight: "100vh" }}>
      <p style={{ margin: "0 0 14px", fontSize: 10, color: "#AAA", fontStyle: "italic" }}>Tap any card to see level and room breakdown</p>

      {freqCards.map(card => {
        const stats = computeStats(card.freq);
        const pct = stats.total ? Math.min(100, Math.round(stats.done / stats.total * 100)) : 0;
        const isExpanded = expandedCard === card.id;

        return (
          <div key={card.id} style={{ marginBottom: 12, borderRadius: 14, overflow: "hidden", border: "1px solid " + card.color + "55", background: "#fff" }}>
            {/* Card header — always visible */}
            <div onClick={() => setExpandedCard(isExpanded ? null : card.id)} style={{ padding: "14px 16px", cursor: "pointer", background: isExpanded ? card.color + "12" : "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: "bold", color: "#1A1A1A" }}>{card.label}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 10, color: "#AAA" }}>{card.period}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: 28, fontWeight: "bold", color: card.color, lineHeight: 1 }}>{pct}%</p>
                  <p style={{ margin: "2px 0 0", fontSize: 10, color: "#AAA" }}>{stats.done} of {stats.total} tasks</p>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 8, background: "#F0EDE6", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct + "%", background: card.color, borderRadius: 4, transition: "width 0.4s" }} />
              </div>

              {/* 7-day rolling chart — daily card only */}
              {card.id === "daily" && card.sevenDayData && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.06em" }}>Last 7 Days</p>
                  <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
                    {card.sevenDayData.map((day, i) => {
                      const isToday = i === 6;
                      const isEmpty = day.pct === 0;
                      const isFull = day.pct === 100;
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          {/* Percentage label */}
                          <span style={{ fontSize: 9, fontWeight: "bold", color: isEmpty ? "#CCC" : isFull ? card.color : "#888" }}>
                            {isEmpty ? "" : day.pct + "%"}
                          </span>
                          {/* Bar */}
                          <div style={{ width: "100%", height: 48, background: "#F0EDE6", borderRadius: 5, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                            <div style={{
                              width: "100%",
                              height: day.pct + "%",
                              background: isFull ? card.color : isToday ? card.color + "AA" : card.color + "66",
                              borderRadius: 5,
                              transition: "height 0.4s",
                              minHeight: day.pct > 0 ? 4 : 0,
                            }} />
                          </div>
                          {/* Day label */}
                          <span style={{ fontSize: 9, color: isToday ? "#1A1A1A" : "#AAA", fontWeight: isToday ? "bold" : "normal", whiteSpace: "nowrap" }}>
                            {day.label}
                          </span>
                          {/* Done/total below label */}
                          <span style={{ fontSize: 8, color: "#CCC" }}>
                            {day.done}/{dailyTotal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <span style={{ fontSize: 10, color: isExpanded ? card.color : "#CCC" }}>{isExpanded ? "▲ Less" : "▼ Details"}</span>
              </div>
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div style={{ borderTop: "1px solid " + card.color + "33", padding: "14px 16px", background: card.color + "06" }}>

                {/* By Level */}
                <p style={{ margin: "0 0 10px", fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.08em" }}>By Floor</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                  {Object.values(stats.byLevel).map(lv => {
                    const lvPct = lv.total ? Math.min(100, Math.round(lv.done / lv.total * 100)) : 0;
                    return (
                      <div key={lv.label}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 13 }}>{lv.icon}</span>
                            <span style={{ fontSize: 12, fontWeight: "bold", color: lv.color }}>{lv.label}</span>
                          </div>
                          <span style={{ fontSize: 11, color: "#888" }}>{lv.done}/{lv.total} &nbsp;<span style={{ color: lv.color, fontWeight: "bold" }}>{lvPct}%</span></span>
                        </div>
                        <div style={{ height: 6, background: "#F0EDE6", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: lvPct + "%", background: lv.color, borderRadius: 3, transition: "width 0.4s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* By Room */}
                <p style={{ margin: "0 0 10px", fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.08em" }}>By Room</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {Object.values(stats.byRoom)
                    .filter(r => r.total > 0)
                    .sort((a,b) => (b.done/b.total) - (a.done/a.total))
                    .map(room => {
                      const rPct = Math.min(100, Math.round(room.done / room.total * 100));
                      const roomData = allRooms.find(r => r.name === room.name);
                      return (
                        <div key={room.name}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              {roomData && <RoomIcon icon={roomData.icon} size={13} />}
                              <span style={{ fontSize: 11, color: "#555" }}>{room.name}</span>
                            </div>
                            <span style={{ fontSize: 10, color: "#888" }}>{room.done}/{room.total} &nbsp;<span style={{ color: rPct === 100 ? "#6DB894" : room.levelColor, fontWeight: "bold" }}>{rPct}%</span></span>
                          </div>
                          <div style={{ height: 4, background: "#F0EDE6", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: rPct + "%", background: rPct === 100 ? "#6DB894" : room.levelColor, borderRadius: 3, transition: "width 0.4s" }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


export default function CleaningSchedule() {
  const [activeFreq, setActiveFreq] = useState("Daily");
  const [activeMember, setActiveMember] = useState(FAMILY[0]);
  const [haUserDetected, setHaUserDetected] = useState(false);

  // Auto-select family member. Priority:
  // 1. URL param ?user=zach  (most reliable for HA iframes/webapps — set this in your HA dashboard URL)
  // 2. HA JS API (custom panels)
  // 3. HA REST API (same-origin)
  // 4. postMessage (iframe)
  // Falls back to Dad if nothing matches.
  useEffect(() => {
    function matchAndSet(nameOrId) {
      if (!nameOrId) return false;
      const lower = nameOrId.toLowerCase().trim();
      const match = FAMILY.find(m =>
        m.id === lower || m.name.toLowerCase() === lower || lower.includes(m.name.toLowerCase())
      );
      if (match) { setActiveMember(match); setHaUserDetected(true); return true; }
      return false;
    }

    // 1. URL param — easiest for HA: set the app URL to https://yourapp.vercel.app?user=zach
    const urlParam = new URLSearchParams(window.location.search).get("user");
    if (urlParam && matchAndSet(urlParam)) return;

    // 2–4. HA async detection
    (async () => {
      try {
        if (window.hassConnection) {
          const conn = await window.hassConnection;
          const user = await conn.sendMessagePromise({ type: "auth/current_user" });
          if (matchAndSet(user?.name || user?.username || "")) return;
        }
      } catch (_) {}
      try {
        const res = await fetch("/auth/current_user", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (matchAndSet(data?.name || data?.username || "")) return;
        }
      } catch (_) {}
      try {
        window.parent.postMessage({ type: "get_current_user" }, "*");
        await new Promise(resolve => {
          const h = (e) => {
            if (e.data?.type === "current_user_response" && e.data?.user) {
              matchAndSet(e.data.user.name || e.data.user.username || "");
              window.removeEventListener("message", h); resolve();
            }
          };
          window.addEventListener("message", h);
          setTimeout(() => { window.removeEventListener("message", h); resolve(); }, 2000);
        });
      } catch (_) {}
      setHaUserDetected(true);
    })();
  }, []);
  const [completions, setCompletions] = useState({});
  const [collapsed, setCollapsed] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("tasks");
  const [taskLayout, setTaskLayout] = useState("frequency");
  const [activeRoom, setActiveRoom] = useState(levels[0].rooms[0]);
  const [editLevel, setEditLevel] = useState(levels[0]);
  const [editRoom, setEditRoom] = useState(levels[0].rooms[0]);
  const [editSubMode, setEditSubMode] = useState("tasks");
  const [editTaskLayout, setEditTaskLayout] = useState("room");
  const [backdateSelectedDay, setBackdateSelectedDay] = useState(new Date().toDateString());
  const [customTasks, setCustomTasks] = useState({});
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskFreq, setNewTaskFreq] = useState("Daily");
  const [newTaskAssignees, setNewTaskAssignees] = useState([]);
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskEditFreq, setNewTaskEditFreq] = useState("Daily");
  const [showAddTask, setShowAddTask] = useState(false);
  const [allArchiveData, setAllArchiveData] = useState({});
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [reportType, setReportType] = useState("daily");
  const [reportDateFrom, setReportDateFrom] = useState(daysAgo(7));
  const [reportDateTo, setReportDateTo] = useState(today());
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterRoom, setFilterRoom] = useState("all");
  const [filterFreq, setFilterFreq] = useState("all");
  const [filterCompleted, setFilterCompleted] = useState("all");
  const [filterAssigned, setFilterAssigned] = useState("all");
  const [reportResults, setReportResults] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedLeaderWeek, setExpandedLeaderWeek] = useState(null);
  const [expandedLeaderMonth, setExpandedLeaderMonth] = useState(null);
  const [allowanceData, setAllowanceData] = useState({});  // { memberId: { balance, history: [{amount, date, note}] } }
  const [allowanceLoaded, setAllowanceLoaded] = useState(false);
  const [adjAmounts, setAdjAmounts] = useState({});
  const [adjNotes, setAdjNotes] = useState({});
  const [historyExpanded, setHistoryExpanded] = useState({});
  const [notifyConfig, setNotifyConfig] = useState(null); // loaded from Firebase
  const [notifyConfigLoaded, setNotifyConfigLoaded] = useState(false);
  const [notifyTestStatus, setNotifyTestStatus] = useState({});

  const writingRef = useRef(false);
  const isKidMode = activeMember.isKid;
  const fm = freqMeta[activeFreq];

  // ── Kid visibility: own room always visible; other rooms only if explicitly assigned ──
  function isVisibleToKid(task, roomId, member) {
    if (!member.isKid) return true;
    // Tasks with "(Name)" suffix are auto-assigned to that kid only
    const nameTag = task.text.match(/\((\w+)\)$/);
    if (nameTag) return nameTag[1].toLowerCase() === member.name.toLowerCase();
    // Always show all tasks in their own bedroom
    if (roomId === member.ownRoomId) return true;
    // Show tasks elsewhere only if explicitly assigned
    return (task.assignees || []).includes(member.id);
  }

  function getTaskList(roomId, freq) {
    if (customTasks[roomId]?.[freq] !== undefined) {
      // Guard against corrupted entries where task.text is itself an object
      return customTasks[roomId][freq].map(t => {
        if (!t || typeof t !== "object") return { text: String(t || ""), assignees: [], time: "" };
        // If text field is itself an object (from old bug), extract it
        if (typeof t.text === "object" && t.text !== null) {
          return { assignees: [], time: "", ...t.text, assignees: t.assignees || [], time: t.time || t.text.time || "" };
        }
        return { assignees: [], time: "", ...t };
      }).filter(t => t.text && typeof t.text === "string" && t.text.trim() !== "");
    }
    const room = allRooms.find(r => r.id === roomId);
    return (room?.tasks[freq] || []).map(t =>
      typeof t === "string" ? { text: t, assignees: [], time: "" } : { assignees: [], time: "", ...t }
    );
  }

  function getVisibleTasks(roomId, freq) {
    const tasks = getTaskList(roomId, freq);
    if (!isKidMode) return tasks;
    return tasks.filter(t => isVisibleToKid(t, roomId, activeMember));
  }

  function ensureSnapshot(roomId, freq, prev) {
    if (prev[roomId]?.[freq] !== undefined) return prev;
    const room = allRooms.find(r => r.id === roomId);
    const base = (room?.tasks[freq] || []).map(t =>
      typeof t === "string" ? { text: t, assignees: [], time: "" } : { assignees: [], time: "", ...t }
    );
    return { ...prev, [roomId]: { ...(prev[roomId] || {}), [freq]: base } };
  }

  useEffect(() => { if (isKidMode && view === "edit") setView("tasks"); }, [isKidMode, view]);

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

  useEffect(() => {
    let initialized = false;
    const unsub = dbListen("completions", async (result) => {
      if (writingRef.current) return;
      if (result?.value) {
        const raw = JSON.parse(result.value);
        if (!initialized) { initialized = true; const pruned = await pruneAndArchive(raw); setCompletions(pruned); }
        else setCompletions(raw);
      } else { initialized = true; }
      setLoading(false);
    });
    return () => unsub();
  }, [pruneAndArchive]);

  useEffect(() => {
    const unsub = dbListen("customTasks", (result) => {
      if (writingRef.current) return;
      if (result?.value) {
        const raw = JSON.parse(result.value);
        // Sanitize: fix any corrupted task entries where task.text is an object
        let dirty = false;
        const cleaned = {};
        Object.entries(raw).forEach(([roomId, freqMap]) => {
          cleaned[roomId] = {};
          Object.entries(freqMap).forEach(([freq, tasks]) => {
            cleaned[roomId][freq] = (tasks || []).map(t => {
              if (!t || typeof t !== "object") { dirty = true; return null; }
              if (typeof t.text === "object" && t.text !== null) {
                dirty = true;
                return { text: t.text.text || "", assignees: t.assignees || [], time: t.time || t.text.time || "" };
              }
              return t;
            }).filter(t => t && typeof t.text === "string" && t.text.trim() !== "");
          });
        });
        setCustomTasks(cleaned);
        if (dirty) {
          writingRef.current = true;
          dbSet("customTasks", JSON.stringify(cleaned)).then(() => {
            setTimeout(() => { writingRef.current = false; }, 500);
          });
        }
      }
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

  const saveAllowance = useCallback(async (data) => {
    await dbSet("allowance", JSON.stringify(data));
  }, []);

  // Load allowance from Firebase
  useEffect(() => {
    const unsub = dbListen("allowance", (result) => {
      if (result?.value) {
        const raw = JSON.parse(result.value);
        // Migrate old earn entries that lack dayKey — infer from date field
        let needsSave = false;
        Object.keys(raw).forEach(kidId => {
          const kid = raw[kidId];
          if (!kid.history) return;
          kid.history = kid.history.map(h => {
            if (h.type === "earn" && !h.dayKey && h.date) {
              needsSave = true;
              return { ...h, dayKey: getPeriodKey("Daily", new Date(h.date)) };
            }
            return h;
          });
        });
        setAllowanceData(raw);
        if (needsSave) dbSet("allowance", JSON.stringify(raw));
      }
      setAllowanceLoaded(true);
    });
    return () => unsub();
  }, []);

  // Load notification config from Firebase
  useEffect(() => {
    const unsub = dbListen("notifyConfig", (result) => {
      if (result?.value) setNotifyConfig(JSON.parse(result.value));
      else setNotifyConfig({
        haToken: "",
        haUrl: window.location.origin.includes("localhost") ? "http://homeassistant.local:8123" : window.location.origin,
        kids: {
          zach:  { enabled: false, kidTarget: "", parentTarget: "", notifyKid: false, notifyParent: true, time: "19:00", days: [0,1,2,3,4,5,6] },
          kyle:  { enabled: false, kidTarget: "", parentTarget: "", notifyKid: false, notifyParent: true, time: "19:00", days: [0,1,2,3,4,5,6] },
        },
        sentToday: {},
      });
      setNotifyConfigLoaded(true);
    });
    return () => unsub();
  }, []);

  const saveNotifyConfig = async (cfg) => {
    setNotifyConfig(cfg);
    await dbSet("notifyConfig", JSON.stringify(cfg));
  };

  // Background notification check — runs every 60 seconds
  useEffect(() => {
    if (!notifyConfigLoaded || !notifyConfig?.haToken) return;

    const check = async () => {
      const now = new Date();
      const todayKey = getPeriodKey("Daily");
      const dayOfWeek = now.getDay();
      const hhmm = String(now.getHours()).padStart(2,"0") + ":" + String(now.getMinutes()).padStart(2,"0");

      const allowanceKids = FAMILY.filter(f => f.id === "zach" || f.id === "kyle");
      for (const kid of allowanceKids) {
        const cfg = notifyConfig.kids?.[kid.id];
        if (!cfg?.enabled) continue;
        if (!cfg.days.includes(dayOfWeek)) continue;
        if (hhmm !== cfg.time) continue;

        // Already sent today?
        const sentKey = kid.id + "-" + todayKey;
        if (notifyConfig.sentToday?.[sentKey]) continue;

        // Check incomplete tasks
        const incomplete = [];
        allRooms.forEach(room => {
          const tasks = getTaskList(room.id, "Daily");
          tasks.forEach((task, i) => {
            const nameTag = task.text.match(/\((\w+)\)$/);
            if (nameTag && nameTag[1].toLowerCase() !== kid.name.toLowerCase()) return;
            if (!nameTag && !(room.id === kid.ownRoomId || (task.assignees||[]).includes(kid.id))) return;
            const baseKey = room.id + "-Daily-" + i;
            const kidKey = baseKey + "-" + kid.id;
            if (!completions[kidKey] && !completions[baseKey]) {
              incomplete.push(task.text.replace(/\s*\(\w+\)$/, ""));
            }
          });
        });

        if (incomplete.length === 0) continue;

        // Send notification(s)
        const message = kid.name + " has " + incomplete.length + " daily task" + (incomplete.length === 1 ? "" : "s") + " not done:\n• " + incomplete.slice(0, 5).join("\n• ") + (incomplete.length > 5 ? "\n• +" + (incomplete.length - 5) + " more" : "");
        const haBase = (cfg.haUrl || notifyConfig.haUrl || "").replace(/\/$/, "");
        const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + notifyConfig.haToken };
        const body = JSON.stringify({ message, title: "Chores Reminder 🧹" });

        try {
          if (cfg.notifyKid && cfg.kidTarget) {
            await fetch(haBase + "/api/services/notify/" + cfg.kidTarget.replace("notify.", ""), { method: "POST", headers, body });
          }
          if (cfg.notifyParent && cfg.parentTarget) {
            const parentTargets = cfg.parentTarget.split("\n").map(t => t.trim()).filter(Boolean);
            for (const t of parentTargets) {
              await fetch(haBase + "/api/services/notify/" + t.replace("notify.", ""), { method: "POST", headers, body });
            }
          }
          // Mark as sent
          const updated = { ...notifyConfig, sentToday: { ...(notifyConfig.sentToday || {}), [sentKey]: Date.now() } };
          saveNotifyConfig(updated);
        } catch (_) {}
      }
    };

    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [notifyConfig, notifyConfigLoaded, completions]);

  // Recalculate allowance whenever completions change.
  // For each kid, for each of the past 7 days:
  //   - All daily tasks done → ensure a $2 earn entry exists for that day
  //   - NOT all done → remove any earn entry for that day (revoke award)
  useEffect(() => {
    if (!allowanceLoaded) return;
    const allowanceKids = FAMILY.filter(f => f.id === "zach" || f.id === "kyle");

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(12, 0, 0, 0);
      days.push({ date: d, periodKey: getPeriodKey("Daily", d) });
    }

    function countDailyForKidOnDate(kid, dateObj) {
      const dateStr = dateObj.toDateString();
      let total = 0, done = 0;
      allRooms.forEach(room => {
        const tasks = getTaskList(room.id, "Daily");
        const kidTasks = tasks.filter(t => {
          const nameTag = t.text.match(/\((\w+)\)$/);
          if (nameTag) return nameTag[1].toLowerCase() === kid.name.toLowerCase();
          if (room.id === kid.ownRoomId) return true;
          return (t.assignees || []).includes(kid.id);
        });
        kidTasks.forEach(t => {
          const fi = tasks.findIndex(ft => ft.text === t.text);
          if (fi === -1) return;
          total++;
          const baseKey = room.id + "-Daily-" + fi;
          const kidKey = baseKey + "-" + kid.id;
          const completedOnDay = [completions[kidKey], completions[baseKey]]
            .some(c => c && c.at && new Date(c.at).toDateString() === dateStr);
          if (completedOnDay) done++;
        });
      });
      return { total, done };
    }

    setAllowanceData(prev => {
      let changed = false;
      const next = { ...prev };

      allowanceKids.forEach(kid => {
        const current = next[kid.id] || { balance: 0, history: [] };
        let history = [...(current.history || [])];
        let balance = current.balance || 0;
        let lastAwardedDay = current.lastAwardedDay;

        days.forEach(({ date, periodKey }) => {
          const { total, done } = countDailyForKidOnDate(kid, date);
          const allDone = total > 0 && done === total;
          const earnIdx = history.findIndex(h => h.type === "earn" && h.dayKey === periodKey);
          const hasEarn = earnIdx !== -1;

          if (allDone && !hasEarn) {
            const earnDate = date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
            history = [...history, {
              type: "earn", amount: 2,
              date: date.getTime(),
              dayKey: periodKey,
              note: "$2 earned · All daily tasks completed · " + earnDate,
            }];
            balance += 2;
            if (periodKey === getPeriodKey("Daily")) lastAwardedDay = periodKey;
            changed = true;
          } else if (!allDone && hasEarn) {
            balance = Math.max(0, balance - history[earnIdx].amount);
            history = history.filter((_, i) => i !== earnIdx);
            if (lastAwardedDay === periodKey) lastAwardedDay = null;
            changed = true;
          }
        });

        if (changed) {
          next[kid.id] = { ...current, balance: Math.max(0, balance), history, lastAwardedDay };
        }
      });

      if (changed) { saveAllowance(next); return next; }
      return prev;
    });
  }, [completions, allowanceLoaded]);


  useEffect(() => {
    if (view !== "history" && view !== "leaderboard" && view !== "status") return;
    async function loadAll() {
      setArchiveLoading(true); setReportResults(null);
      try {
        const idxResult = await dbGet("archive-index");
        const index = idxResult?.value ? JSON.parse(idxResult.value) : [];
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

  const toggleTask = (key, freq) => {
    // For kids, append their member ID to the key so completions are tracked per-person
    const personalKey = isKidMode ? key + "-" + activeMember.id : key;
    setCompletions(prev => {
      const next = { ...prev };
      if (next[personalKey]) delete next[personalKey];
      else next[personalKey] = { by: activeMember.id, name: activeMember.name, color: activeMember.color, at: Date.now(), freq, periodKey: getPeriodKey(freq), baseKey: key };
      saveCompletions(next);
      return next;
    });
  };

  // Get completion for a task key, respecting per-person keys for kids
  // Get completion for a specific member on a task key
  function getCompletionForMember(key, memberId) {
    const member = FAMILY.find(f => f.id === memberId);
    if (!member) return null;
    if (member.isKid) {
      // Kids always use member-specific key
      return completions[key + "-" + memberId] || null;
    }
    // Adults use shared key
    return completions[key] || null;
  }

  function getCompletion(key) {
    if (isKidMode) {
      return completions[key + "-" + activeMember.id] || null;
    }
    // Adults: check shared key first, then all kid-specific keys
    // Return the most recent valid completion
    const candidates = [completions[key]];
    FAMILY.filter(f => f.isKid).forEach(k => {
      candidates.push(completions[key + "-" + k.id]);
    });
    const valid = candidates.filter(Boolean);
    if (valid.length === 0) return null;
    return valid.sort((a, b) => b.at - a.at)[0];
  }

  // Check if a task is done for the current viewer
  // For name-tagged/assigned tasks in adult mode, counts as done only if ALL assigned members have done it
  function isDone(key, task) {
    if (isKidMode) return !!getCompletion(key);
    if (!task) return !!getCompletion(key);
    const nameTag = task.text?.match(/\((\w+)\)$/);
    const taggedMember = nameTag ? FAMILY.find(f => f.name.toLowerCase() === nameTag[1].toLowerCase()) : null;
    const assignedMembers = taggedMember
      ? [taggedMember]
      : task.assignees?.length > 0 ? task.assignees.map(aid => FAMILY.find(f => f.id === aid)).filter(Boolean) : [];
    if (assignedMembers.length === 0) return !!getCompletion(key);
    // All assigned members must have completed it
    return assignedMembers.every(m => !!getCompletionForMember(key, m.id));
  }

  // For adults, get ALL completions for a key (multiple kids may have completed it)
  function getAllCompletions(key) {
    const result = [];
    if (completions[key]) result.push(completions[key]);
    FAMILY.filter(f => f.isKid).forEach(k => {
      if (completions[key + "-" + k.id]) result.push(completions[key + "-" + k.id]);
    });
    return result.sort((a, b) => b.at - a.at);
  }

  const toggleRoom = (key) => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  const availableRooms = filterFloor === "all" ? allRooms : (levels.find(l => l.id === filterFloor)?.rooms || []);

  function getDateRange() {
    const now = new Date();
    if (reportType === "daily") return { from: today(), to: today() };
    if (reportType === "yesterday") return { from: daysAgo(1), to: daysAgo(1) };
    if (reportType === "thisweek") {
      const day = now.getDay();
      const sun = new Date(now); sun.setDate(now.getDate() - day);
      const sat = new Date(sun); sat.setDate(sun.getDate() + 6);
      const fmt2 = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
      return { from: fmt2(sun), to: fmt2(sat) };
    }
    if (reportType === "lastweek") {
      const day = now.getDay();
      const lastSun = new Date(now); lastSun.setDate(now.getDate() - day - 7);
      const lastSat = new Date(lastSun); lastSat.setDate(lastSun.getDate() + 6);
      const fmt2 = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
      return { from: fmt2(lastSun), to: fmt2(lastSat) };
    }
    if (reportType === "monthly") {
      const y = now.getFullYear(), m = now.getMonth();
      return { from: y+"-"+String(m+1).padStart(2,"0")+"-01", to: y+"-"+String(m+1).padStart(2,"0")+"-"+String(new Date(y,m+1,0).getDate()).padStart(2,"0") };
    }
    if (reportType === "quarterly") {
      const q = Math.floor(now.getMonth()/3), sm = q*3, em = sm+2, y = now.getFullYear();
      return { from: y+"-"+String(sm+1).padStart(2,"0")+"-01", to: y+"-"+String(em+1).padStart(2,"0")+"-"+String(new Date(y,em+1,0).getDate()).padStart(2,"0") };
    }
    if (reportType === "annual") return { from: now.getFullYear()+"-01-01", to: now.getFullYear()+"-12-31" };
    return { from: reportDateFrom, to: reportDateTo };
  }

  function runReport() {
    const { from, to } = getDateRange();
    const items = [];
    function addFrom(obj) {
      Object.entries(obj).forEach(([key, c]) => {
        if (!c || !c.at) return;
        const dateStr = toDateStr(c.at);
        if (dateStr < from || dateStr > to) return;
        if (filterCompleted !== "all" && c.by !== filterCompleted) return;
        if (filterFreq !== "all" && c.freq !== filterFreq) return;
        const room = allRooms.find(r => key.startsWith(r.id + "-"));
        if (!room) return;
        if (filterFloor !== "all") { const lv = levels.find(l => l.id === filterFloor); if (!lv || !lv.rooms.some(r => r.id === room.id)) return; }
        if (filterRoom !== "all" && room.id !== filterRoom) return;
        const taskIndex = parseInt(key.split("-").pop());
        const taskList = getTaskList(room.id, c.freq);
        const taskObj = taskList[taskIndex];
        if (!taskObj) return;
        if (filterAssigned !== "all" && !(taskObj.assignees || []).includes(filterAssigned)) return;
        items.push({ key, task: taskObj.text, assignees: taskObj.assignees || [], roomId: room.id, roomName: room.name, roomIcon: room.icon, freq: c.freq, by: c.by, name: c.name, color: c.color, at: c.at, dateStr });
      });
    }
    addFrom(completions);
    Object.values(allArchiveData).forEach(d => addFrom(d));
    items.sort((a, b) => b.at - a.at);
    setReportResults({ items, from, to });
  }

  const totalCompleted = reportResults?.items?.length || 0;
  const byPerson = {};
  reportResults?.items?.forEach(i => { byPerson[i.by] = (byPerson[i.by] || 0) + 1; });

  // Progress bar
  let totalTasks = 0, doneTasks = 0;
  levels.forEach(lv => lv.rooms.forEach(room => {
    const visible = getVisibleTasks(room.id, activeFreq);
    const full = getTaskList(room.id, activeFreq);
    totalTasks += visible.length;
    visible.forEach(t => { const fi = full.findIndex(ft => ft.text === t.text); if (fi !== -1 && isDone(room.id+"-"+activeFreq+"-"+fi, t)) doneTasks++; });
  }));
  const overallPct = totalTasks ? Math.round(doneTasks/totalTasks*100) : 0;

  // Render a task row
  function TaskRow({ task, roomId, freq, allTasks, isLast, fmr }) {
    if (!task || typeof task.text !== "string") return null;
    const fi = allTasks.findIndex(ft => ft.text === task.text);
    const key = roomId+"-"+freq+"-"+fi;
    const fmrUsed = fmr || freqMeta[freq];

    // Detect if this task is name-tagged (e.g. "(Zach)") or assigned to specific people
    const nameTag = task.text.match(/\((\w+)\)$/);
    const taggedMember = nameTag
      ? FAMILY.find(f => f.name.toLowerCase() === nameTag[1].toLowerCase())
      : null;
    const assignedMembers = taggedMember
      ? [taggedMember]
      : task.assignees?.length > 0
        ? task.assignees.map(aid => FAMILY.find(f => f.id === aid)).filter(Boolean)
        : [];

    // For named/assigned tasks in adult mode: show per-person completion rows
    // For kid mode or unassigned tasks: show single completion row
    const showPerPerson = !isKidMode && assignedMembers.length > 0;

    if (showPerPerson) {
      // Render one sub-row per assigned member
      return (
        <div style={{ padding: "10px 14px", borderBottom: isLast ? "none" : "1px solid "+fmrUsed.border, background: "transparent" }}>
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: fmrUsed.text }}>{task.text}</span>
            {task.time && <span style={{ fontSize: 9, color: "#AAA", background: "#F5F2EC", padding: "1px 6px", borderRadius: 6, marginLeft: 6 }}>~{task.time}</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {assignedMembers.map(member => {
              const memberCompletion = getCompletionForMember(key, member.id);
              const done = !!memberCompletion;
              const completedBy = done ? FAMILY.find(f => f.id === memberCompletion.by) : null;
              return (
                <div key={member.id}
                  onClick={() => {
                    const personalKey = member.isKid ? key + "-" + member.id : key;
                    setCompletions(prev => {
                      const next = { ...prev };
                      if (next[personalKey]) delete next[personalKey];
                      else next[personalKey] = { by: member.id, name: member.name, color: member.color, at: Date.now(), freq, periodKey: getPeriodKey(freq), baseKey: key };
                      saveCompletions(next);
                      return next;
                    });
                  }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, background: done ? member.color+"10" : "#F9F8F6", cursor: "pointer", border: "1px solid "+(done ? member.color+"33" : "#ECEAE3") }}>
                  <div style={{ width: 17, height: 17, borderRadius: "50%", border: "2px solid "+(done ? member.color : "#CCC"), background: done ? member.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {done && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <Avatar member={member} size={20} fontSize={9} />
                  <span style={{ fontSize: 11, color: done ? member.color : "#888", fontWeight: done ? "bold" : "normal", flex: 1 }}>{member.name}</span>
                  {done && completedBy && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      {completedBy.id !== member.id && (
                        <><Avatar member={completedBy} size={16} fontSize={7} /><span style={{ fontSize: 9, color: completedBy.color }}>{completedBy.name}</span></>
                      )}
                      <span style={{ fontSize: 9, color: "#CCC" }}>{fmt(memberCompletion.at)}</span>
                    </div>
                  )}
                  {!done && <span style={{ fontSize: 9, color: "#DDD" }}>not done</span>}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Default: single completion row
    const completion = getCompletion(key);
    const done = !!completion;
    const member = done ? FAMILY.find(f => f.id === completion.by) : null;
    const color = fmrUsed.text;
    return (
      <div onClick={() => toggleTask(key, freq)} style={{ padding: "10px 14px", borderBottom: isLast ? "none" : "1px solid "+fmrUsed.border, cursor: "pointer", background: done ? "rgba(255,255,255,0.6)" : "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 19, height: 19, borderRadius: "50%", flexShrink: 0, border: "2px solid "+(done?completion.color:"#CCC"), background: done?completion.color:"transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {done && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13, color: done?"#AAA":color, textDecoration: done?"line-through":"none" }}>{task.text}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
              {!isKidMode && task.assignees?.length > 0 && task.assignees.map(aid => { const m = FAMILY.find(f => f.id === aid); return m ? <Avatar key={aid} member={m} size={14} fontSize={7} /> : null; })}
              {task.time && <span style={{ fontSize: 9, color: done?"#CCC":"#AAA", background: "#F5F2EC", padding: "1px 6px", borderRadius: 6 }}>~{task.time}</span>}
            </div>
          </div>
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
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F5F2EC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif" }}>
      <p style={{ color: "#AAA" }}>Loading...</p>
    </div>
  );

  const tabs = isKidMode
    ? [["tasks","Tasks"],["leaderboard","Leaderboard"],["allowance","Allowance"]]
    : [["tasks","Tasks"],["status","Status"],["leaderboard","Leaderboard"],["allowance","Allowance"],["history","History"],["edit","Edit"],["notify","Notify"]];

  return (
    <div style={{ minHeight: "100vh", background: "#F5F2EC", fontFamily: "Georgia, serif" }} key={activeMember.id}>

      {/* HEADER */}
      <div style={{ background: "#1A1A1A", color: "#F5F2EC", padding: "20px 20px 14px" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "#555", margin: "0 0 4px", textTransform: "uppercase" }}>Home Management</p>
        <h1 style={{ fontSize: 24, fontWeight: "normal", margin: "0 0 12px" }}>Cleaning Schedule</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {/* Adults row */}
          <div style={{ display: "flex", gap: 8 }}>
            {FAMILY.filter(m => !m.isKid).map(m => (
              <button key={m.id} onClick={() => setActiveMember(m)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, cursor: "pointer", border: "2px solid "+(activeMember.id===m.id?m.color:"transparent"), background: activeMember.id===m.id?m.color+"22":"rgba(255,255,255,0.07)", color: activeMember.id===m.id?"#fff":"#888", fontFamily: "inherit", fontSize: 12, fontWeight: activeMember.id===m.id?"bold":"normal" }}>
                <Avatar member={m} size={22} fontSize={11} /><span>{m.name}</span>
              </button>
            ))}
          </div>
          {/* Kids row */}
          <div style={{ display: "flex", gap: 8 }}>
            {FAMILY.filter(m => m.isKid).map(m => (
              <button key={m.id} onClick={() => setActiveMember(m)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20, cursor: "pointer", border: "2px solid "+(activeMember.id===m.id?m.color:"transparent"), background: activeMember.id===m.id?m.color+"22":"rgba(255,255,255,0.07)", color: activeMember.id===m.id?"#fff":"#888", fontFamily: "inherit", fontSize: 12, fontWeight: activeMember.id===m.id?"bold":"normal" }}>
                <Avatar member={m} size={22} fontSize={11} /><span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 11, color: "#555", margin: "8px 0 0" }}>
          Completing as <strong style={{ color: activeMember.color }}>{activeMember.name}</strong>
          {isKidMode && <span style={{ marginLeft: 8, fontSize: 10, color: "#6DB894", background: "#1A3025", padding: "2px 8px", borderRadius: 10 }}>My Tasks</span>}
        </p>
      </div>

      {/* TABS */}
      {isKidMode ? (
        <div style={{ display: "flex", background: "#111", borderTop: "1px solid #2A2A2A" }}>
          {tabs.map(([v,label]) => (
            <button key={v} onClick={() => setView(v)} style={{ flex: 1, background: "none", border: "none", padding: "10px 4px", cursor: "pointer", fontFamily: "inherit", fontSize: 11, color: view===v?"#F5F2EC":"#555", borderBottom: view===v?"2px solid #F5F2EC":"2px solid transparent", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</button>
          ))}
        </div>
      ) : (
        <div style={{ background: "#111", borderTop: "1px solid #2A2A2A" }}>
          <div style={{ display: "flex" }}>
            {tabs.slice(0, 3).map(([v,label]) => (
              <button key={v} onClick={() => setView(v)} style={{ flex: 1, background: "none", border: "none", padding: "9px 4px 7px", cursor: "pointer", fontFamily: "inherit", fontSize: 11, color: view===v?"#F5F2EC":"#555", borderBottom: view===v?"2px solid #F5F2EC":"2px solid transparent", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</button>
            ))}
          </div>
          <div style={{ display: "flex", borderTop: "1px solid #1E1E1E" }}>
            {tabs.slice(3).map(([v,label]) => (
              <button key={v} onClick={() => setView(v)} style={{ flex: 1, background: "none", border: "none", padding: "9px 4px 7px", cursor: "pointer", fontFamily: "inherit", fontSize: 11, color: view===v?"#F5F2EC":"#555", borderBottom: view===v?"2px solid #F5F2EC":"2px solid transparent", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ LEADERBOARD VIEW ═══ */}
      {view === "leaderboard" && (() => {
        const kids = FAMILY.filter(f => f.isKid);
        const now = new Date();
        const medals = ["🥇","🥈","🥉"];

        const weekDay = now.getDay();
        const weekStart = new Date(now); weekStart.setDate(now.getDate()-weekDay); weekStart.setHours(0,0,0,0);
        const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate()+6); weekEnd.setHours(23,59,59,999);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth()+1, 0, 23,59,59,999);
        const weekLabel = weekStart.toLocaleDateString([],{month:"short",day:"numeric"})+" - "+weekEnd.toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"});
        const monthLabel = now.toLocaleDateString([],{month:"long",year:"numeric"});

        function parseCompletionKey(key, c) {
          // Keys: roomId-freq-index  or  roomId-freq-index-memberId
          // roomId and freq can both contain hyphens so we must use c.freq to split
          const room = allRooms.find(r => key.startsWith(r.id + "-"));
          if (!room) return null;
          const rest = key.slice(room.id.length + 1); // "freq-index" or "freq-index-memberId"
          if (!c.freq || !rest.startsWith(c.freq + "-")) return null;
          const afterFreq = rest.slice(c.freq.length + 1); // "index" or "index-memberId"
          const taskIndex = parseInt(afterFreq.split("-")[0]);
          if (isNaN(taskIndex)) return null;
          return { room, taskIndex };
        }

        function countPoints(from, to) {
          const points = {}, details = {};
          kids.forEach(k => { points[k.id] = 0; details[k.id] = []; });
          const scan = (obj) => {
            Object.entries(obj).forEach(([key, c]) => {
              if (!c || !c.at || !c.by || !c.freq) return;
              if (!kids.find(k => k.id === c.by)) return;
              if (c.at < from || c.at > to) return;
              const parsed = parseCompletionKey(key, c);
              if (!parsed) return;
              const { room, taskIndex } = parsed;
              const taskList = getTaskList(room.id, c.freq);
              const taskObj = taskList[taskIndex];
              if (!taskObj) return;
              const pts = taskPoints(taskObj);
              const baseKey = room.id + "-" + c.freq + "-" + taskIndex;
              // Deduplicate: same task on same calendar day counts once per kid
              // Use periodKey (which encodes the specific day/week/month) as the scope
              const dedupeKey = baseKey + "|" + (c.periodKey || String(c.at));
              if (details[c.by].find(d => d.dedupeKey === dedupeKey)) return;
              points[c.by] = (points[c.by] || 0) + pts;
              details[c.by].push({ baseKey, dedupeKey, task: taskObj.text, room: room.name, roomIcon: room.icon, freq: c.freq, pts, time: taskObj.time, at: c.at });
            });
          }
          scan(completions);
          Object.values(allArchiveData).forEach(d => scan(d));
          return { points, details };
        }

        const { points: weekPoints, details: weekDetails } = countPoints(weekStart.getTime(), weekEnd.getTime());
        const { points: monthPoints, details: monthDetails } = countPoints(monthStart.getTime(), monthEnd.getTime());

        const weekSorted = [...kids].sort((a,b) => (weekPoints[b.id]||0)-(weekPoints[a.id]||0));
        const monthSorted = [...kids].sort((a,b) => (monthPoints[b.id]||0)-(monthPoints[a.id]||0));
        const weekMax = Math.max(...weekSorted.map(k=>weekPoints[k.id]||0), 1);
        const monthMax = Math.max(...monthSorted.map(k=>monthPoints[k.id]||0), 1);

        const weekWinner = weekSorted[0];
        const weekIsTie = weekSorted.length>1 && weekPoints[weekSorted[0].id]===weekPoints[weekSorted[1].id] && weekPoints[weekSorted[0].id]>0;
        const weekHasActivity = weekSorted.some(k=>weekPoints[k.id]>0);
        const monthWinner = monthSorted[0];
        const monthIsTie = monthSorted.length>1 && monthPoints[monthSorted[0].id]===monthPoints[monthSorted[1].id] && monthPoints[monthSorted[0].id]>0;
        const monthHasActivity = monthSorted.some(k=>monthPoints[k.id]>0);

        const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const dailyPts = {};
        kids.forEach(k => { dailyPts[k.id] = Array(7).fill(0); });
        const seenDaily = new Set();
        function scanDaily(obj) {
          Object.entries(obj).forEach(([key, c]) => {
            if (!c || !c.at || !c.by || !c.freq) return;
            if (!kids.find(k=>k.id===c.by)) return;
            if (c.at < weekStart.getTime() || c.at > weekEnd.getTime()) return;
            const parsed = parseCompletionKey(key, c);
            if (!parsed) return;
            const { room, taskIndex } = parsed;
            const taskList = getTaskList(room.id, c.freq);
            const taskObj = taskList[taskIndex];
            if (!taskObj) return;
            const dayIdx = new Date(c.at).getDay();
            const dedupeKey = c.by + "|" + room.id + "-" + c.freq + "-" + taskIndex + "|" + dayIdx;
            if (seenDaily.has(dedupeKey)) return;
            seenDaily.add(dedupeKey);
            dailyPts[c.by][dayIdx] += taskPoints(taskObj);
          });
        }
        scanDaily(completions);
        Object.values(allArchiveData).forEach(d => scanDaily(d));
        const maxDailyPts = Math.max(...kids.flatMap(k=>dailyPts[k.id]), 1);
        const todayIdx = now.getDay();

        const weekExpandedKid = expandedLeaderWeek;
        const setWeekExpandedKid = setExpandedLeaderWeek;
        const monthExpandedKid = expandedLeaderMonth;
        const setMonthExpandedKid = setExpandedLeaderMonth;

        function HBar({ sorted, points, maxVal, details, expandedKid, setExpandedKid }) {
          return (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {sorted.map((kid, rank) => {
                const pts = points[kid.id]||0;
                const pct = Math.round(pts/maxVal*100);
                const isExp = expandedKid === kid.id;
                const kidDetails = (details[kid.id]||[]).sort((a,b)=>b.pts-a.pts);
                return (
                  <div key={kid.id}>
                    <div onClick={() => setExpandedKid(isExp ? null : kid.id)} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                      <span style={{ fontSize:14, width:22, textAlign:"center" }}>{pts>0?(medals[rank]||""):""}</span>
                      <Avatar member={kid} size={22} fontSize={10} />
                      <span style={{ fontSize:12, fontWeight:"bold", color:kid.color, minWidth:46 }}>{kid.name}</span>
                      <div style={{ flex:1, height:24, background:"#F0EDE6", borderRadius:6, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:(pts===0?0:Math.max(pct,6))+"%", background:kid.color, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:7, transition:"width 0.6s ease", boxSizing:"border-box" }}>
                          {pts>0 && <span style={{ fontSize:10, color:"#fff", fontWeight:"bold" }}>{pts}</span>}
                        </div>
                      </div>
                      {pts===0 && <span style={{ fontSize:11, color:"#CCC", minWidth:14 }}>0</span>}
                      <span style={{ fontSize:10, color:isExp?kid.color:"#CCC" }}>{isExp?"▲":"▼"}</span>
                    </div>
                    {isExp && (
                      <div style={{ marginLeft:30, marginTop:8, background:kid.color+"0D", borderRadius:10, border:"1px solid "+kid.color+"33", overflow:"hidden" }}>
                        {kidDetails.length===0 ? (
                          <p style={{ margin:0, padding:"10px 12px", fontSize:12, color:"#CCC", fontStyle:"italic" }}>No tasks completed yet.</p>
                        ) : kidDetails.map((d,i) => (
                          <div key={d.baseKey} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderBottom:i<kidDetails.length-1?"1px solid "+kid.color+"22":"none" }}>
                            <div style={{ width:22, height:22, borderRadius:"50%", background:kid.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <span style={{ fontSize:9, color:"#fff", fontWeight:"bold" }}>{d.pts}pt</span>
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <p style={{ margin:0, fontSize:12, color:"#1A1A1A" }}>{d.task}</p>
                              <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:2 }}>
                                <span style={{ fontSize:10, color:"#888" }}>{d.room}</span>
                                <span style={{ fontSize:9, padding:"1px 5px", borderRadius:5, background:freqMeta[d.freq]?.bg||"#EEE", color:freqMeta[d.freq]?.text||"#888" }}>{d.freq}</span>
                                {d.time && <span style={{ fontSize:9, color:"#AAA" }}>~{d.time}</span>}
                              </div>
                            </div>
                            <span style={{ fontSize:9, color:"#CCC", flexShrink:0 }}>{fmt(d.at)}</span>
                          </div>
                        ))}
                        <div style={{ padding:"8px 12px", borderTop:"1px solid "+kid.color+"22", display:"flex", justifyContent:"space-between" }}>
                          <span style={{ fontSize:11, color:"#888" }}>{kidDetails.length} task{kidDetails.length!==1?"s":""}</span>
                          <span style={{ fontSize:11, fontWeight:"bold", color:kid.color }}>{pts} pts total</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }

        function WinnerBanner({ winner, isTie, hasActivity, points, sorted, label }) {
          if (!hasActivity) return (
            <div style={{ padding:"12px 14px", background:"#FAFAF8", border:"1px solid #E4E0D8", borderRadius:12, textAlign:"center" }}>
              <p style={{ margin:0, fontSize:12, color:"#CCC" }}>No activity yet</p>
            </div>
          );
          if (isTie) return (
            <div style={{ padding:"12px 14px", background:"#FEFAEC", border:"1px solid #F0DC7A", borderRadius:12, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>🤝</span>
              <div>
                <p style={{ margin:0, fontSize:12, fontWeight:"bold", color:"#7A6010" }}>Tie!</p>
                <p style={{ margin:"2px 0 0", fontSize:11, color:"#888" }}>{sorted.filter(k=>points[k.id]===points[sorted[0].id]).map(k=>k.name).join(" & ")} — {points[sorted[0].id]} pts each</p>
              </div>
            </div>
          );
          return (
            <div style={{ padding:"14px", background:winner.color+"15", border:"2px solid "+winner.color+"44", borderRadius:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:26 }}>👑</span>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontSize:10, color:winner.color, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:"bold" }}>{label} Leader</p>
                  <p style={{ margin:"2px 0 0", fontSize:20, fontWeight:"bold", color:winner.color }}>{winner.name}</p>
                  <p style={{ margin:"2px 0 0", fontSize:11, color:"#888" }}>{points[winner.id]} pts earned</p>
                </div>
                <Avatar member={winner} size={44} fontSize={18} />
              </div>
            </div>
          );
        }

        return (
          <div style={{ paddingBottom:60 }}>
            <div style={{ padding:"8px 14px 0" }}>
              <p style={{ margin:0, fontSize:9, color:"#AAA", fontStyle:"italic" }}>Points: 1=0-5min · 2=6-15min · 3=16-30min · 5=31min-1hr · 8=1-2hr · 12=2-4hr · 18=4hr+</p>
            </div>

            <div style={{ padding:"10px 14px 0" }}>
              <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:10 }}>
                <p style={{ margin:0, fontSize:13, fontWeight:"bold", color:"#1A1A1A" }}>This Week</p>
                <p style={{ margin:0, fontSize:10, color:"#AAA" }}>{weekLabel}</p>
              </div>
              <WinnerBanner winner={weekWinner} isTie={weekIsTie} hasActivity={weekHasActivity} points={weekPoints} sorted={weekSorted} label="Week" />
            </div>
            <div style={{ margin:"10px 14px 0", background:"#fff", borderRadius:14, border:"1px solid #E4E0D8", padding:"14px" }}>
              <HBar sorted={weekSorted} points={weekPoints} maxVal={weekMax} details={weekDetails} expandedKid={weekExpandedKid} setExpandedKid={setWeekExpandedKid} />
            </div>

            <div style={{ margin:"14px 14px 0", background:"#fff", borderRadius:14, border:"1px solid #E4E0D8", padding:"14px 14px 10px" }}>
              <p style={{ margin:"0 0 12px", fontSize:11, fontWeight:"bold", color:"#1A1A1A" }}>Daily Points This Week</p>
              <div style={{ display:"flex", gap:5 }}>
                {dayNames.map((dayName, dayIdx) => {
                  const isToday = dayIdx===todayIdx, isFuture = dayIdx>todayIdx;
                  const dayTotal = kids.reduce((s,k)=>s+(dailyPts[k.id][dayIdx]||0),0);
                  return (
                    <div key={dayName} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                      <div style={{ width:"100%", height:90, display:"flex", flexDirection:"column-reverse", justifyContent:"flex-start", gap:1, opacity:isFuture?0.2:1 }}>
                        {kids.map(kid => {
                          const pts = dailyPts[kid.id][dayIdx]||0;
                          const h = pts===0?0:Math.max(Math.round(pts/maxDailyPts*82),7);
                          return <div key={kid.id} style={{ width:"100%", height:h, background:kid.color, borderRadius:3 }} />;
                        })}
                      </div>
                      {isToday && <div style={{ width:"100%", height:2, background:"#1A1A1A", borderRadius:2 }} />}
                      <span style={{ fontSize:9, color:isToday?"#1A1A1A":"#AAA", fontWeight:isToday?"bold":"normal" }}>{dayName}</span>
                      {dayTotal>0&&!isFuture&&<span style={{ fontSize:9, color:"#888" }}>{dayTotal}</span>}
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex", gap:10, marginTop:10, flexWrap:"wrap" }}>
                {kids.map(kid=>(
                  <div key={kid.id} style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:kid.color }} />
                    <span style={{ fontSize:10, color:kid.color, fontWeight:"bold" }}>{kid.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding:"18px 14px 0" }}>
              <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:10 }}>
                <p style={{ margin:0, fontSize:13, fontWeight:"bold", color:"#1A1A1A" }}>This Month</p>
                <p style={{ margin:0, fontSize:10, color:"#AAA" }}>{monthLabel}</p>
              </div>
              <WinnerBanner winner={monthWinner} isTie={monthIsTie} hasActivity={monthHasActivity} points={monthPoints} sorted={monthSorted} label="Month" />
            </div>
            <div style={{ margin:"10px 14px 0", background:"#fff", borderRadius:14, border:"1px solid #E4E0D8", padding:"14px" }}>
              <HBar sorted={monthSorted} points={monthPoints} maxVal={monthMax} details={monthDetails} expandedKid={monthExpandedKid} setExpandedKid={setMonthExpandedKid} />
            </div>

            <p style={{ margin:"14px 14px 4px", fontSize:10, color:"#CCC", fontStyle:"italic", textAlign:"center" }}>Weekly standings reset every Sunday</p>
          </div>
        );
      })()}

      {/* ═══ STATUS VIEW ═══ */}
      {view === "status" && <StatusView
        completions={completions}
        allArchiveData={allArchiveData}
        getTaskList={getTaskList}
        allRooms={allRooms}
        levels={levels}
        expandedCard={expandedCard}
        setExpandedCard={setExpandedCard}
        Avatar={Avatar}
        RoomIcon={RoomIcon}
        FAMILY={FAMILY}
      />}

      {/* ═══ ALLOWANCE VIEW ═══ */}
      {view === "allowance" && (() => {
        const allAllowanceKids = FAMILY.filter(f => f.id === "zach" || f.id === "kyle");
        // Kids only see their own allowance; adults see all
        const allowanceKids = isKidMode
          ? allAllowanceKids.filter(f => f.id === activeMember.id)
          : allAllowanceKids;

        // Payout: resets balance to 0, adds a payout entry to the unified history (never deleted)
        function handlePayout(kid) {
          const current = allowanceData[kid.id] || { balance: 0, history: [] };
          const amount = current.balance || 0;
          if (amount <= 0) return;
          const payDate = new Date().toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
          const updated = {
            ...allowanceData,
            [kid.id]: {
              ...current,
              balance: 0,
              lastAwardedDay: current.lastAwardedDay,
              history: [...(current.history || []), {
                type: "payout",
                amount,
                date: Date.now(),
                note: "$" + amount.toFixed(2) + " paid out to " + kid.name + " · Balance reset to $0 · " + payDate,
              }],
            }
          };
          setAllowanceData(updated);
          saveAllowance(updated);
        }

        function handleAdjust(kid, isAdd) {
          const adjAmt = parseFloat(adjAmounts[kid.id] || "0");
          const adjNote = adjNotes[kid.id] || "";
          if (isNaN(adjAmt) || adjAmt <= 0) return;
          const current = allowanceData[kid.id] || { balance: 0, history: [] };
          const delta = isAdd ? adjAmt : -adjAmt;
          const newBalance = Math.max(0, (current.balance || 0) + delta);
          const adjDate = new Date().toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
          const baseNote = adjNote
            ? adjNote
            : isAdd ? "Manual bonus" : "Manual deduction";
          const fullNote = baseNote + " · " + (isAdd ? "+" : "−") + "$" + adjAmt.toFixed(2) + " · Balance: $" + newBalance.toFixed(2) + " · " + adjDate;
          const updated = {
            ...allowanceData,
            [kid.id]: {
              ...current,
              balance: newBalance,
              history: [...(current.history || []), {
                type: isAdd ? "add" : "deduct",
                amount: adjAmt,
                date: Date.now(),
                note: fullNote,
              }],
            }
          };
          setAllowanceData(updated);
          saveAllowance(updated);
          setAdjAmounts(prev => ({ ...prev, [kid.id]: "" }));
          setAdjNotes(prev => ({ ...prev, [kid.id]: "" }));
        }

        const inSt = { fontSize: 13, padding: "7px 10px", border: "1px solid #DDD8CE", borderRadius: 8, fontFamily: "inherit", background: "#fff", boxSizing: "border-box" };

        function entryColor(entry, kidColor) {
          if (entry.type === "deduct") return "#D47F6B";
          if (entry.type === "payout") return "#D47F6B";
          if (entry.type === "earn") return kidColor;
          return "#6DB894"; // add
        }
        function entryIcon(entry) {
          if (entry.type === "payout") return "💸";
          if (entry.type === "deduct") return "📉";
          if (entry.type === "earn") return "✅";
          return "📈";
        }
        function entrySign(entry) {
          return (entry.type === "deduct" || entry.type === "payout") ? "−" : "+";
        }

        return (
          <div style={{ paddingBottom: 60 }}>
            <div style={{ padding: "14px 14px 8px" }}>
              <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: "bold", color: "#1A1A1A" }}>Allowance Tracker</p>
              <p style={{ margin: 0, fontSize: 11, color: "#AAA" }}>$2 earned when all daily tasks are completed.</p>
            </div>

            {allowanceKids.map(kid => {
              const data = allowanceData[kid.id] || { balance: 0, history: [] };
              const balance = data.balance || 0;
              const allHistory = [...(data.history || [])].reverse(); // newest first
              const lastPayout = [...(data.history || [])].reverse().find(h => h.type === "payout");

              // Show 5 by default, up to 30 when expanded
              const showAll = historyExpanded[kid.id];
              const displayHistory = showAll ? allHistory.slice(0, 30) : allHistory.slice(0, 5);
              const hasMore = allHistory.length > 5;
              const hiddenCount = Math.min(allHistory.length, 30) - 5;

              return (
                <div key={kid.id} style={{ margin: "0 14px 18px", background: "#fff", borderRadius: 14, border: "2px solid " + kid.color + "55", overflow: "hidden" }}>

                  {/* Header */}
                  <div style={{ padding: "14px 14px 10px", background: kid.color + "12", borderBottom: "1px solid " + kid.color + "22" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar member={kid} size={30} fontSize={13} />
                        <span style={{ fontSize: 14, fontWeight: "bold", color: kid.color }}>{kid.name}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: 30, fontWeight: "bold", color: kid.color, lineHeight: 1 }}>${balance.toFixed(2)}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 9, color: "#AAA" }}>current balance</p>
                      </div>
                    </div>
                    {lastPayout && (
                      <p style={{ margin: "8px 0 0", fontSize: 10, color: "#AAA" }}>
                        Last paid ${lastPayout.amount.toFixed(2)} on {new Date(lastPayout.date).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                  </div>

                  {/* Payout button — adults only */}
                  {!isKidMode && (
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid #F5F2EC" }}>
                    <button onClick={() => handlePayout(kid)} disabled={balance <= 0} style={{ width: "100%", padding: "9px", background: balance > 0 ? kid.color : "#EEE", color: balance > 0 ? "#fff" : "#BBB", border: "none", borderRadius: 8, cursor: balance > 0 ? "pointer" : "not-allowed", fontFamily: "inherit", fontSize: 12, fontWeight: "bold" }}>
                      {balance > 0 ? "💸  Pay Out $" + balance.toFixed(2) : "Nothing to pay out"}
                    </button>
                  </div>
                  )}

                  {/* Manual adjustment — adults only */}
                  {!isKidMode && (
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid #F5F2EC" }}>
                    <p style={{ margin: "0 0 8px", fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.06em" }}>Manual Adjustment</p>
                    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                      <input type="number" min="0" step="0.50" value={adjAmounts[kid.id] || ""} onChange={e => setAdjAmounts(prev => ({ ...prev, [kid.id]: e.target.value }))} placeholder="$0.00" style={{ ...inSt, width: 80 }} />
                      <input value={adjNotes[kid.id] || ""} onChange={e => setAdjNotes(prev => ({ ...prev, [kid.id]: e.target.value }))} placeholder="Reason (optional)" style={{ ...inSt, flex: 1 }} />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleAdjust(kid, true)} style={{ flex: 1, padding: "7px", background: "#6DB894", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: "bold" }}>+ Add</button>
                      <button onClick={() => handleAdjust(kid, false)} style={{ flex: 1, padding: "7px", background: "#D47F6B", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: "bold" }}>− Deduct</button>
                    </div>
                  </div>
                  )}

                  {/* Transaction history */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px 4px" }}>
                      <p style={{ margin: 0, fontSize: 10, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.06em" }}>History</p>
                      <p style={{ margin: 0, fontSize: 10, color: "#AAA" }}>{allHistory.length} transaction{allHistory.length !== 1 ? "s" : ""}</p>
                    </div>
                    {allHistory.length === 0 && (
                      <p style={{ margin: 0, padding: "10px 14px 14px", fontSize: 12, color: "#CCC", fontStyle: "italic" }}>No transactions yet.</p>
                    )}
                    {displayHistory.map((entry, i) => {
                      const color = entryColor(entry, kid.color);
                      const isPayout = entry.type === "payout";
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderTop: "1px solid #F5F2EC", background: isPayout ? "#FFF8F6" : "#fff" }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 12 }}>{entryIcon(entry)}</span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 12, color: isPayout ? "#888" : "#1A1A1A", fontStyle: isPayout ? "italic" : "normal" }}>{entry.note}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 10, color: "#AAA" }}>{new Date(entry.date).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: "bold", color, flexShrink: 0 }}>
                            {entrySign(entry)}${entry.amount.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                    {hasMore && (
                      <button onClick={() => setHistoryExpanded(prev => ({ ...prev, [kid.id]: !showAll }))} style={{ width: "100%", padding: "10px", background: "none", border: "none", borderTop: "1px solid #F5F2EC", cursor: "pointer", fontFamily: "inherit", fontSize: 11, color: kid.color, fontWeight: "bold" }}>
                        {showAll ? "Show less" : "Show " + hiddenCount + " more transactions"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* ═══ HISTORY VIEW ═══ */}
      {view === "history" && (
        <div style={{ paddingBottom: 60 }}>
          <div style={{ background: "#fff", borderBottom: "1px solid #E4E0D8", padding: "16px" }}>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>Report Period</label>
              <select value={reportType} onChange={e => { setReportType(e.target.value); setReportResults(null); }} style={selectStyle}>
                <option value="daily">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisweek">This Week</option>
                <option value="lastweek">Last Week</option>
                <option value="monthly">This Month</option>
                <option value="quarterly">This Quarter</option>
                <option value="annual">This Year</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>
            {reportType === "custom" && (
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>From</label><input type="date" value={reportDateFrom} onChange={e => { setReportDateFrom(e.target.value); setReportResults(null); }} style={selectStyle} /></div>
                <div style={{ flex: 1 }}><label style={labelStyle}>To</label><input type="date" value={reportDateTo} onChange={e => { setReportDateTo(e.target.value); setReportResults(null); }} style={selectStyle} /></div>
              </div>
            )}
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>Floor</label><select value={filterFloor} onChange={e => { setFilterFloor(e.target.value); setFilterRoom("all"); setReportResults(null); }} style={selectStyle}><option value="all">All Floors</option>{levels.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}</select></div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>Room</label><select value={filterRoom} onChange={e => { setFilterRoom(e.target.value); setReportResults(null); }} style={selectStyle}><option value="all">All Rooms</option>{availableRooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>Frequency</label><select value={filterFreq} onChange={e => { setFilterFreq(e.target.value); setReportResults(null); }} style={selectStyle}><option value="all">All Frequencies</option>{frequencies.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>Completed By</label><select value={filterCompleted} onChange={e => { setFilterCompleted(e.target.value); setReportResults(null); }} style={selectStyle}><option value="all">Anyone</option>{FAMILY.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
            <div style={{ marginBottom: 18 }}><label style={labelStyle}>Assigned To</label><select value={filterAssigned} onChange={e => { setFilterAssigned(e.target.value); setReportResults(null); }} style={selectStyle}><option value="all">Anyone</option>{FAMILY.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
            <button onClick={runReport} disabled={archiveLoading} style={{ width: "100%", padding: "12px", background: archiveLoading?"#CCC":"#1A1A1A", color: "#fff", border: "none", borderRadius: 10, cursor: archiveLoading?"not-allowed":"pointer", fontFamily: "inherit", fontSize: 14, fontWeight: "bold" }}>
              {archiveLoading ? "Loading data..." : "Run Report"}
            </button>
          </div>

          {reportResults && (
            <div style={{ padding: "14px 14px 0" }}>
              <p style={{ fontSize: 11, color: "#AAA", margin: "0 0 10px", fontStyle: "italic" }}>
                {new Date(reportResults.from+"T12:00:00").toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"})}
                {reportResults.from!==reportResults.to && " - "+new Date(reportResults.to+"T12:00:00").toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"})}
              </p>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <div style={{ flex:1, background:"#fff", borderRadius:10, padding:"12px", border:"1px solid #E8F5EE", textAlign:"center" }}><p style={{ margin:0, fontSize:26, fontWeight:"bold", color:"#6DB894" }}>{totalCompleted}</p><p style={{ margin:0, fontSize:10, color:"#AAA" }}>completed</p></div>
                <div style={{ flex:1, background:"#fff", borderRadius:10, padding:"12px", border:"1px solid #EBF4FC", textAlign:"center" }}><p style={{ margin:0, fontSize:26, fontWeight:"bold", color:"#5B9BD5" }}>{Object.keys(byPerson).length}</p><p style={{ margin:0, fontSize:10, color:"#AAA" }}>contributors</p></div>
                <div style={{ flex:1, background:"#fff", borderRadius:10, padding:"12px", border:"1px solid #F2EBF9", textAlign:"center" }}><p style={{ margin:0, fontSize:26, fontWeight:"bold", color:"#A67DC4" }}>{new Set(reportResults.items.map(i=>i.roomId)).size}</p><p style={{ margin:0, fontSize:10, color:"#AAA" }}>rooms</p></div>
              </div>
              {totalCompleted > 0 && (
                <div style={{ background:"#fff", borderRadius:10, padding:"12px 14px", border:"1px solid #E4E0D8", marginBottom:14 }}>
                  <p style={{ margin:"0 0 8px", fontSize:10, color:"#AAA", textTransform:"uppercase" }}>By person</p>
                  <div style={{ display:"flex", height:8, borderRadius:6, overflow:"hidden", marginBottom:8 }}>
                    {FAMILY.map(m => { const c=byPerson[m.id]||0; if(!c) return null; return <div key={m.id} style={{ width:Math.round(c/totalCompleted*100)+"%", background:m.color }} />; })}
                  </div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    {FAMILY.map(m => { const c=byPerson[m.id]||0; if(!c) return null; return <div key={m.id} style={{ display:"flex", alignItems:"center", gap:5 }}><Avatar member={m} size={18} fontSize={9} /><span style={{ fontSize:11, color:m.color, fontWeight:"bold" }}>{m.name}</span><span style={{ fontSize:11, color:"#AAA" }}>{c}</span></div>; })}
                  </div>
                </div>
              )}
              {totalCompleted === 0 ? (
                <div style={{ textAlign:"center", padding:"30px 0" }}><p style={{ fontSize:14, color:"#CCC" }}>No completed tasks match these filters.</p></div>
              ) : reportResults.items.map((item,idx) => {
                const member = FAMILY.find(f=>f.id===item.by), fmr=freqMeta[item.freq]||freqMeta.Daily;
                const lv = levels.find(l=>l.rooms.some(r=>r.id===item.roomId));
                return (
                  <div key={item.key+idx} style={{ marginBottom:8, background:"#fff", borderRadius:10, border:"1px solid #E4E0D8" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px" }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", background:item.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ margin:0, fontSize:13 }}>{item.task}</p>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3, flexWrap:"wrap" }}>
                          <span style={{ fontSize:10, color:"#888" }}>{item.roomName}</span>
                          {lv && <span style={{ fontSize:9, color:lv.color, fontWeight:"bold" }}>{lv.label}</span>}
                          <span style={{ fontSize:9, padding:"1px 6px", borderRadius:6, background:fmr.bg, color:fmr.text, fontWeight:"bold" }}>{item.freq}</span>
                          <span style={{ fontSize:10, color:"#CCC" }}>{fmt(item.at)}</span>
                        </div>
                        {item.assignees?.length > 0 && <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:4 }}><span style={{ fontSize:9, color:"#BBB" }}>Assigned:</span>{item.assignees.map(aid=>{ const m=FAMILY.find(f=>f.id===aid); return m?<Avatar key={aid} member={m} size={14} fontSize={7} />:null; })}</div>}
                      </div>
                      {member && <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0 }}><Avatar member={member} size={24} fontSize={11} /><div><p style={{ margin:0, fontSize:10, color:item.color, fontWeight:"bold", lineHeight:1.2 }}>{item.name}</p><p style={{ margin:0, fontSize:9, color:"#CCC", lineHeight:1.2 }}>completed</p></div></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ TASKS VIEW ═══ */}
      {view === "tasks" && (<>
        <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#F5F2EC", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 16px 6px" }}>
            <div style={{ display: "flex", background: "#ECEAE3", borderRadius: 20, padding: 3, gap: 2 }}>
              {[["frequency","By Frequency"],["room","By Room"]].map(([l,label]) => (
                <button key={l} onClick={() => setTaskLayout(l)} style={{ padding: "5px 14px", borderRadius: 16, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: taskLayout===l?"bold":"normal", background: taskLayout===l?"#1A1A1A":"transparent", color: taskLayout===l?"#F5F2EC":"#888" }}>{label}</button>
              ))}
            </div>
          </div>
          {taskLayout === "frequency" && (<>
            <div style={{ display: "flex", background: "#ECEAE3", borderBottom: "2px solid "+fm.dot }}>
              {frequencies.map(f => { const meta=freqMeta[f], active=activeFreq===f; return (
                <button key={f} onClick={() => setActiveFreq(f)} style={{ flex:1, background:active?meta.bg:"none", border:"none", padding:"12px 4px 10px", cursor:"pointer", fontFamily:"inherit", fontSize:10, fontWeight:active?"bold":"normal", color:active?meta.text:"#999", textTransform:"uppercase" }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:meta.dot, margin:"0 auto 4px", opacity:active?1:0.4 }} />{f}
                </button>
              ); })}
            </div>
            <div style={{ padding: "9px 20px", background: fm.lightBg, borderBottom: "1px solid "+fm.border }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize:10, color:fm.text, textTransform:"uppercase", opacity:0.7 }}>{activeFreq} - {periodLabel(getPeriodKey(activeFreq))}</span>
                <span style={{ fontSize:11, color:fm.text, fontWeight:"bold" }}>{overallPct===100&&totalTasks>0?"All done!":doneTasks+" / "+totalTasks}</span>
              </div>
              <div style={{ height:4, background:"rgba(0,0,0,0.08)", borderRadius:4, overflow:"hidden" }}>
                <div style={{ height:"100%", width:overallPct+"%", background:fm.dot, borderRadius:4, transition:"width 0.4s" }} />
              </div>
            </div>
          </>)}
          {taskLayout === "room" && (
            <div style={{ borderBottom: "1px solid #DDD8CE" }}>
              {levels.map(lv => {
                const visibleRooms = lv.rooms.filter(room => frequencies.some(f => getVisibleTasks(room.id, f).length > 0));
                if (visibleRooms.length === 0) return null;
                return (
                  <div key={lv.id}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 16px 4px", borderLeft:"3px solid "+lv.color, background:"#ECEAE3" }}>
                      <span style={{ fontSize:12 }}>{lv.icon}</span>
                      <span style={{ fontSize:10, fontWeight:"bold", color:lv.color, textTransform:"uppercase" }}>{lv.label}</span>
                    </div>
                    <div style={{ display:"flex", gap:6, padding:"6px 12px", overflowX:"auto" }}>
                      {visibleRooms.map(room => { const isActive=activeRoom.id===room.id; return (
                        <button key={room.id} onClick={() => setActiveRoom(room)} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:16, border:"1px solid "+(isActive?lv.color:"#DDD8CE"), background:isActive?lv.color:"#fff", color:isActive?"#fff":"#555", cursor:"pointer", fontFamily:"inherit", fontSize:11, whiteSpace:"nowrap", flexShrink:0 }}>
                          <RoomIcon icon={room.icon} size={13} /><span>{room.name}</span>
                        </button>
                      ); })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FREQUENCY LAYOUT */}
        {taskLayout === "frequency" && (
          <div style={{ padding: "12px 0 48px" }}>
            {levels.map(lv => {
              const lvRooms = lv.rooms.filter(r => getVisibleTasks(r.id, activeFreq).length > 0);
              if (lvRooms.length === 0) return null;
              return (
                <div key={lv.id} style={{ marginBottom: 6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 20px", background:"#ECEAE3", borderLeft:"4px solid "+lv.color }}>
                    <span style={{ fontSize:15 }}>{lv.icon}</span>
                    <span style={{ fontSize:11, fontWeight:"bold", color:lv.color, textTransform:"uppercase" }}>{lv.label}</span>
                  </div>
                  <div style={{ padding: "6px 12px 2px" }}>
                    {lv.rooms.map(room => {
                      const visible = getVisibleTasks(room.id, activeFreq);
                      const full = getTaskList(room.id, activeFreq);
                      if (visible.length === 0) return null;
                      const colKey = room.id+"-"+activeFreq, isOpen = !collapsed[colKey];
                      const doneCount = visible.filter(t => { const fi=full.findIndex(ft=>ft.text===t.text); return fi!==-1&&isDone(room.id+"-"+activeFreq+"-"+fi, t); }).length;
                      const roomPct = visible.length ? Math.round(doneCount/visible.length*100) : 0;
                      const allDone = visible.length > 0 && doneCount === visible.length;
                      return (
                        <div key={room.id} style={{ marginBottom:7, borderRadius:10, overflow:"hidden", border:"1px solid "+(visible.length>0?fm.border:"#E4E0D8"), opacity:visible.length===0?0.5:1 }}>
                          <div onClick={() => visible.length>0&&toggleRoom(colKey)} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", background:allDone?fm.bg:"#fff", cursor:visible.length>0?"pointer":"default" }}>
                            <RoomIcon icon={room.icon} size={17} />
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                                <span style={{ fontSize:13, fontWeight:"bold", color:visible.length===0?"#CCC":"#1A1A1A" }}>{room.name}</span>
                                <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                                  {visible.length>0&&<span style={{ fontSize:11, color:allDone?fm.text:"#AAA", fontWeight:allDone?"bold":"normal" }}>{allDone?"Done":doneCount+"/"+visible.length}</span>}
                                  {visible.length>0&&<span style={{ fontSize:11, color:"#CCC", display:"inline-block", transform:isOpen?"rotate(0deg)":"rotate(-90deg)", transition:"transform 0.2s" }}>v</span>}
                                </div>
                              </div>
                              {visible.length>0&&<div style={{ height:3, background:"#F0EDE6", borderRadius:2, marginTop:5, overflow:"hidden" }}><div style={{ height:"100%", width:roomPct+"%", background:fm.dot, borderRadius:2, transition:"width 0.3s" }} /></div>}
                              {visible.length===0&&<span style={{ fontSize:11, color:"#CCC", fontStyle:"italic" }}>No {activeFreq.toLowerCase()} tasks</span>}
                            </div>
                          </div>
                          {visible.length>0&&isOpen&&(
                            <div style={{ borderTop:"1px solid "+fm.border, background:fm.lightBg }}>
                              {visible.map((task,idx) => <TaskRow key={idx} task={task} roomId={room.id} freq={activeFreq} allTasks={full} isLast={idx===visible.length-1} fmr={fm} />)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {isKidMode && totalTasks === 0 && (
              <div style={{ textAlign:"center", padding:"50px 20px" }}>
                <p style={{ fontSize:28, margin:"0 0 10px" }}>🎉</p>
                <p style={{ fontSize:15, color:"#6DB894", fontWeight:"bold", margin:0 }}>No {activeFreq.toLowerCase()} tasks!</p>
                <p style={{ fontSize:12, color:"#AAA", margin:"6px 0 0" }}>Try another tab or enjoy your free time.</p>
              </div>
            )}
          </div>
        )}

        {/* ROOM LAYOUT */}
        {taskLayout === "room" && (
          <div style={{ padding: "12px 12px 48px" }}>
            {frequencies.map(freq => {
              const visible = getVisibleTasks(activeRoom.id, freq);
              const full = getTaskList(activeRoom.id, freq);
              if (isKidMode && visible.length === 0) return null;
              const fmr=freqMeta[freq], colKey="room-"+activeRoom.id+"-"+freq, isOpen=!collapsed[colKey];
              const doneCount = visible.filter(t => { const fi=full.findIndex(ft=>ft.text===t.text); return fi!==-1&&isDone(activeRoom.id+"-"+freq+"-"+fi, t); }).length;
              const roomPct = visible.length ? Math.round(doneCount/visible.length*100) : 0;
              const allDone = visible.length > 0 && doneCount === visible.length;
              return (
                <div key={freq} style={{ marginBottom:10, borderRadius:10, overflow:"hidden", border:"1px solid "+(visible.length>0?fmr.border:"#E4E0D8"), opacity:visible.length===0?0.4:1 }}>
                  <div onClick={() => visible.length>0&&toggleRoom(colKey)} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", background:allDone?fmr.bg:"#fff", cursor:visible.length>0?"pointer":"default" }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:fmr.dot, flexShrink:0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span style={{ fontSize:11, fontWeight:"bold", color:visible.length===0?"#CCC":fmr.text, textTransform:"uppercase" }}>{freq}</span>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          {visible.length>0&&<span style={{ fontSize:11, color:allDone?fmr.text:"#AAA", fontWeight:allDone?"bold":"normal" }}>{allDone?"Done":doneCount+"/"+visible.length}</span>}
                          {visible.length>0&&<span style={{ fontSize:11, color:"#CCC", display:"inline-block", transform:isOpen?"rotate(0deg)":"rotate(-90deg)", transition:"transform 0.2s" }}>v</span>}
                        </div>
                      </div>
                      {visible.length>0&&<div style={{ height:3, background:"#F0EDE6", borderRadius:2, marginTop:5, overflow:"hidden" }}><div style={{ height:"100%", width:roomPct+"%", background:fmr.dot, borderRadius:2, transition:"width 0.3s" }} /></div>}
                      {visible.length===0&&<span style={{ fontSize:11, color:"#CCC", fontStyle:"italic" }}>No {freq.toLowerCase()} tasks</span>}
                    </div>
                  </div>
                  {visible.length>0&&isOpen&&(
                    <div style={{ borderTop:"1px solid "+fmr.border, background:fmr.lightBg }}>
                      {visible.map((task,idx) => <TaskRow key={idx} task={task} roomId={activeRoom.id} freq={freq} allTasks={full} isLast={idx===visible.length-1} fmr={fmr} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </>)}

      {/* ═══ EDIT VIEW (adults only) ═══ */}
      {view === "edit" && !isKidMode && (() => {
        const inputSt = { width:"100%", fontSize:13, padding:"6px 8px", border:"1px solid #DDD8CE", borderRadius:6, fontFamily:"inherit", boxSizing:"border-box", background:"#fff" };
        const lbSt = { fontSize:10, color:"#888", textTransform:"uppercase", letterSpacing:"0.06em", display:"block", marginBottom:3 };

        // ── Backdate completion picker ───────────────────────────────────────
        // Build list of past 7 days for daily tasks
        function getPastDays(n) {
          const days = [];
          for (let i = 0; i < n; i++) {
            const d = new Date(); d.setDate(d.getDate() - i); d.setHours(12,0,0,0);
            days.push(d);
          }
          return days;
        }
        const pastDays = getPastDays(7);

        function backdateToggle(roomId, freq, taskIndex, memberId, dateTs) {
          const key = roomId + "-" + freq + "-" + taskIndex;
          const personalKey = memberId ? key + "-" + memberId : key;
          setCompletions(prev => {
            const next = { ...prev };
            if (next[personalKey]) {
              delete next[personalKey];
            } else {
              const member = FAMILY.find(f => f.id === memberId) || activeMember;
              next[personalKey] = { by: member.id, name: member.name, color: member.color, at: dateTs, freq, periodKey: getPeriodKey(freq, new Date(dateTs)), baseKey: key };
            }
            saveCompletions(next);
            return next;
          });
        }

        function isCompletedOn(roomId, freq, taskIndex, dateTs) {
          // Check if any completion for this task falls on the given date
          const dateStr = new Date(dateTs).toDateString();
          const key = roomId + "-" + freq + "-" + taskIndex;
          for (const [k, c] of Object.entries(completions)) {
            if (!c || !c.at) continue;
            if (!k.startsWith(key)) continue;
            if (new Date(c.at).toDateString() === dateStr) return { key: k, c };
          }
          return null;
        }

        // Edit form component
        function EditForm({ onSave, onCancel, fmr }) {
          return (
            <div style={{ padding:"12px", background:fmr.bg, border:"1px solid "+fmr.border, borderRadius:10, marginBottom:8 }}>
              <label style={lbSt}>Task Name</label>
              <input autoFocus value={newTaskText} onChange={e=>setNewTaskText(e.target.value)} placeholder="Describe the task..." style={{ ...inputSt, marginBottom:10 }} />

              <label style={lbSt}>Frequency</label>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
                {frequencies.map(f => {
                  const fm2 = freqMeta[f], sel = newTaskEditFreq === f;
                  return <button key={f} onClick={() => setNewTaskEditFreq(f)} style={{ padding:"4px 10px", borderRadius:10, border:"1px solid "+(sel?fm2.dot:"#DDD"), background:sel?fm2.bg:"#fff", color:sel?fm2.text:"#888", cursor:"pointer", fontFamily:"inherit", fontSize:10, fontWeight:sel?"bold":"normal" }}>{f}</button>;
                })}
              </div>

              <label style={lbSt}>Assigned To</label>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
                {FAMILY.map(m => (
                  <button key={m.id} onClick={() => setNewTaskAssignees(prev=>prev.includes(m.id)?prev.filter(x=>x!==m.id):[...prev,m.id])} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:12, border:"1px solid "+(newTaskAssignees.includes(m.id)?m.color:"#DDD"), background:newTaskAssignees.includes(m.id)?m.color+"22":"#fff", cursor:"pointer", fontFamily:"inherit", fontSize:11 }}>
                    <Avatar member={m} size={16} fontSize={8} />
                    <span style={{ color:newTaskAssignees.includes(m.id)?m.color:"#777" }}>{m.name}</span>
                  </button>
                ))}
              </div>

              <label style={lbSt}>Estimated Time</label>
              <select value={newTaskTime} onChange={e=>setNewTaskTime(e.target.value)} style={{ ...inputSt, marginBottom:12, appearance:"none", backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat:"no-repeat", backgroundPosition:"right 10px center", paddingRight:30 }}>
                <option value="">-- Select time --</option>
                <option value="0-5 min">0–5 minutes</option>
                <option value="6-15 min">6–15 minutes</option>
                <option value="16-30 min">16–30 minutes</option>
                <option value="31 min - 1 hr">31 minutes – 1 hour</option>
                <option value="1-2 hrs">1–2 hours</option>
                <option value="2-4 hrs">2–4 hours</option>
                <option value="4+ hrs">More than 4 hours</option>
              </select>

              <div style={{ display:"flex", gap:6 }}>
                <button onClick={onSave} style={{ flex:1, padding:"8px", background:"#1A1A1A", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:"bold" }}>Save</button>
                <button onClick={onCancel} style={{ padding:"8px 14px", background:"#fff", border:"1px solid #DDD", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontSize:12, color:"#888" }}>Cancel</button>
              </div>
            </div>
          );
        }

        return (
          <div style={{ paddingBottom: 60 }}>
            {/* Edit sub-mode toggle */}
            <div style={{ display:"flex", justifyContent:"center", padding:"10px 16px 0", background:"#F5F2EC" }}>
              <div style={{ display:"flex", background:"#ECEAE3", borderRadius:20, padding:3, gap:2 }}>
                {[["tasks","Edit Tasks"],["backdate","Back-Date"]].map(([v,lbl]) => (
                  <button key={v} onClick={() => setEditSubMode(v)} style={{ padding:"5px 14px", borderRadius:16, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:editSubMode===v?"bold":"normal", background:editSubMode===v?"#1A1A1A":"transparent", color:editSubMode===v?"#F5F2EC":"#888" }}>{lbl}</button>
                ))}
              </div>
            </div>

            {/* ── TASK EDIT MODE ── */}
            {editSubMode === "tasks" && (<>
              {/* Task layout toggle */}
              <div style={{ display:"flex", justifyContent:"center", padding:"8px 16px 0" }}>
                <div style={{ display:"flex", background:"#ECEAE3", borderRadius:20, padding:3, gap:2 }}>
                  {[["frequency","By Frequency"],["room","By Room"]].map(([v,lbl]) => (
                    <button key={v} onClick={() => setEditTaskLayout(v)} style={{ padding:"5px 14px", borderRadius:16, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:editTaskLayout===v?"bold":"normal", background:editTaskLayout===v?"#1A1A1A":"transparent", color:editTaskLayout===v?"#F5F2EC":"#888" }}>{lbl}</button>
                  ))}
                </div>
              </div>

              {/* BY FREQUENCY */}
              {editTaskLayout === "frequency" && (
                <div style={{ padding:"10px 12px 0" }}>
                  {frequencies.map(freq => {
                    // Collect all rooms that have tasks for this freq
                    const roomsWithTasks = allRooms.filter(room => getTaskList(room.id, freq).length > 0);
                    const fmr = freqMeta[freq];
                    const totalTasks = roomsWithTasks.reduce((s, r) => s + getTaskList(r.id, freq).length, 0);
                    const colKey = "editfreq-" + freq;
                    const isOpen = !collapsed[colKey];
                    return (
                      <div key={freq} style={{ marginBottom:12 }}>
                        <div onClick={() => toggleRoom(colKey)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px", background:fmr.bg, border:"1px solid "+fmr.border, borderRadius:10, cursor:"pointer", marginBottom:isOpen?0:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ width:8, height:8, borderRadius:"50%", background:fmr.dot }} />
                            <span style={{ fontSize:12, fontWeight:"bold", color:fmr.text, textTransform:"uppercase" }}>{freq}</span>
                            <span style={{ fontSize:10, color:"#BBB" }}>({totalTasks} tasks)</span>
                          </div>
                          <span style={{ fontSize:10, color:fmr.text }}>{isOpen?"▲":"▼"}</span>
                        </div>
                        {isOpen && (
                          <div style={{ border:"1px solid "+fmr.border, borderTop:"none", borderRadius:"0 0 10px 10px", overflow:"hidden" }}>
                            {roomsWithTasks.map((room, ri) => {
                              const tasks = getTaskList(room.id, freq);
                              const level = levels.find(l => l.rooms.some(r => r.id === room.id));
                              return (
                                <div key={room.id} style={{ borderTop: ri > 0 ? "1px solid "+fmr.border : "none" }}>
                                  <div style={{ padding:"6px 12px", background:fmr.lightBg, display:"flex", alignItems:"center", gap:6 }}>
                                    <RoomIcon icon={room.icon} size={13} />
                                    <span style={{ fontSize:11, fontWeight:"bold", color:"#555" }}>{room.name}</span>
                                    {level && <span style={{ fontSize:9, color:level.color, fontWeight:"bold" }}>{level.label}</span>}
                                  </div>
                                  {tasks.map((task, i) => (
                                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"8px 12px", borderTop:"1px solid "+fmr.border+"66", background:"#fff" }}>
                                      <div style={{ flex:1, minWidth:0 }}>
                                        <p style={{ margin:0, fontSize:12, color:"#1A1A1A" }}>{task.text}</p>
                                        <div style={{ display:"flex", gap:5, marginTop:3, flexWrap:"wrap", alignItems:"center" }}>
                                          {task.assignees?.length > 0 && task.assignees.map(aid => { const m=FAMILY.find(f=>f.id===aid); return m?<Avatar key={aid} member={m} size={14} fontSize={7} />:null; })}
                                          {task.time && <span style={{ fontSize:9, color:"#AAA", background:"#F5F2EC", padding:"1px 5px", borderRadius:5 }}>~{task.time}</span>}
                                        </div>
                                      </div>
                                      <button onClick={() => { setEditRoom(room); setEditLevel(level||levels[0]); setEditingTask({roomId:room.id,freq,index:i}); setNewTaskText(task.text); setNewTaskAssignees(task.assignees||[]); setNewTaskTime(task.time||""); setNewTaskEditFreq(freq); setShowAddTask(false); setEditTaskLayout("room"); }} style={{ fontSize:10, color:"#AAA", background:"none", border:"none", cursor:"pointer", padding:"3px 5px", flexShrink:0 }}>Edit</button>
                                      <button onClick={() => { const updated=(prev=>{ const snap=ensureSnapshot(room.id,freq,prev); return {...snap,[room.id]:{...snap[room.id],[freq]:snap[room.id][freq].filter((_,idx)=>idx!==i)}}; })(customTasks); setCustomTasks(updated); saveCustomTasks(updated); }} style={{ fontSize:10, color:"#D47F6B", background:"none", border:"none", cursor:"pointer", padding:"3px 5px", flexShrink:0 }}>Del</button>
                                    </div>
                                  ))}
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

              {/* BY ROOM */}
              {editTaskLayout === "room" && (<>
                <div style={{ display:"flex", background:"#ECEAE3", borderBottom:"1px solid #DDD8CE" }}>
                  {levels.map(lv => (
                    <button key={lv.id} onClick={() => { setEditLevel(lv); setEditRoom(lv.rooms[0]); setShowAddTask(false); setEditingTask(null); }} style={{ flex:1, background:editLevel.id===lv.id?lv.color+"18":"none", border:"none", padding:"12px 4px 10px", cursor:"pointer", fontFamily:"inherit", fontSize:10, fontWeight:editLevel.id===lv.id?"bold":"normal", color:editLevel.id===lv.id?lv.color:"#999", borderBottom:editLevel.id===lv.id?"3px solid "+lv.color:"3px solid transparent", textTransform:"uppercase" }}>
                      <div style={{ fontSize:16, marginBottom:3 }}>{lv.icon}</div>{lv.label}
                    </button>
                  ))}
                </div>
                <div style={{ padding:"10px 12px 0", display:"flex", gap:6, overflowX:"auto" }}>
                  {editLevel.rooms.map(room => (
                    <button key={room.id} onClick={() => { setEditRoom(room); setShowAddTask(false); setEditingTask(null); }} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:16, border:"1px solid "+(editRoom.id===room.id?editLevel.color:"#DDD8CE"), background:editRoom.id===room.id?editLevel.color:"#fff", color:editRoom.id===room.id?"#fff":"#555", cursor:"pointer", fontFamily:"inherit", fontSize:11, whiteSpace:"nowrap", flexShrink:0 }}>
                      <RoomIcon icon={room.icon} size={13} /><span>{room.name}</span>
                    </button>
                  ))}
                </div>
                <div style={{ padding:"12px 12px 0" }}>
                  {frequencies.map(freq => {
                    const tasks = getTaskList(editRoom.id, freq);
                    const fmr = freqMeta[freq];
                    return (
                      <div key={freq} style={{ marginBottom:16 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ width:8, height:8, borderRadius:"50%", background:fmr.dot }} />
                            <span style={{ fontSize:11, fontWeight:"bold", color:fmr.text, textTransform:"uppercase" }}>{freq}</span>
                            <span style={{ fontSize:10, color:"#BBB" }}>({tasks.length})</span>
                          </div>
                          <button onClick={() => { setShowAddTask(true); setNewTaskFreq(freq); setNewTaskEditFreq(freq); setNewTaskText(""); setNewTaskAssignees([]); setNewTaskTime(""); setEditingTask(null); }} style={{ fontSize:11, color:fmr.text, background:fmr.bg, border:"1px solid "+fmr.border, borderRadius:10, padding:"3px 10px", cursor:"pointer", fontFamily:"inherit" }}>+ Add</button>
                        </div>
                        {showAddTask && newTaskFreq===freq && editingTask===null && (
                          <EditForm fmr={fmr}
                            onSave={() => {
                              if (!newTaskText.trim()) return;
                              const tgt = newTaskEditFreq;
                              const updated = (prev => { const snap=ensureSnapshot(editRoom.id,tgt,prev); return {...snap,[editRoom.id]:{...snap[editRoom.id],[tgt]:[...snap[editRoom.id][tgt],{text:newTaskText.trim(),assignees:newTaskAssignees,time:newTaskTime.trim()}]}}; })(customTasks);
                              setCustomTasks(updated); saveCustomTasks(updated);
                              setShowAddTask(false); setNewTaskText(""); setNewTaskAssignees([]); setNewTaskTime("");
                            }}
                            onCancel={() => { setShowAddTask(false); setNewTaskText(""); setNewTaskAssignees([]); setNewTaskTime(""); }}
                          />
                        )}
                        {tasks.length===0 && !(showAddTask && newTaskFreq===freq) && <p style={{ fontSize:12, color:"#CCC", fontStyle:"italic", margin:"0 0 4px" }}>No {freq.toLowerCase()} tasks</p>}
                        {tasks.map((task, i) => (
                          <div key={i} style={{ marginBottom:5 }}>
                            {editingTask?.roomId===editRoom.id && editingTask?.freq===freq && editingTask?.index===i ? (
                              <EditForm fmr={fmr}
                                onSave={() => {
                                  if (!newTaskText.trim()) return;
                                  const tgt = newTaskEditFreq;
                                  let updated = (prev => { const snap=ensureSnapshot(editRoom.id,freq,prev); return {...snap,[editRoom.id]:{...snap[editRoom.id],[freq]:snap[editRoom.id][freq].filter((_,idx)=>idx!==i)}}; })(customTasks);
                                  updated = (prev => { const snap=ensureSnapshot(editRoom.id,tgt,prev); return {...snap,[editRoom.id]:{...snap[editRoom.id],[tgt]:[...snap[editRoom.id][tgt],{text:newTaskText.trim(),assignees:newTaskAssignees,time:newTaskTime.trim()}]}}; })(updated);
                                  setCustomTasks(updated); saveCustomTasks(updated);
                                  setEditingTask(null); setNewTaskText(""); setNewTaskAssignees([]); setNewTaskTime("");
                                }}
                                onCancel={() => { setEditingTask(null); setNewTaskText(""); setNewTaskAssignees([]); setNewTaskTime(""); }}
                              />
                            ) : (
                              <div style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"9px 12px", background:"#fff", border:"1px solid #E4E0D8", borderRadius:10 }}>
                                <div style={{ flex:1, minWidth:0 }}>
                                  <p style={{ margin:0, fontSize:13, color:"#1A1A1A" }}>{task.text}</p>
                                  <div style={{ display:"flex", gap:6, marginTop:4, flexWrap:"wrap", alignItems:"center" }}>
                                    {task.assignees?.length > 0 && task.assignees.map(aid => { const m=FAMILY.find(f=>f.id===aid); return m?<Avatar key={aid} member={m} size={16} fontSize={8} />:null; })}
                                    {task.time && <span style={{ fontSize:10, color:"#AAA", background:"#F5F2EC", padding:"1px 6px", borderRadius:6 }}>~{task.time}</span>}
                                  </div>
                                </div>
                                <button onClick={() => { setEditingTask({roomId:editRoom.id,freq,index:i}); setNewTaskText(task.text); setNewTaskAssignees(task.assignees||[]); setNewTaskTime(task.time||""); setNewTaskEditFreq(freq); setShowAddTask(false); }} style={{ fontSize:11, color:"#AAA", background:"none", border:"none", cursor:"pointer", padding:"4px 6px", flexShrink:0 }}>Edit</button>
                                <button onClick={() => { const updated=(prev=>{ const snap=ensureSnapshot(editRoom.id,freq,prev); return {...snap,[editRoom.id]:{...snap[editRoom.id],[freq]:snap[editRoom.id][freq].filter((_,idx)=>idx!==i)}}; })(customTasks); setCustomTasks(updated); saveCustomTasks(updated); }} style={{ fontSize:11, color:"#D47F6B", background:"none", border:"none", cursor:"pointer", padding:"4px 6px", flexShrink:0 }}>Delete</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </>)}
            </>)}

            {/* ── BACK-DATE MODE ── */}
            {editSubMode === "backdate" && (
              <div style={{ padding: "10px 12px 0" }}>
                <p style={{ margin: "0 0 10px", fontSize: 11, color: "#888" }}>Pick a day to view and edit completions. Tap any row to check or uncheck. Updates points and allowance instantly.</p>

                {/* Day selector — past 7 days */}
                <div style={{ display: "flex", gap: 5, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
                  {pastDays.map((d, i) => {
                    const isSelected = backdateSelectedDay === d.toDateString();
                    const isToday = i === 0;
                    return (
                      <button key={i} onClick={() => setBackdateSelectedDay(d.toDateString())} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 12, border: "1px solid " + (isSelected ? "#5B9BD5" : "#DDD8CE"), background: isSelected ? "#5B9BD5" : isToday ? "#EBF4FC" : "#fff", color: isSelected ? "#fff" : isToday ? "#1A4F7A" : "#555", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: isSelected ? "bold" : "normal" }}>
                        {isToday ? "Today" : d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                      </button>
                    );
                  })}
                </div>

                {backdateSelectedDay && (() => {
                  const selDate = pastDays.find(d => d.toDateString() === backdateSelectedDay) || new Date();
                  const selDateStr = selDate.toDateString();
                  const selTs = selDate.getTime();

                  // Determine which frequencies apply to this day
                  // Daily: every day. Weekly: if day is in current week. Monthly: any day this month. Quarterly/Annually: any day this year.
                  const now2 = new Date();
                  const relevantFreqs = frequencies.filter(freq => {
                    const pk = getPeriodKey(freq, selDate);
                    const pkNow = getPeriodKey(freq, now2);
                    // Show freq if selected day falls in current or recent period for that freq
                    if (freq === "Daily") return true;
                    if (freq === "Weekly") {
                      // Same week as selDate
                      const wDay = selDate.getDay();
                      const wSun = new Date(selDate); wSun.setDate(selDate.getDate() - wDay); wSun.setHours(0,0,0,0);
                      const wSat = new Date(wSun); wSat.setDate(wSun.getDate() + 6); wSat.setHours(23,59,59,999);
                      return selTs >= wSun.getTime() && selTs <= wSat.getTime();
                    }
                    if (freq === "Monthly") {
                      return selDate.getMonth() === now2.getMonth() && selDate.getFullYear() === now2.getFullYear();
                    }
                    // Quarterly/Annually — only show for current quarter/year
                    return pk === pkNow;
                  });

                  // Build a unified completions lookup that includes both live and archive data
                  // Key → completion object
                  const allCompletions = {};
                  // Archive first (lower priority)
                  Object.values(allArchiveData).forEach(d => {
                    Object.entries(d).forEach(([k, c]) => { if (c && c.at) allCompletions[k] = c; });
                  });
                  // Live completions override (higher priority)
                  Object.entries(completions).forEach(([k, c]) => { if (c && c.at) allCompletions[k] = c; });

                  const isCheckedByMember = (roomId, freq, taskIndex, memberId) => {
                    const baseKey = roomId + "-" + freq + "-" + taskIndex;
                    const memberKey = baseKey + "-" + memberId;
                    // Check member-specific key first, then shared key
                    for (const k of [memberKey, baseKey]) {
                      const c = allCompletions[k];
                      if (c && c.at && new Date(c.at).toDateString() === selDateStr && c.by === memberId) return k;
                    }
                    return null;
                  }

                  const toggleBackdate = (roomId, freq, taskIndex, member, isCurrentlyDone, doneKey) => {
                    const baseKey = roomId + "-" + freq + "-" + taskIndex;
                    const memberKey = member.isKid ? baseKey + "-" + member.id : baseKey;

                    if (isCurrentlyDone && doneKey) {
                      // Remove completion — from live completions
                      setCompletions(prev => {
                        const next = { ...prev };
                        delete next[doneKey];
                        saveCompletions(next);
                        return next;
                      });
                    } else {
                      // Add completion with the correct backdated timestamp
                      // Use noon on the selected day so it falls squarely within that period
                      const noon = new Date(selDate); noon.setHours(12, 0, 0, 0);
                      const entry = {
                        by: member.id, name: member.name, color: member.color,
                        at: noon.getTime(),
                        freq,
                        periodKey: getPeriodKey(freq, noon),
                        baseKey,
                      };
                      setCompletions(prev => {
                        const next = { ...prev, [memberKey]: entry };
                        saveCompletions(next);
                        return next;
                      });
                    }
                  }

                  const getRelevantMembers = (task, roomId) => {
                    const nameTag = task.text.match(/\((\w+)\)$/);
                    return FAMILY.filter(member => {
                      if (nameTag) return nameTag[1].toLowerCase() === member.name.toLowerCase();
                      if (member.isKid) return roomId === member.ownRoomId || (task.assignees || []).includes(member.id);
                      return true;
                    });
                  }

                  // Build tasks grouped by room, filtered to relevant frequencies
                  const tasksByRoom = {};
                  relevantFreqs.forEach(freq => {
                    allRooms.forEach(room => {
                      const tasks = getTaskList(room.id, freq);
                      if (tasks.length === 0) return;
                      if (!tasksByRoom[room.id]) {
                        const level = levels.find(l => l.rooms.some(r => r.id === room.id));
                        tasksByRoom[room.id] = { room, level, freqGroups: {} };
                      }
                      tasksByRoom[room.id].freqGroups[freq] = tasks;
                    });
                  });

                  if (Object.keys(tasksByRoom).length === 0) {
                    return <p style={{ fontSize: 12, color: "#CCC", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>No tasks found for this day.</p>;
                  }

                  return (
                    <div>
                      {Object.values(tasksByRoom).map(({ room, level, freqGroups }) => (
                        <div key={room.id} style={{ marginBottom: 10 }}>
                          {Object.entries(freqGroups).map(([freq, tasks]) => {
                            const fmr = freqMeta[freq];
                            // Filter to tasks that have at least one relevant member
                            const visibleTasks = tasks.filter(task => getRelevantMembers(task, room.id).length > 0);
                            if (visibleTasks.length === 0) return null;
                            return (
                              <div key={freq} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid " + fmr.border, marginBottom: 8 }}>
                                {/* Room + freq header */}
                                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: fmr.bg }}>
                                  <RoomIcon icon={room.icon} size={15} />
                                  <span style={{ fontSize: 12, fontWeight: "bold", color: fmr.text, flex: 1 }}>{room.name}</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: fmr.dot }} />
                                    <span style={{ fontSize: 9, fontWeight: "bold", color: fmr.text, textTransform: "uppercase", letterSpacing: "0.08em" }}>{freq}</span>
                                  </div>
                                  {level && <span style={{ fontSize: 9, color: level.color, fontWeight: "bold" }}>{level.label}</span>}
                                </div>

                                {/* Task rows — styled exactly like the tasks view */}
                                {visibleTasks.map((task, taskIndex) => {
                                  const relevant = getRelevantMembers(task, room.id);
                                  const isMultiPerson = relevant.length > 1;

                                  if (isMultiPerson) {
                                    // Per-person rows for name-tagged / multi-assigned tasks
                                    return (
                                      <div key={taskIndex} style={{ borderTop: "1px solid " + fmr.border, background: fmr.lightBg, padding: "10px 14px" }}>
                                        <div style={{ marginBottom: 7 }}>
                                          <span style={{ fontSize: 13, color: fmr.text }}>{task.text}</span>
                                          {task.time && <span style={{ fontSize: 9, color: "#AAA", background: "#F5F2EC", padding: "1px 6px", borderRadius: 6, marginLeft: 6 }}>~{task.time}</span>}
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                          {relevant.map(member => {
                                            const doneKey = isCheckedByMember(room.id, freq, taskIndex, member.id);
                                            const done = !!doneKey;
                                            const completion = doneKey ? allCompletions[doneKey] : null;
                                            const completedBy = completion ? FAMILY.find(f => f.id === completion.by) : null;
                                            return (
                                              <div key={member.id}
                                                onClick={() => toggleBackdate(room.id, freq, taskIndex, member, done, doneKey)}
                                                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: done ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                                                <div style={{ width: 19, height: 19, borderRadius: "50%", flexShrink: 0, border: "2px solid " + (done ? member.color : "#CCC"), background: done ? member.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                  {done && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                                </div>
                                                <Avatar member={member} size={22} fontSize={10} />
                                                <span style={{ fontSize: 12, color: done ? "#AAA" : "#555", textDecoration: done ? "line-through" : "none", flex: 1 }}>{member.name}</span>
                                                {done && completedBy && (
                                                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                                    {completedBy.id !== member.id && (
                                                      <><Avatar member={completedBy} size={18} fontSize={8} /><span style={{ fontSize: 9, color: completedBy.color, fontWeight: "bold" }}>{completedBy.name}</span></>
                                                    )}
                                                    <span style={{ fontSize: 9, color: "#CCC" }}>{fmt(completion.at)}</span>
                                                  </div>
                                                )}
                                                {!done && <span style={{ fontSize: 9, color: "#CCC" }}>not done</span>}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  }

                                  // Single-person task — styled exactly like TaskRow
                                  const member = relevant[0];
                                  const doneKey = isCheckedByMember(room.id, freq, taskIndex, member.id);
                                  const done = !!doneKey;
                                  const completion = doneKey ? allCompletions[doneKey] : null;
                                  const completedBy = completion ? FAMILY.find(f => f.id === completion.by) : null;
                                  const isLast = taskIndex === visibleTasks.length - 1;

                                  return (
                                    <div key={taskIndex}
                                      onClick={() => toggleBackdate(room.id, freq, taskIndex, member, done, doneKey)}
                                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderTop: "1px solid " + fmr.border, cursor: "pointer", background: done ? "rgba(255,255,255,0.6)" : fmr.lightBg }}>
                                      {/* Circle checkbox */}
                                      <div style={{ width: 19, height: 19, borderRadius: "50%", flexShrink: 0, border: "2px solid " + (done ? (completedBy?.color || member.color) : "#CCC"), background: done ? (completedBy?.color || member.color) : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {done && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                      </div>
                                      {/* Task text + time */}
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ fontSize: 13, color: done ? "#AAA" : fmr.text, textDecoration: done ? "line-through" : "none" }}>{task.text}</span>
                                        {task.time && <div><span style={{ fontSize: 9, color: done ? "#CCC" : "#AAA", background: "#F5F2EC", padding: "1px 6px", borderRadius: 6, marginTop: 3, display: "inline-block" }}>~{task.time}</span></div>}
                                      </div>
                                      {/* Completer avatar + time — shown when done */}
                                      {done && completedBy && (
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                          <Avatar member={completedBy} size={24} fontSize={11} />
                                          <div style={{ textAlign: "right" }}>
                                            <p style={{ margin: 0, fontSize: 10, color: completedBy.color, fontWeight: "bold", lineHeight: 1.2 }}>{completedBy.name}</p>
                                            <p style={{ margin: 0, fontSize: 9, color: "#CCC", lineHeight: 1.2 }}>{fmt(completion.at)}</p>
                                          </div>
                                        </div>
                                      )}
                                      {!done && <span style={{ fontSize: 9, color: "#CCC", flexShrink: 0 }}>tap to mark done</span>}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        );
      })()}


      {/* ═══ NOTIFY VIEW (adults only) ═══ */}
      {view === "notify" && !isKidMode && (() => {
        if (!notifyConfigLoaded) return <div style={{ padding: 20, color: "#AAA", fontFamily: "Georgia, serif" }}>Loading...</div>;

        const cfg = notifyConfig || {};
        const kidsCfg = cfg.kids || {};
        const notifyKids = FAMILY.filter(f => f.id === "zach" || f.id === "kyle");
        const dayLabels = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

        const inSt = { fontSize: 13, padding: "7px 10px", border: "1px solid #DDD8CE", borderRadius: 8, fontFamily: "inherit", background: "#fff", boxSizing: "border-box", width: "100%" };
        const lbSt = { fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 };

        const updateKid = (kidId, field, value) => {
          const updated = { ...cfg, kids: { ...kidsCfg, [kidId]: { ...(kidsCfg[kidId]||{}), [field]: value } } };
          saveNotifyConfig(updated);
        };

        const toggleDay = (kidId, day) => {
          const days = kidsCfg[kidId]?.days || [0,1,2,3,4,5,6];
          const next = days.includes(day) ? days.filter(d => d !== day) : [...days, day].sort();
          updateKid(kidId, "days", next);
        };

        const sendTest = async (kidId) => {
          const k = kidsCfg[kidId] || {};
          const kid = FAMILY.find(f => f.id === kidId);
          const haBase = (k.haUrl || cfg.haUrl || "").replace(/\/$/, "");
          const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + cfg.haToken };
          const body = JSON.stringify({ message: "Test notification from Cleaning Schedule for " + kid?.name, title: "Chores Reminder 🧹" });
          setNotifyTestStatus(p => ({ ...p, [kidId]: "sending" }));
          try {
            let sent = false;
            if (k.notifyKid && k.kidTarget) {
              await fetch(haBase + "/api/services/notify/" + k.kidTarget.replace("notify.",""), { method:"POST", headers, body });
              sent = true;
            }
            if (k.notifyParent && k.parentTarget) {
              const parentTargets = k.parentTarget.split("\n").map(t => t.trim()).filter(Boolean);
              for (const t of parentTargets) {
                await fetch(haBase + "/api/services/notify/" + t.replace("notify.",""), { method:"POST", headers, body });
              }
              sent = true;
            }
            setNotifyTestStatus(p => ({ ...p, [kidId]: sent ? "sent" : "no-target" }));
          } catch (e) {
            setNotifyTestStatus(p => ({ ...p, [kidId]: "error" }));
          }
          setTimeout(() => setNotifyTestStatus(p => ({ ...p, [kidId]: null })), 4000);
        };

        return (
          <div style={{ paddingBottom: 60 }}>
            <div style={{ padding: "14px 14px 8px" }}>
              <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: "bold", color: "#1A1A1A" }}>Push Notifications</p>
              <p style={{ margin: 0, fontSize: 11, color: "#AAA" }}>Send reminders via Home Assistant when tasks aren't done by a set time.</p>
            </div>

            {/* HA Connection */}
            <div style={{ margin: "0 14px 16px", background: "#fff", borderRadius: 14, border: "1px solid #E4E0D8", padding: "14px" }}>
              <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: "bold", color: "#1A1A1A" }}>Home Assistant Connection</p>
              <div style={{ marginBottom: 10 }}>
                <label style={lbSt}>HA URL (e.g. http://homeassistant.local:8123)</label>
                <input value={cfg.haUrl || ""} onChange={e => saveNotifyConfig({ ...cfg, haUrl: e.target.value })} placeholder="http://homeassistant.local:8123" style={inSt} />
              </div>
              <div>
                <label style={lbSt}>Long-Lived Access Token</label>
                <input type="password" value={cfg.haToken || ""} onChange={e => saveNotifyConfig({ ...cfg, haToken: e.target.value })} placeholder="Paste token from HA → Profile → Security" style={inSt} />
              </div>
              {cfg.haToken && (
                <p style={{ margin: "8px 0 0", fontSize: 10, color: "#6DB894" }}>✓ Token saved</p>
              )}
              <div style={{ margin: "12px 0 0", padding: "10px 12px", background: "#F5F2EC", borderRadius: 8 }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: "bold", color: "#555" }}>How to get a token:</p>
                <p style={{ margin: 0, fontSize: 10, color: "#888", lineHeight: 1.5 }}>In HA → click your profile (bottom left) → Security tab → scroll to Long-Lived Access Tokens → Create Token → copy and paste above.</p>
              </div>
            </div>

            {/* Per-kid config */}
            {notifyKids.map(kid => {
              const k = kidsCfg[kid.id] || { enabled: false, kidTarget: "", parentTarget: "", notifyKid: false, notifyParent: true, time: "19:00", days: [0,1,2,3,4,5,6] };
              const testStatus = notifyTestStatus[kid.id];
              return (
                <div key={kid.id} style={{ margin: "0 14px 14px", background: "#fff", borderRadius: 14, border: "2px solid " + kid.color + (k.enabled ? "88" : "33"), overflow: "hidden" }}>
                  {/* Header + enable toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: kid.color + (k.enabled ? "15" : "08") }}>
                    <Avatar member={kid} size={28} fontSize={12} />
                    <span style={{ fontSize: 13, fontWeight: "bold", color: kid.color, flex: 1 }}>{kid.name}</span>
                    <button
                      onClick={() => updateKid(kid.id, "enabled", !k.enabled)}
                      style={{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: "bold", background: k.enabled ? kid.color : "#DDD", color: k.enabled ? "#fff" : "#888" }}>
                      {k.enabled ? "On" : "Off"}
                    </button>
                  </div>

                  {k.enabled && (
                    <div style={{ padding: "12px 14px" }}>
                      {/* Reminder time */}
                      <div style={{ marginBottom: 12 }}>
                        <label style={lbSt}>Reminder Time</label>
                        <input type="time" value={k.time || "19:00"} onChange={e => updateKid(kid.id, "time", e.target.value)} style={{ ...inSt, width: "auto" }} />
                      </div>

                      {/* Days */}
                      <div style={{ marginBottom: 12 }}>
                        <label style={lbSt}>Active Days</label>
                        <div style={{ display: "flex", gap: 5 }}>
                          {dayLabels.map((d, i) => {
                            const active = (k.days || []).includes(i);
                            return (
                              <button key={i} onClick={() => toggleDay(kid.id, i)} style={{ flex: 1, padding: "5px 2px", borderRadius: 8, border: "1px solid " + (active ? kid.color : "#DDD"), background: active ? kid.color : "#fff", color: active ? "#fff" : "#888", cursor: "pointer", fontFamily: "inherit", fontSize: 10, fontWeight: active ? "bold" : "normal" }}>{d}</button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Who to notify */}
                      <div style={{ marginBottom: 12 }}>
                        <label style={lbSt}>Who to Notify</label>
                        <div style={{ display: "flex", gap: 8 }}>
                          {[["notifyKid","Kid's device"],["notifyParent","Parent's device"]].map(([field, label]) => (
                            <button key={field} onClick={() => updateKid(kid.id, field, !k[field])} style={{ flex: 1, padding: "7px", borderRadius: 8, border: "1px solid " + (k[field] ? kid.color : "#DDD"), background: k[field] ? kid.color + "15" : "#fff", color: k[field] ? kid.color : "#888", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: k[field] ? "bold" : "normal" }}>{label}</button>
                          ))}
                        </div>
                      </div>

                      {/* Notify targets */}
                      {k.notifyKid && (
                        <div style={{ marginBottom: 10 }}>
                          <label style={lbSt}>Kid's HA Notify Service (e.g. mobile_app_zachs_phone)</label>
                          <input value={k.kidTarget || ""} onChange={e => updateKid(kid.id, "kidTarget", e.target.value)} placeholder="mobile_app_zachs_phone" style={inSt} />
                        </div>
                      )}
                      {k.notifyParent && (
                        <div style={{ marginBottom: 12 }}>
                          <label style={lbSt}>Parent Device(s) — one notify service per line</label>
                          <textarea
                            value={k.parentTarget || ""}
                            onChange={e => updateKid(kid.id, "parentTarget", e.target.value)}
                            placeholder={"mobile_app_dads_phone\nmobile_app_moms_phone"}
                            rows={3}
                            style={{ ...inSt, resize: "vertical", lineHeight: 1.5, fontFamily: "monospace", fontSize: 12 }}
                          />
                          <p style={{ margin: "3px 0 0", fontSize: 9, color: "#AAA" }}>Add one service name per line to notify multiple devices</p>
                        </div>
                      )}

                      {/* Test button */}
                      <button
                        onClick={() => sendTest(kid.id)}
                        disabled={testStatus === "sending"}
                        style={{ width: "100%", padding: "9px", background: testStatus === "sent" ? "#6DB894" : testStatus === "error" ? "#D47F6B" : "#1A1A1A", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: "bold" }}>
                        {testStatus === "sending" ? "Sending..." : testStatus === "sent" ? "✓ Test Sent!" : testStatus === "error" ? "✗ Error — check URL & token" : testStatus === "no-target" ? "No target set" : "Send Test Notification"}
                      </button>

                      {/* Last sent info */}
                      {notifyConfig?.sentToday?.[kid.id + "-" + getPeriodKey("Daily")] && (
                        <p style={{ margin: "8px 0 0", fontSize: 10, color: "#AAA", textAlign: "center" }}>
                          Reminder sent today at {fmt(notifyConfig.sentToday[kid.id + "-" + getPeriodKey("Daily")])}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ margin: "0 14px", padding: "12px 14px", background: "#F5F2EC", borderRadius: 12, border: "1px solid #E4E0D8" }}>
              <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: "bold", color: "#555" }}>How to find your notify service name:</p>
              <p style={{ margin: 0, fontSize: 10, color: "#888", lineHeight: 1.6 }}>
                In HA → Developer Tools → Services → search "notify" → you'll see entries like <strong>notify.mobile_app_your_phone</strong>. Each phone with the HA Companion app installed has its own entry. Use just the part after "notify." in the field above.
              </p>
            </div>
          </div>
        );
      })()}


    </div>
  );
}
