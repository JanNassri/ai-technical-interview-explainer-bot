import { useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("brute");
  const [rawMarkdown, setRawMarkdown] = useState("");

  const ask = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setData(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/explain", {
        question: input
      });

      console.log("API Response:", res.data);

      let parsed;
      
      // Check if explanation is markdown text (starts with ###, ##, etc)
      if (res.data.explanation && typeof res.data.explanation === 'string') {
        const markdown = res.data.explanation;
        console.log("Markdown response detected:", markdown.substring(0, 100));
        
        setRawMarkdown(markdown); // Store for debugging
        
        // Parse markdown into structured data
        parsed = parseMarkdownToData(markdown);
      } else if (typeof res.data === 'object') {
        // If it's already structured
        parsed = res.data;
      } else {
        parsed = { error: "Unexpected response format", raw: res.data };
      }

      console.log("Parsed Data:", parsed);
      setData(parsed);
    } catch (error) {
      console.error("API Error:", error);
      setData({ 
        error: "Failed to fetch explanation", 
        details: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse markdown response into structured data
  const parseMarkdownToData = (markdown) => {
    console.log("Full markdown:", markdown);
    
    const sections = {
      summary: "",
      brute_force_explanation: "",
      brute_force_code: "",
      optimized_explanation: "",
      optimized_code: "",
      complexity: "",
      test_cases: "",
      follow_up: ""
    };

    // More flexible approach: split by major headers
    const lines = markdown.split('\n');
    let currentSection = null;
    let currentContent = [];
    let inCodeBlock = false;
    let codeContent = [];
    let codeLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detect code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          const code = codeContent.join('\n').trim();
          if (currentSection === 'brute_force' && code) {
            sections.brute_force_code = code;
          } else if (currentSection === 'optimized' && code) {
            sections.optimized_code = code;
          }
          codeContent = [];
          inCodeBlock = false;
          codeLanguage = '';
        } else {
          // Start of code block
          inCodeBlock = true;
          codeLanguage = line.trim().substring(3).trim(); // e.g., "python"
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // Detect section headers - more flexible matching
      const headerMatch = line.match(/^#{1,4}\s*(.+)/);
      if (headerMatch) {
        const headerText = headerMatch[1].toLowerCase().trim();
        
        // Save previous section
        if (currentSection && currentContent.length > 0) {
          const content = currentContent.join('\n').trim();
          if (currentSection === 'brute_force') {
            sections.brute_force_explanation = content;
          } else if (currentSection === 'optimized') {
            sections.optimized_explanation = content;
          } else if (sections[currentSection] !== undefined) {
            sections[currentSection] = content;
          }
        }
        
        // Detect new section
        if (headerText.includes('problem') || (headerText.includes('summary') && !headerText.includes('test'))) {
          currentSection = 'summary';
          currentContent = [];
        } else if (headerText.includes('brute force')) {
          currentSection = 'brute_force';
          currentContent = [];
        } else if (headerText.includes('optimized') || headerText.includes('optimal')) {
          currentSection = 'optimized';
          currentContent = [];
        } else if (headerText.includes('complexity') || (headerText.includes('time') && headerText.includes('space'))) {
          currentSection = 'complexity';
          currentContent = [];
        } else if (headerText.includes('test case') || headerText.includes('test example')) {
          currentSection = 'test_cases';
          currentContent = [];
        } else if (headerText.includes('follow-up') || headerText.includes('followup') || headerText.includes('follow up')) {
          currentSection = 'follow_up';
          currentContent = [];
        } else {
          // Unknown header, continue with current section
          if (currentSection) {
            currentContent.push(line);
          }
        }
      } else if (currentSection) {
        // Add content to current section (skip empty lines at start)
        if (line.trim() || currentContent.length > 0) {
          currentContent.push(line);
        }
      }
    }

    // Save the last section
    if (currentSection && currentContent.length > 0) {
      const content = currentContent.join('\n').trim();
      if (currentSection === 'brute_force') {
        sections.brute_force_explanation = content;
      } else if (currentSection === 'optimized') {
        sections.optimized_explanation = content;
      } else if (sections[currentSection] !== undefined) {
        sections[currentSection] = content;
      }
    }

    // If still empty, try a fallback: just split the markdown into chunks
    if (!sections.summary && !sections.brute_force_explanation) {
      console.log("Primary parsing failed, trying fallback...");
      
      // Simple fallback: treat the whole thing as summary if nothing else worked
      const cleanedMarkdown = markdown.replace(/```[\s\S]*?```/g, '[code block]');
      if (cleanedMarkdown.length > 50) {
        sections.summary = "Response received - see raw markdown below";
        sections.brute_force_explanation = markdown.substring(0, Math.min(500, markdown.length));
      }
    }

    console.log("Parsed sections:", sections);
    console.log("Summary length:", sections.summary.length);
    console.log("Brute force explanation length:", sections.brute_force_explanation.length);
    console.log("Brute force code length:", sections.brute_force_code.length);
    
    return sections;
  };

  return (
    <div className="app-container">
      {/* Animated gradient background */}
      <div className="gradient-bg">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
        <div className="gradient-blob blob-4"></div>
      </div>

      {/* Main content */}
      <div className="content-wrapper">
        
        {/* Header */}
        <div className="glass-card header-card">
          <h1 className="main-title">
            <span className="gradient-text">Interview</span> Explainer
          </h1>
          <p className="subtitle">Master coding interviews with AI-powered explanations</p>
        </div>

        {/* Input Section */}
        <div className="glass-card input-card">
          <textarea
            className="modern-input"
            placeholder="Ask any coding interview question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) ask();
            }}
          />
          
          <button 
            className={`generate-btn ${loading ? 'loading' : ''}`}
            onClick={ask}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                Generate Explanation
                <span className="btn-icon">✨</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {data && data.error && (
          <div className="glass-card error-card fade-in">
            <div className="card-header">
              <span className="card-icon">⚠️</span>
              <h2>Error</h2>
            </div>
            <p className="card-content">{data.error}</p>
            {data.details && <p className="card-content" style={{ marginTop: '8px', fontSize: '0.95rem' }}>{data.details}</p>}
            <details style={{ marginTop: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              <summary style={{ cursor: 'pointer', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>🔍 Show debug info (click here)</summary>
              <pre style={{ marginTop: '12px', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', maxHeight: '300px', overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
            </details>
          </div>
        )}

        {data && !data.error && !data.summary && (
          <div className="glass-card error-card fade-in">
            <div className="card-header">
              <span className="card-icon">🔍</span>
              <h2>Unexpected Response Format</h2>
            </div>
            <p className="card-content">Got data back from API, but it's not in the expected format. Check what fields are available below:</p>
            <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '8px', fontSize: '0.95rem' }}>Available fields:</p>
              <ul style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', paddingLeft: '20px' }}>
                {Object.keys(data).map(key => (
                  <li key={key}><code>{key}</code>: {data[key] ? `${String(data[key]).substring(0, 50)}...` : '(empty)'}</li>
                ))}
              </ul>
            </div>
            {rawMarkdown && (
              <details style={{ marginTop: '16px' }}>
                <summary style={{ cursor: 'pointer', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)' }}>📄 Show raw markdown from API</summary>
                <pre className="code-block" style={{ marginTop: '12px', maxHeight: '400px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>{rawMarkdown}</pre>
              </details>
            )}
            <details style={{ marginTop: '16px' }}>
              <summary style={{ cursor: 'pointer', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)' }}>🔍 Show parsed response</summary>
              <pre className="code-block" style={{ marginTop: '12px', maxHeight: '400px', overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
            </details>
          </div>
        )}

        {data && data.summary && (
          <div className="results-container">
            
            {/* Summary Card */}
            <div className="glass-card summary-card fade-in">
              <div className="card-header">
                <span className="card-icon">💡</span>
                <h2>Problem Summary</h2>
              </div>
              <p className="card-content">{data.summary}</p>
            </div>

            {/* Approach Tabs */}
            <div className="glass-card approaches-card fade-in-delayed">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'brute' ? 'active' : ''}`}
                  onClick={() => setActiveTab('brute')}
                >
                  <span className="tab-icon">🐌</span>
                  Brute Force
                </button>
                <button 
                  className={`tab ${activeTab === 'optimized' ? 'active' : ''}`}
                  onClick={() => setActiveTab('optimized')}
                >
                  <span className="tab-icon">⚡</span>
                  Optimized
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'brute' ? (
                  <div className="approach-section">
                    <h3>Brute Force Approach</h3>
                    <p className="approach-explanation">{data.brute_force_explanation}</p>
                    <div className="code-wrapper">
                      <div className="code-header">
                        <span className="code-lang">Python</span>
                        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(data.brute_force_code)}>
                          Copy
                        </button>
                      </div>
                      <pre className="code-block">{data.brute_force_code}</pre>
                    </div>
                  </div>
                ) : (
                  <div className="approach-section">
                    <h3>Optimized Approach</h3>
                    <p className="approach-explanation">{data.optimized_explanation}</p>
                    <div className="code-wrapper">
                      <div className="code-header">
                        <span className="code-lang">Python</span>
                        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(data.optimized_code)}>
                          Copy
                        </button>
                      </div>
                      <pre className="code-block">{data.optimized_code}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Complexity Card */}
            <div className="glass-card complexity-card fade-in-delayed-2">
              <div className="card-header">
                <span className="card-icon">📊</span>
                <h2>Complexity Analysis</h2>
              </div>
              <p className="card-content complexity-content">{data.complexity}</p>
            </div>

            {/* Test Cases Card */}
            {data.test_cases && (
              <div className="glass-card fade-in-delayed-2">
                <div className="card-header">
                  <span className="card-icon">🧪</span>
                  <h2>Test Cases</h2>
                </div>
                <div className="card-content" style={{ whiteSpace: 'pre-wrap' }}>{data.test_cases}</div>
              </div>
            )}

            {/* Follow-up Questions Card */}
            {data.follow_up && (
              <div className="glass-card fade-in-delayed-2">
                <div className="card-header">
                  <span className="card-icon">💭</span>
                  <h2>Follow-up Questions</h2>
                </div>
                <div className="card-content" style={{ whiteSpace: 'pre-wrap' }}>{data.follow_up}</div>
              </div>
            )}

          </div>
        )}

        {/* Empty State */}
        {!data && !loading && (
          <div className="empty-state fade-in">
            <div className="empty-icon">📝</div>
            <h3>Ready to ace your interview?</h3>
            <p>Ask any coding question and get detailed explanations with code examples</p>
          </div>
        )}

      </div>
    </div>
  );
}