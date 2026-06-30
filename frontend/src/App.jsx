import { useState } from 'react';
import axios from 'axios';

function App() {
  const [setup, setSetup] = useState({
    job_role: "Software Engineer",
    company_level: "Mid-Senior at Google",
    experience: "3-5",
    interview_type: "mixed"
  });

  const [isInterviewing, setIsInterviewing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/start-interview', setup);
      setMessages([{ type: 'ai', text: res.data.reply }]);
      setIsInterviewing(true);
    } catch (err) {
      alert("Backend not running or Ollama not started.");
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/chat', {
        message: userMsg,
        history: history
      });

      setMessages(prev => [...prev, { type: 'ai', text: res.data.reply }]);
      setHistory(prev => [...prev, { q: messages[messages.length-1]?.text || "", a: userMsg }]);
    } catch (err) {
      alert("Error communicating with backend");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">AI Interview Coach</h1>
        <p className="text-center text-gray-400 mb-10">Local • Open Source • Private</p>

        {!isInterviewing ? (
          <div className="bg-gray-900 rounded-3xl p-10">
            <h2 className="text-2xl mb-8 text-center">Setup Your Mock Interview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" value={setup.job_role} onChange={e => setSetup({...setup, job_role: e.target.value})}
                className="bg-gray-800 p-4 rounded-2xl" placeholder="Job Role" />
              <input type="text" value={setup.company_level} onChange={e => setSetup({...setup, company_level: e.target.value})}
                className="bg-gray-800 p-4 rounded-2xl" placeholder="Company / Level" />
              <select value={setup.experience} onChange={e => setSetup({...setup, experience: e.target.value})}
                className="bg-gray-800 p-4 rounded-2xl">
                <option value="0-2">0-2 Years</option>
                <option value="3-5">3-5 Years</option>
                <option value="6+">6+ Years (Senior)</option>
              </select>
              <select value={setup.interview_type} onChange={e => setSetup({...setup, interview_type: e.target.value})}
                className="bg-gray-800 p-4 rounded-2xl">
                <option value="mixed">Mixed</option>
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
              </select>
            </div>
            <button onClick={startInterview} disabled={loading}
              className="mt-10 w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-3xl text-xl font-semibold">
              {loading ? "Starting Interview..." : "🚀 Start Interview"}
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-3xl flex flex-col h-[650px]">
            <div className="p-6 border-b flex justify-between">
              <h3 className="font-bold text-xl">Live Interview</h3>
              <button onClick={() => window.location.reload()} className="text-red-400">End Session</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : ''}`}>
                  <div className={`max-w-[75%] p-5 rounded-3xl ${m.type === 'user' ? 'bg-blue-600' : 'bg-gray-800'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && <p className="text-gray-400">Coach is thinking...</p>}
            </div>

            <div className="p-6 border-t border-gray-700">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your answer here..."
                  className="flex-1 bg-gray-800 rounded-3xl px-6 py-4 focus:outline-none"
                />
                <button onClick={sendMessage} disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 px-8 rounded-3xl font-medium">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;