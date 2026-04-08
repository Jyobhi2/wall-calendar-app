import { useState, useEffect } from "react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const IMAGES = [
  "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800",
  "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=800",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
  "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
  "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800",
  "https://images.unsplash.com/photo-1467173572719-f14b9fb86e5f?w=800",
];

const HOLIDAYS = {
  "1-1": "🎉 New Year",
  "1-14": "🌾 Pongal",
  "1-26": "🇮🇳 Republic Day",
  "2-14": "❤️ Valentine",
  "3-8": "👩 Women's Day",
  "8-15": "🇮🇳 Independence",
  "10-2": "🕊 Gandhi Jayanti",
  "10-31": "🎃 Halloween",
  "12-25": "🎄 Christmas"
};

const key = (y,m,d) => `${y}-${m}-${d}`;

export default function WallCalendar() {

  const today = new Date();
  const todayKey = key(today.getFullYear(), today.getMonth(), today.getDate());

  const [month,setMonth] = useState(today.getMonth());
  const [year,setYear] = useState(today.getFullYear());

  const [start,setStart] = useState(null);
  const [end,setEnd] = useState(null);
  const [hover,setHover] = useState(null);

  const [notes,setNotes] = useState({});
  const [input,setInput] = useState("");

  useEffect(()=>{
    const saved = localStorage.getItem("cal-notes");
    if(saved) setNotes(JSON.parse(saved));
  },[]);

  useEffect(()=>{
    localStorage.setItem("cal-notes", JSON.stringify(notes));
  },[notes]);

  const daysInMonth = new Date(year,month+1,0).getDate();
  let firstDay = new Date(year,month,1).getDay();
  firstDay = firstDay===0?6:firstDay-1;

  function handleClick(d){
    const k = key(year,month,d);

    if(!start || (start && end)){
      setStart(k); setEnd(null);
    } else {
      if(new Date(k) < new Date(start)){
        setEnd(start);
        setStart(k);
      } else {
        setEnd(k);
      }
    }
  }

  function inRange(k){
    if(!start || !end) return false;
    return new Date(k)>=new Date(start) && new Date(k)<=new Date(end);
  }

  function previewRange(k){
    if(!start || end || !hover) return false;
    return new Date(k)>=new Date(start) && new Date(k)<=new Date(hover);
  }

  function saveNote(){
    if(!input) return;

    const k = start && end ? `${start}_${end}` : start || "general";

    setNotes(prev => ({
      ...prev,
      [k]: [...(prev[k]||[]), input]
    }));

    setInput("");
  }

  function deleteNote(group,index){
    setNotes(prev=>{
      const updated = {...prev};
      updated[group].splice(index,1);
      if(updated[group].length===0) delete updated[group];
      return updated;
    });
  }

  return (
    <div className="wrap">

      {/* HEADER */}
      <div className="header">
        <select value={month} onChange={e=>setMonth(+e.target.value)}>
          {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
        </select>

        <input
          type="number"
          value={year}
          onChange={e=>setYear(+e.target.value)}
        />
      </div>

      <div className="card">

        {/* HERO */}
        <div className="hero">
          <img src={IMAGES[month]} alt="" />

          <div className="left-shape"></div>

          <div className="hero-text">
            <span>{year}</span>
            <h1>{MONTHS[month].toUpperCase()}</h1>
          </div>
        </div>

        <div className="body">

          {/* NOTES */}
          <div className="notes">
            <h4>📝 Notes</h4>

            <textarea
              value={input}
              onChange={e=>setInput(e.target.value)}
              placeholder="Write something..."
            />

            <button onClick={saveNote}>Add</button>

            <div className="note-list">
              {Object.keys(notes).map(k=>(
                <div key={k} className="note">
                  <small>{k}</small>

                  {notes[k].map((n,i)=>(
                    <div key={i} className="note-item">
                      <p>{n}</p>
                      <button onClick={()=>deleteNote(k,i)}>❌</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* CALENDAR */}
          <div className="calendar">

            <div className="days">
              {DAYS.map(d=><div key={d}>{d}</div>)}
            </div>

            <div className="grid">
              {Array.from({length:firstDay}).map((_,i)=><div key={i}></div>)}

              {Array.from({length:daysInMonth}).map((_,i)=>{
                const d=i+1;
                const k=key(year,month,d);
                const holiday = HOLIDAYS[`${month+1}-${d}`];

                const selected = k===start || k===end;
                const range = inRange(k);
                const preview = previewRange(k);
                const isToday = k===todayKey;

                return (
                  <div
                    key={d}
                    className={`cell 
                      ${selected?"sel":""} 
                      ${range?"range":""} 
                      ${preview?"preview":""}
                      ${isToday?"today":""}
                    `}
                    onClick={()=>handleClick(d)}
                    onMouseEnter={()=>setHover(k)}
                    onMouseLeave={()=>setHover(null)}
                  >
                    {d}
                    {holiday && <div className="holiday">{holiday}</div>}
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>

      {/* NAV */}
      <div className="nav">
        <button onClick={()=>setMonth(m=>m===0?11:m-1)}>⬅ Prev</button>
        <button onClick={()=>setMonth(m=>m===11?0:m+1)}>Next ➡</button>
      </div>

      {/* ORIGINAL CSS (with small additions) */}
      <style>{`
        body{margin:0}

        .wrap{
          font-family:Segoe UI;
          background:#f5f0e8;
          min-height:100vh;
          padding:20px;
        }

        .header{
          display:flex;
          justify-content:space-between;
          margin-bottom:10px;
        }

        .card{
          background:white;
          border-radius:12px;
          overflow:hidden;
          box-shadow:0 10px 40px rgba(0,0,0,.1);
          animation:fade 0.4s ease;
        }

        @keyframes fade{
          from{opacity:0; transform:translateY(10px)}
          to{opacity:1}
        }

        .hero{
          position:relative;
          height:260px;
        }

        .hero img{
          width:100%;
          height:100%;
          object-fit:cover;
        }

        .left-shape{
          position:absolute;
          bottom:0;
          left:0;
          width:45%;
          height:100px;
          background:#eae6dc;
          clip-path: polygon(0 0, 100% 100%, 0 100%);
        }

        .hero-text{
          position:absolute;
          bottom:0;
          right:0;
          width:260px;
          height:120px;
          background:#1e8fd5;
          clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:flex-end;
          padding:15px 20px;
        }

        .hero-text h1{
          font-size:22px;
          color:white;
          letter-spacing:2px;
        }

        .hero-text span{
          font-size:12px;
          color:rgba(255,255,255,0.8);
        }

        .body{
          display:flex;
        }

        .notes{
          width:220px;
          padding:15px;
          background:#faf7f2;
        }

        textarea{
          width:100%;
          height:60px;
        }

        .notes button{
          width:100%;
          padding:6px;
          background:#1e8fd5;
          color:white;
          border:none;
          border-radius:6px;
        }

        .note{
          background:white;
          padding:5px;
          margin-top:5px;
          border-radius:5px;
        }

        .note-item{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .note-item button{
          background:red;
          color:white;
          border:none;
          border-radius:4px;
          cursor:pointer;
        }

        .calendar{
          flex:1;
          padding:15px;
        }

        .days,.grid{
          display:grid;
          grid-template-columns:repeat(7,1fr);
        }

        .days{
          font-size:12px;
          color:gray;
        }

        .grid{gap:4px}

        .cell{
          text-align:center;
          padding:6px;
          border-radius:6px;
          cursor:pointer;
          font-size:12px;
          transition:0.2s;
        }

        .cell:hover{background:#eee}

        .sel{
          background:#1e8fd5;
          color:white;
        }

        .range{
          background:#d6eaf8;
        }

        .preview{
          background:#eef7fd;
        }

        .today{
          border:2px solid red;
          font-weight:bold;
        }

        .holiday{
          font-size:9px;
          color:#4a8a2a;
        }

        .nav{
          margin-top:10px;
          display:flex;
          justify-content:space-between;
        }

        @media(max-width:768px){
          .body{flex-direction:column}
          .notes{width:100%}
        }
      `}</style>
    </div>
  );
}