"use client";
import {useEffect,useState} from "react";

const TREE=[
{s:"Indian Polity & Constitution",topics:[
 {t:"Constitutional Framework",sub:["Basic Structure","Preamble","Fundamental Rights","DPSP","Fundamental Duties","Amendments"]},
 {t:"Union Executive",sub:["President","Vice President","Prime Minister","Council of Ministers","Attorney General"]},
 {t:"Parliament",sub:["Lok Sabha","Rajya Sabha","Legislative Process","Parliamentary Committees","Anti-Defection"]},
 {t:"Judiciary",sub:["Supreme Court","High Courts","Judicial Review","PIL","Judicial Activism"]},
 {t:"State Government",sub:["Governor","Chief Minister","State Legislature","State Council of Ministers"]},
 {t:"Local Government",sub:["Panchayati Raj","Municipalities","Urban Local Bodies","73rd & 74th Amendments"]},
 {t:"Constitutional Bodies",sub:["Election Commission","CAG","UPSC","Finance Commission","NCBC","NCSC"]},
 {t:"Federalism",sub:["Centre-State Relations","Inter-State Council","Zonal Councils","Centre's Emergency Powers"]},
]},
{s:"Indian History & Culture",topics:[
 {t:"Ancient India",sub:["Indus Valley","Vedic Age","Buddhism & Jainism","Maurya Empire","Gupta Empire"]},
 {t:"Medieval India",sub:["Delhi Sultanate","Mughal Empire","Bhakti Movement","Sufi Movement","Maratha Empire"]},
 {t:"Modern India",sub:["Advent of British","1857 Revolt","Indian National Movement","Gandhian Era","Partition"]},
 {t:"Art & Culture",sub:["Architecture","Painting","Music & Dance","Literature","Festivals"]},
]},
{s:"Rajasthan History & Culture",topics:[
 {t:"Early History",sub:["Rajput Dynasties","Prithviraj Chauhan","Mewar Dynasty","Marwar Dynasty"]},
 {t:"Freedom Struggle",sub:["1857 in Rajasthan","Praja Mandal Movement","Integration of Rajasthan","Role of Leaders"]},
 {t:"Art & Culture",sub:["Folk Dances","Folk Music","Paintings","Crafts","Fairs & Festivals"]},
 {t:"Architecture",sub:["Forts","Palaces","Temples","Step Wells"]},
]},
{s:"Indian Geography",topics:[
 {t:"Physical Geography",sub:["Physiography","Drainage System","Climate","Soils","Natural Vegetation"]},
 {t:"Economic Geography",sub:["Agriculture","Minerals","Industries","Transport","Energy"]},
 {t:"Human Geography",sub:["Population","Settlements","Migration","Literacy"]},
]},
{s:"Rajasthan Geography",topics:[
 {t:"Physical",sub:["Physiography","Desert","Aravalli Range","Drainage","Climate"]},
 {t:"Resources",sub:["Minerals","Soils","Irrigation","Forest Cover"]},
 {t:"Administrative",sub:["Districts","Divisions","Demographics","Livestock"]},
]},
{s:"Indian Economy",topics:[
 {t:"Basic Concepts",sub:["National Income","GDP & GVA","Inflation","Money Supply","Banking System"]},
 {t:"Public Finance",sub:["Union Budget","Tax Structure","Fiscal Policy","Government Schemes"]},
 {t:"Sectors",sub:["Agriculture","Industry","Services","External Sector","Balance of Payments"]},
 {t:"Financial Markets",sub:["RBI","Stock Market","Insurance","Pension System"]},
]},
{s:"Rajasthan Economy",topics:[
 {t:"State Finance",sub:["State Budget","Tax Revenue","Plan Outlay","Flagship Schemes"]},
 {t:"Sectors",sub:["Agriculture","Industries","Tourism","Handicrafts","Power Sector"]},
 {t:"Development",sub:["Rajasthan Model","Investment Potential","MSME","Skill Development"]},
]},
{s:"Science & Technology",topics:[
 {t:"Physical Sciences",sub:["Physics Basics","Chemistry Basics","Space Technology","Nuclear Science"]},
 {t:"Life Sciences",sub:["Biology Basics","Human Health","Biotechnology","Diseases & Vaccines"]},
 {t:"IT & Digital",sub:["Digital India","AI & ML","Cybersecurity","E-Governance"]},
 {t:"Defence & Space",sub:["ISRO Missions","DRDO","Defence Systems","Nuclear Program"]},
]},
{s:"Environment & Ecology",topics:[
 {t:"Ecology",sub:["Ecosystems","Biodiversity","Food Chains","Conservation"]},
 {t:"Environmental Issues",sub:["Pollution","Climate Change","Global Warming","Waste Management"]},
 {t:"Conservation",sub:["Wildlife Protection","National Parks","Tiger Reserves","Biosphere Reserves"]},
 {t:"Policies & Laws",sub:["Environmental Clearance","Forest Act","Wildlife Act","Paris Agreement"]},
]},
{s:"Current Affairs",topics:[
 {t:"National Affairs",sub:["Government Schemes","Policy Changes","Judgments","Elections"]},
 {t:"International Affairs",sub:["Foreign Policy","Treaties","UN & Global Bodies","Geopolitics"]},
 {t:"Rajasthan Affairs",sub:["State Policies","Schemes","Appointments","Key Events"]},
 {t:"Sports & Awards",sub:["Sports Events","Awards & Honours","Books & Authors","Obituaries"]},
]},
{s:"Reasoning & Mental Ability",topics:[
 {t:"Verbal Reasoning",sub:["Analogy","Classification","Series","Coding-Decoding","Blood Relations"]},
 {t:"Non-Verbal",sub:["Mirror Images","Paper Folding","Embedded Figures","Pattern Completion"]},
 {t:"Quantitative",sub:["Number System","Percentage","Ratio","Time & Work","Data Interpretation"]},
]},
{s:"Public Administration",topics:[
 {t:"Administrative Theory",sub:["Principles","Organisation","Good Governance","Accountability"]},
 {t:"Rajasthan Administration",sub:["State Secretariat","District Administration","Panchayati Raj","Urban Administration"]},
 {t:"Civil Services",sub:["RAS Examination","Role of RAS Officer","Ethics in Administration","RTI"]},
 {t:"Public Policy",sub:["Policy Formulation","Implementation","Evaluation","Citizen-Centric Administration"]},
]},
{s:"Ethics & Integrity",topics:[
 {t:"Ethics Basics",sub:["Ethical Theories","Values","Integrity","Probity in Governance"]},
 {t:"Case Studies",sub:["Administrative Dilemmas","Conflict of Interest","Corruption","Whistleblowing"]},
 {t:"Aptitude",sub:["Emotional Intelligence","Attitude","Leadership","Decision Making"]},
]},
{s:"International Relations",topics:[
 {t:"India's Foreign Policy",sub:["Non-Alignment","Neighborhood Policy","Look East/Act East"]},
 {t:"Major Powers",sub:["India-US","India-Russia","India-China","India-EU"]},
 {t:"Multilateral",sub:["UNO","SAARC","BRICS","WTO","G20"]},
]},
{s:"Social Issues & Schemes",topics:[
 {t:"Social Sector",sub:["Education","Health","Women & Child","Poverty","Employment"]},
 {t:"Welfare Schemes",sub:["Central Schemes","Rajasthan Schemes","Subsidies","Social Security"]},
 {t:"Vulnerable Groups",sub:["SC/ST","OBC","Minorities","Persons with Disabilities","Senior Citizens"]},
]},
];

const ALL_SUBJECTS=TREE.map(x=>x.s);
function tagKey(s,t,st){return st?`${s}|${t}|${st}`:`${s}|${t}`}
const defaults={model:"sarvam-105b",apiUrl:"",apiKey:""};
async function safeJson(r){const raw=await r.text();let d;try{d=JSON.parse(raw)}catch{throw Error(raw?.slice(0,800)||`Server returned non-JSON response (${r.status})`)}return d}

export default function Home(){
const[q,setQ]=useState([]),[text,setText]=useState(""),[busy,setBusy]=useState(false),[msg,setMsg]=useState(""),[settings,setSettings]=useState(defaults),[showSettings,setShowSettings]=useState(false),[search,setSearch]=useState(""),[subject,setSubject]=useState("All"),[test,setTest]=useState(null),[pos,setPos]=useState(0),[picked,setPicked]=useState(null),[score,setScore]=useState(0),[selected,setSelected]=useState(new Set()),[editing,setEditing]=useState(null),[attempting,setAttempting]=useState(null),[attemptPick,setAttemptPick]=useState(null),[attemptReveal,setAttemptReveal]=useState(false);

/* Dashboard state */
const[view,setView]=useState("bank");
const[dashSel,setDashSel]=useState(new Set());
const[expandedSubj,setExpandedSubj]=useState(new Set([ALL_SUBJECTS[0]]));
const[expandedTopic,setExpandedTopic]=useState(new Set());
const[attempts,setAttempts]=useState({});
const[dashSort,setDashSort]=useState("name"); /* name | acc-asc | acc-desc | attempts */
const[explanation,setExplanation]=useState(null); /* {text, loading} */
const[testExplanation,setTestExplanation]=useState(null);

/* Build dynamic tree from actual tagged questions in the bank */
const dynamicTree=(()=>{const map={};q.forEach(x=>{if(!x.subject)return;if(!map[x.subject])map[x.subject]={};const tp=x.topic||"Untitled";if(!map[x.subject][tp])map[x.subject][tp]=new Set();if(x.subtopic)map[x.subject][tp].add(x.subtopic)});return Object.keys(map).sort().map(s=>({s,topics:Object.keys(map[s]).sort().map(t=>({t,sub:[...map[s][t]].sort()}))}))})();

useEffect(()=>{try{
  const s=localStorage.getItem("adaptive-settings"),b=localStorage.getItem("adaptive-bank"),a=localStorage.getItem("adaptive-attempts");
  if(s)setSettings({...defaults,...JSON.parse(s)});if(b)setQ(JSON.parse(b));if(a)setAttempts(JSON.parse(a))
}catch{}},[]);
useEffect(()=>{localStorage.setItem("adaptive-bank",JSON.stringify(q))},[q]);
useEffect(()=>{localStorage.setItem("adaptive-attempts",JSON.stringify(attempts))},[attempts]);

/* Attempt tracking */
function recordAttempt(question,correct){
  if(!question.subject)return;
  const keys=new Set();
  if(question.subject)keys.add(tagKey(question.subject,question.topic,question.subtopic));
  if(question.subject&&question.topic)keys.add(tagKey(question.subject,question.topic,null));
  keys.forEach(k=>{
    setAttempts(prev=>{const cur=prev[k]||{correct:0,total:0};return{...prev,[k]:{correct:cur.correct+(correct?1:0),total:cur.total+1}}});
  });
}
function acc(k){const a=attempts[k];if(!a||a.total===0)return null;return a.correct/a.total}
function colorForTag(k){
  const a=acc(k);
  if(a===null)return"white";
  if(a<0.2)return"red";
  if(a<0.5)return"yellow";
  if(a<0.8)return"green";
  return"blue";
}
const TAG_STYLE={white:{background:"#fff",color:"#172033",border:"1px solid #ccd4df"},red:{background:"#fff1f1",color:"#c33",border:"1px solid #c33"},yellow:{background:"#fffdf0",color:"#b8860b",border:"1px solid #e0c040"},green:{background:"#effaf1",color:"#1a7a32",border:"1px solid #238636"},blue:{background:"#e8f0ff",color:"#1a4fa0",border:"1px solid #3b6fd4"}};

/* Sort subtopics */
function sortSubs(s