import { NextResponse } from "next/server";
function parseJson(content){const s=String(content||"").replace(/<[\s\S]*?<\/think>/gi,"").replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/i,"").trim();if(!s)throw Error("AI returned an empty response.");const parsed=JSON.parse(s);return Array.isArray(parsed)?parsed:(parsed.questions||parsed.data||[])}
function extractAnswer(text,opts){
  if(!text||!opts.length)return null;
  const t=text.toLowerCase();
  const m=t.match(/(?:ans(?:wer)?|correct|right)\s*[:.\-)]?\s*\(?([a-e1-5])\)?/i);
  if(m){
    const c=m[1].toUpperCase();
    const n=parseInt(c,10);
    if(!isNaN(n))return Math.min(Math.max(n-1,0),opts.length-1);
    return Math.min(c.charCodeAt(0)-65,opts.length-1);
  }
  const star=t.match(/\*\s*\(?([a-e1-5])\)?/);
  if(star){
    const c=star[1].toUpperCase();
    const n=parseInt(c,10);
    if(!isNaN(n))return Math.min(Math.max(n-1,0),opts.length-1);
    return Math.min(c.charCodeAt(0)-65,opts.length-1);
  }
  return null;
}
function markerParse(text){const blocks=text.replace(/\r/g,"").split(/(?:^|\n)\s*\?\s*/).map(x=>x.trim()).filter(Boolean);return blocks.map((block,i)=>{const lines=block.split(/\n+/).map(x=>x.trim()).filter(Boolean);let stem=[],opts=[];let ansLine=null;for(const line of lines){const m=line.match(/^\s*\(?([A-E]|[1-5])\)?[.)\-:]\s*(.*)$/i);if(m&&opts.length<5)opts.push(m[2].trim());else if(opts.length===0)stem.push(line);else if(/^\s*(?:ans(?:wer)?|correct|right)\s*[:.\-)]/i.test(line))ansLine=line;else opts[opts.length-1]=`${opts[opts.length-1]} ${line}`.trim()}const notAttempted=opts.length===5&&/not\s*attempt|unattempt|question\s*not\s*attempt|अनुत्तरित|प्रश्न.*प्रयास/i.test(opts[4]);const stemText=stem.join(" ");let ans=extractAnswer(stemText,opts);if(ans===null&&ansLine)ans=extractAnswer(ansLine,opts);return{id:i+1,text:stemText,options:opts,answer:ans,answerSource:ans!==null?"extracted":"none",notAttemptedOption:notAttempted?4:null,extraction:"marker"}}).filter(q=>q.text&&q.options.length>=2)}
function fallback(text){const lines=text.replace(/\r/g,"").split(/\n+/).map(x=>x.trim()).filter(Boolean),out=[];for(let i=0;i<lines.length;i++){if(/^(?:what|which|who|when|where|why|how|select|consider|with reference|following|निम्न|कौन|क्या|किस|कब|कहाँ)/i.test(lines[i])){let j=i+1,opts=[];while(j<lines.length&&opts.length<5&&/^(?:\(?[A-E1-5]\)?[.)\-:]|\(?[1-5]\)?[.)\-:])\s*/i.test(lines[j])){opts.push(lines[j].replace(/^\(?[A-E1-5]\)?[.)\-:]\s*/i,""));j++}if(opts.length>=2){const fa=extractAnswer(lines[i],opts);out.push({id:out.length+1,text:lines[i],options:opts,answer:fa,answerSource:fa!==null?"extracted":"none",notAttemptedOption:opts.length===5&&/not.?attempt|unattempt|अनुत्तरित/i.test(opts[4])?4:null})}}}return out.slice(0,100)}
async function aiExtract(apiKey,model,apiUrl,text){if(!apiUrl?.trim())throw Error("Add the AI API link in Settings.");const prompt=`Extract the MCQs from this text. Every question starts with ?. Use ? as the ONLY question boundary. Options can be A-E or 1-5 and each question has 4 or 5 options. Preserve a fifth Not Attempted option when present. Return ONLY JSON: {"questions":[{"id":1,"text":"...","options":["..."],"answer":null,"answerSource":null,"notAttemptedOption":null}]}. Do not add explanations.\n\n${text.slice(0,80000)}`;const r=await fetch(apiUrl.trim(),{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${apiKey}`,"api-subscription-key":apiKey},body:JSON.stringify({model,messages:[{role:"system",content:"Return only valid JSON."},{role:"user",content:prompt}],temperature:0,max_tokens:4096})});const raw=await r.text();let d;try{d=JSON.parse(raw)}catch{if(!r.ok)throw Error(raw.slice(0,500)||`AI extraction failed (${r.status})`);throw Error("AI returned a non-JSON response. Check the API Link and model endpoint in Settings.")}if(!r.ok)throw Error(d?.error?.message||d?.message||d?.error||`AI extraction failed (${r.status})`);return parseJson(d?.choices?.[0]?.message?.content||"")}
export async function POST(request){try{const{text="",apiKey,model="sarvam-105b",apiUrl="",baseUrl=""}=await request.json();if(!text.trim())return NextResponse.json({error:"Paste question-paper text first."},{status:400});let questions=markerParse(text);if(!questions.length&&apiKey)questions=await aiExtract(apiKey,model,apiUrl||baseUrl,text);if(!questions.length)questions=fallback(text);if(!questions.length)return NextResponse.json({error:"No question blocks detected. Add ? at the beginning of each question, then try again."},{status:422});return NextResponse.json({mode:questions[0]?.extraction==="marker"?"marker":apiKey?"ai":"fallback",questions:questions.slice(0,100)})}catch(e){return NextResponse.json({error:e.message},{status:500})}}