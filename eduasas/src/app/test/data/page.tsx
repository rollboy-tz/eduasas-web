"use client"
import React, { useEffect, useState } from "react";
import { api, ApiResponse } from "@/lib/api";;
import { EduSmartField, EduSelect, EduBasicInput } from "@/components/inputs";
import { EduButton } from "@/components/buttons";
import { 
  Copy, Check, RefreshCw, Terminal, History, 
  Database, Send, AlertTriangle, Link2, Globe 
} from "lucide-react";

// URL ya API
const BASE_URL = "https://api.eduasas.co.tz/main/v1";

export default function TestDataPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("/my/profile");
  const [method, setMethod] = useState("GET");
  const [jsonBody, setJsonBody] = useState('{\n  "name": "Mtwara Modern",\n  "schoolType": "PRIVATE"\n}');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{url: string, method: string, time: string}[]>([]);

  // Orodha ya Presets
  const urlsList = [
    { label: "User Profile", value: "/my/profile" },
    { label: "My Schools", value: "/my/schools" },
    { label: "User Settings", value: "/my/settings" },
    { label: "School Categories", value: "/public/school-categories" },
    { label: "Public Roles", value: "/public/roles" },
    { label: "Register School", value: "/school/register" },
    { label: "Switch School", value: "/school/switch" },
    { label: "School Grading Rules", value: "/academic/grading/compatible" },
    { label: "Notifications", value: "/my/notifications" }
  ];

  const methodList = [
    { label: "GET", value: "GET" },
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "DELETE", value: "DELETE" },
  ];

  useEffect(() => {
    const savedHistory = localStorage.getItem("edu_request_history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    // Auto-fix: Ongeza / kama mtumiaji amesahau
    const formattedUrl = url.startsWith("/") ? url : `/${url}`;
    setUrl(formattedUrl);

    try {
      let response;
      const parsedBody = (method !== "GET" && method !== "DELETE") ? JSON.parse(jsonBody) : null;

      if (method === "GET") response = await api.get<any, ApiResponse>(formattedUrl);
      else if (method === "POST") response = await api.post<any, ApiResponse>(formattedUrl, parsedBody);
      else if (method === "PUT") response = await api.put<any, ApiResponse>(formattedUrl, parsedBody);
      else if (method === "DELETE") response = await api.delete<any, ApiResponse>(formattedUrl);

      setData(response);
      const newHistory = [{ url: formattedUrl, method, time: new Date().toLocaleTimeString() }, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("edu_request_history", JSON.stringify(newHistory));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Request Failed!");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodColor = (m: string) => {
    if (m === "GET") return "text-blue-400 border-blue-400/20 bg-blue-400/5";
    if (m === "POST") return "text-emerald-400 border-emerald-400/20 bg-emerald-400/5";
    if (m === "PUT") return "text-orange-400 border-orange-400/20 bg-orange-400/5";
    if (m === "DELETE") return "text-red-400 border-red-400/20 bg-red-400/5";
    return "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#e0e0e0] p-4 md:p-8 font-mono">
      
      {/* 1. HEADER & PREVIEW */}
      <header className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00ffcc]/10 rounded-lg border border-[#00ffcc]/20">
              <Terminal size={22} className="text-[#00ffcc]" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter">EduAsas API Explorer</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Environment: Production v2.1</p>
              </div>
            </div>
          </div>
        </div>

        {/* URL DISPLAY BAR */}
        <div className="w-full bg-[#111]/50 backdrop-blur-md border border-[#1a1a1a] rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className={`px-4 py-1.5 rounded-lg border text-xs font-black tracking-widest ${getMethodColor(method)}`}>
            {method}
          </div>
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <Globe size={16} className="text-gray-600 shrink-0" />
            <span className="text-sm text-gray-600 font-bold shrink-0">{BASE_URL}</span>
            <span className="text-sm text-[#00ffcc] font-black truncate">{url}</span>
          </div>
          {!url.startsWith("/") && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20 animate-bounce">
               <AlertTriangle size={14} />
               <span className="text-[10px] font-black uppercase">Missing /</span>
            </div>
          )}
        </div>

        {/* 2. THE STRONG INPUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end bg-[#0d0d0d] p-6 rounded-3xl border border-[#1a1a1a] shadow-2xl">
          
          {/* Method Select (2/12) */}
          <div className="lg:col-span-2 bg-inherit">
            <EduSelect 
              options={methodList}
              labelKey="label"
              valueKey="value"
              variant="flat"
              label="Request Method"
              value={method}
              onChange={(item) => {if(!Array.isArray(item)){setMethod(item.value)}}}
            />
          </div>

          {/* Smart Field: Custom Path + Presets (8/12) */}
          <div className="lg:col-span-4 bg-inherit">
            <EduSmartField 
                suggestions={urlsList}
                label="API Endpoint (Select Preset)"
                suggestionKey="label"
                onSelect={(item) => setUrl(item.value)}
            />
          </div>

          {/* Basic Field: Custom Path */}
          <div className="lg:col-span-4 bg-inherit">
            <EduBasicInput 
                label="API Endpoint (Type Custom)"
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                placeholder="/path/to/resource"
            />
          </div>

          {/* Action Button (2/12) */}
          <div className="lg:col-span-2 bg-inherit">
            <EduButton 
              onClick={fetchData}
              isLoading={loading}
              className="w-full h-[52px] rounded-2xl shadow-lg shadow-[#00ffcc]/5"
              icon={method === "GET" ? RefreshCw : Send}
            >
              {method === "GET" ? "FETCH" : "EXECUTE"}
            </EduButton>
          </div>
        </div>
      </header>

      {/* 3. MAIN CONTENT: EDITOR & CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: BODY & HISTORY */}
        <div className="lg:col-span-4 space-y-6">
          {(method === "POST" || method === "PUT") && (
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2 px-1">
                <Database size={12} className="text-[#00ffcc]" /> JSON Payload
              </label>
              <textarea 
                value={jsonBody}
                onChange={(e) => setJsonBody(e.target.value)}
                className="w-full h-80 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 text-sm font-mono text-emerald-400 outline-none focus:border-[#00ffcc]/30 transition-all shadow-2xl custom-scrollbar"
                placeholder='{"key": "value"}'
              />
            </div>
          )}

          <div className="bg-[#0d0d0d] rounded-3xl border border-[#1a1a1a] overflow-hidden shadow-xl">
            <div className="px-5 py-4 bg-[#141414] border-b border-[#1a1a1a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={16} className="text-[#00ffcc]" />
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">History</span>
              </div>
              <span className="text-[9px] font-bold text-gray-600">Last 10 Logs</span>
            </div>
            <div className="divide-y divide-[#1a1a1a] max-h-[400px] overflow-y-auto custom-scrollbar">
              {history.length > 0 ? history.map((h, i) => (
                <button 
                  key={i} 
                  onClick={() => {setUrl(h.url); setMethod(h.method);}}
                  className="w-full p-5 text-left hover:bg-[#111] transition-all flex flex-col gap-2 group"
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${getMethodColor(h.method)}`}>
                      {h.method}
                    </span>
                    <span className="text-[9px] text-gray-600 font-bold">{h.time}</span>
                  </div>
                  <span className="text-xs text-gray-400 truncate font-medium group-hover:text-[#00ffcc] transition-colors">{h.url}</span>
                </button>
              )) : (
                <div className="p-12 text-center text-[10px] text-gray-700 font-black uppercase tracking-widest italic opacity-30">No Transactions</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: RESPONSE CONSOLE */}
        <div className="lg:col-span-8">
          <div className="relative bg-[#0d0d0d] border border-[#1a1a1a] rounded-3xl overflow-hidden min-h-[700px] flex flex-col shadow-2xl">
            <div className="px-8 py-5 bg-[#141414] border-b border-[#1a1a1a] flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00ffcc] rounded-full shadow-[0_0_8px_#00ffcc]" />
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Output Terminal</span>
                 </div>
                 {data && <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/5 border border-emerald-400/10 px-3 py-1 rounded-full uppercase">Status 200 OK</span>}
              </div>
              {data && (
                <button onClick={copyToClipboard} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black uppercase transition-all ${copied ? 'bg-[#00ffcc] text-black shadow-[0_0_15px_rgba(0,255,204,0.3)]' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#222]'}`}>
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy Result"}
                </button>
              )}
            </div>

            <div className="flex-1 p-8 overflow-auto custom-scrollbar">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-6">
                  <div className="relative">
                    <RefreshCw size={48} className="text-[#00ffcc] animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-[#00ffcc]/20 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-black text-gray-600 uppercase tracking-[0.6em]">Intercepting Data...</span>
                </div>
              ) : error ? (
                <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-3xl text-red-400">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle size={20} />
                    <h4 className="text-sm font-black uppercase italic tracking-wider">Exception Encountered</h4>
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl font-mono text-xs border border-red-500/10">
                    {error}
                  </div>
                </div>
              ) : data ? (
                <div className="relative group">
                   <pre className="text-sm leading-relaxed selection:bg-[#00ffcc]/30">
                    <code className="text-emerald-400/80">{JSON.stringify(data, null, 2)}</code>
                  </pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-800 opacity-20">
                   <Database size={64} className="mb-6" />
                   <p className="text-xs font-black uppercase tracking-[0.5em] italic">System Idle - Waiting for Request</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}