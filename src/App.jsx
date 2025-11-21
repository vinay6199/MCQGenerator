import React, { useState, useRef } from "react";

// -------------------- SAMPLE QUESTION BANK -------------------- // // (You can extend this easily — clean structure, simple to edit) const QUESTIONS = { Physics: { 6: [ { q: "What is the SI unit of length?", options: ["Meter", "Gram", "Second", "Newton"], answer: "Meter" }, { q: "Sound travels fastest in?", options: ["Solid", "Liquid", "Gas", "Vacuum"], answer: "Solid" }, ], 7: [ { q: "Force = ?", options: ["mass × acceleration", "mass ÷ velocity", "energy × time", "speed ÷ time"], answer: "mass × acceleration" }, ], 8: [ { q: "Which mirror forms virtual images?", options: ["Concave", "Convex", "Plane", "Both convex and plane"], answer: "Both convex and plane" }, ], 9: [ { q: "Unit of current?", options: ["Ampere", "Volt", "Joule", "Watt"], answer: "Ampere" }, ], 10: [ { q: "Ohm's Law is?", options: ["V = IR", "P = VI", "F = ma", "E = mc²"], answer: "V = IR" }, ], },

Chemistry: { 6: [ { q: "Water formula?", options: ["H₂O", "O₂", "CO₂", "NaCl"], answer: "H₂O" }, { q: "Salt contains?", options: ["Na & Cl", "H & O", "C & N", "K & Br"], answer: "Na & Cl" }, ], 7: [ { q: "pH of water?", options: ["7", "0", "14", "1"], answer: "7" }, ], 8: [ { q: "Acid turns blue litmus?", options: ["Red", "Blue", "Green", "No change"], answer: "Red" }, ], },

Maths: { 6: [ { q: "What is 1/2 + 1/3?", options: ["5/6", "1/5", "2/3", "3/4"], answer: "5/6" }, ], 7: [ { q: "Perimeter of square (side 5)?", options: ["20", "10", "25", "15"], answer: "20" }, ], 10: [ { q: "Derivative of x²?", options: ["2x", "x", "x³", "1"], answer: "2x" }, ], },

Biology: { 6: [ { q: "Which organ pumps blood?", options: ["Heart", "Lungs", "Liver", "Kidney"], answer: "Heart" }, ], 7: [ { q: "Plants prepare food by?", options: ["Photosynthesis", "Respiration", "Digestion", "Excretion"], answer: "Photosynthesis" }, ], 10: [ { q: "Mitosis produces how many cells?", options: ["2", "4", "6", "8"], answer: "2" }, ], }, };

// -------------------- UTILS -------------------- const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

export default function App() { const subjects = Object.keys(QUESTIONS); const classes = [6, 7, 8, 9, 10];

const [subject, setSubject] = useState(""); const [standard, setStandard] = useState(""); const [count, setCount] = useState(10); const [generated, setGenerated] = useState([]);

const paperRef = useRef(null);

const generate = () => { if (!subject || !standard) return alert("Select subject & class");

const pool = QUESTIONS[subject] && QUESTIONS[subject][standard];
if (!pool) return alert("No questions available.");

const selected = shuffle([...pool]).slice(0, count);
setGenerated(selected);

};

// NOTE: html2canvas & jspdf are dynamically imported so build/SSR won't try to resolve them at build time. const downloadPDF = async () => { if (!paperRef.current) return alert('Nothing to export');

// dynamic import of html2canvas
const html2canvasModule = await import('html2canvas');
const html2canvas = html2canvasModule.default || html2canvasModule;

// dynamic import of jspdf
const jsPDFModule = await import('jspdf');
const jsPDF = jsPDFModule.default || jsPDFModule;

const element = paperRef.current;
const canvas = await html2canvas(element, { scale: 2 });
const img = canvas.toDataURL('image/png');

const pdf = new jsPDF('p', 'mm', 'a4');
const pageWidth = pdf.internal.pageSize.getWidth();
const pageHeight = (canvas.height * pageWidth) / canvas.width;

pdf.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);
pdf.save('mcq-paper.pdf');

};

return ( <div className="w-full min-h-screen bg-gray-100 p-6 flex flex-col items-center"> <h1 className="text-3xl font-bold mb-6">MCQ Test Generator</h1>

{/* Controls Card */}
  <div className="bg-white shadow-md p-5 rounded w-full max-w-3xl mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div>
      <label className="font-medium">Subject</label>
      <select className="w-full p-2 border rounded" value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">Select</option>
        {subjects.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="font-medium">Class</label>
      <select className="w-full p-2 border rounded" value={standard} onChange={(e) => setStandard(e.target.value)}>
        <option value="">Select</option>
        {classes.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="font-medium">No. of Questions</label>
      <input
        type="number"
        min={1}
        className="w-full p-2 border rounded"
        value={count}
        onChange={(e) => setCount(Number(e.target.value) || 0)}
      />
    </div>
  </div>

  <button onClick={generate} className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 mb-6">
    Generate Paper
  </button>

  {/* PAPER VIEW */}
  <div ref={paperRef} className="bg-white p-6 w-full max-w-4xl shadow rounded">
    <h2 className="text-xl font-bold mb-4 text-center">Generated MCQ Paper</h2>

    {generated.length === 0 && (
      <p className="text-center text-gray-500">No questions generated yet.</p>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {generated.map((q, i) => (
        <div key={i} className="border p-3 rounded">
          <p className="font-semibold">{i + 1}. {q.q}</p>
          <ul className="mt-2 ml-3 list-disc text-sm">
            {q.options.map((opt, j) => (
              <li key={j}>{opt}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>

  {/* Export Button */}
  {generated.length > 0 && (
    <button onClick={downloadPDF} className="mt-6 bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700">
      Download PDF
    </button>
  )}
</div>

); }
