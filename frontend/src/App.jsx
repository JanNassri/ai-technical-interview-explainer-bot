import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:8000/api/explain", {
        question,
      });
      setResponse(res.data.explanation);
    } catch (err) {
      console.error(err);
      setResponse("Error: Could not generate explanation.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>AI Technical Interview Explainer</h1>

      <textarea
        rows={6}
        style={{ width: "100%", padding: "10px" }}
        placeholder="Paste your coding problem here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleExplain}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Explain Problem"}
      </button>

      <div style={{ marginTop: "30px", padding: "20px", background: "#000000ff" }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {response}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default App;
