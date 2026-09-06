import ClientShell from "./ClientShell";

export const metadata = {
  title: "Adaptive Syllabus",
  description: "Concept-level adaptive learning platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
