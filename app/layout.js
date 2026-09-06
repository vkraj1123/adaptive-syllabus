export const metadata = {
  title: "Adaptive Syllabus",
  description: "Concept-level adaptive learning platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
