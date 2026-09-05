import Link from "next/link";

export const metadata = {
  title: "Adaptive Syllabus",
  description: "Concept-level adaptive learning platform",
};

const links = [
  ["/", "Dashboard"],
  ["/syllabus", "Syllabus"],
  ["/practice", "Practice"],
  ["/live-test", "Live Tests"],
  ["/question-bank", "Question Bank"],
  ["/question-import", "AI Import"],
  ["/test-creator", "Test Creator"],
  ["/analytics", "Analytics"],
  ["/profile", "Profile"],
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <nav aria-label="Primary navigation" style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",padding:"10px 18px",borderBottom:"1px solid #dfe5ed",background:"#fff",fontFamily:"system-ui,-apple-system,sans-serif",position:"sticky",top:0,zIndex:20}}>
          <strong style={{marginRight:6}}>ADAPTIVE SYLLABUS</strong>
          {links.map(([href,label]) => <Link key={href} href={href} style={{padding:"7px 10px",borderRadius:7,color:"#172033",textDecoration:"none"}}>{label}</Link>)}
        </nav>
        {children}
      </body>
    </html>
  );
}
