import { useEffect, useState } from 'react';
import { Copy, Clock, Lock, AlertTriangle, FileText, Unlock, Download, Paperclip } from 'lucide-react';
import { getPaste, type Paste } from '../api';
import { useToast } from './ui/use-toast';
import { decryptFile, deriveKeys, decryptData, base64ToKey } from '../lib/crypto';

export default function ViewPaste({ id }: { id: string }) {
  const [paste, setPaste] = useState<Paste | null>(null);
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [downloading, setDownloading] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchPaste();
  }, [id]);

  useEffect(() => {
     if (paste?.timeoutUnix) {
        const timer = setInterval(() => {
           const diff = (paste.timeoutUnix as number) - Math.floor(Date.now() / 1000);
           if (diff <= 0) {
              setTimeLeft('Expired');
              clearInterval(timer);
              window.location.reload();
           } else {
              setTimeLeft(formatTime(diff));
           }
        }, 1000);
        return () => clearInterval(timer);
     }
  }, [paste]);

  const formatTime = (seconds: number) => {
      const days = Math.floor(seconds / (24 * 60 * 60));
      const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((seconds % (60 * 60)) / 60);
      const s = seconds % 60;
      
      let res = '';
      if (days > 0) res += `${days}d `;
      if (hours > 0) res += `${hours}h `;
      if (minutes > 0) res += `${minutes}m `;
      if (s > 0) res += `${s}s`;
      return res.trim();
  };

  const handleUnlock = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!password) {
        toast({ title: "Password Required", variant: "destructive" });
        return;
     }

     if (!paste?.salt) {
       toast({ title: "Internal Error", description: "Salt missing from response", variant: "destructive" });
       return;
     }

     setLoading(true);
     try {
       const keys = await deriveKeys(password, paste.salt);
       const eKey = keys.encryptionKey;
       const accessHash = keys.accessHash;
       setEncryptionKey(eKey);
       await fetchPaste(accessHash, eKey);
     } catch (err: any) {
       console.error(err);
       toast({ title: "Error", description: "Failed to derive keys", variant: "destructive" });
       setLoading(false);
     }
  };

  const fetchPaste = async (token: string = '', keyOverride?: Uint8Array) => {
     setLoading(true);
     try {
        const data = await getPaste(id, token);
        const isLocked = data.protected && data.text === null && data.files === null;
        
        if (isLocked) {
           setPaste(data);
           setIsProtected(true);
        } else {
           setPaste(data);
           setIsProtected(false);
           
           // Determine key to use
           let keyToUse = keyOverride || encryptionKey;
           
           // If no key override but we have a masterKey from server (unprotected)
           if (!keyToUse && data.masterKey) {
             try {
               keyToUse = base64ToKey(data.masterKey);
               setEncryptionKey(keyToUse);
             } catch (e) {
               console.error("Failed to parse master key", e);
             }
           }

           if (keyToUse && data.text) {
             try {
               const decrypted = await decryptData(data.text, keyToUse);
               setDecryptedText(decrypted);
             } catch (err) {
               console.error("Decryption failed", err);
               toast({ title: "Decryption Failed", description: "The key is incorrect.", variant: "destructive" });
             }
           }
        }
     } catch (e: any) {
        console.error(e);
        if (e.message === "Unauthorized") {
             toast({ title: "Error", description: "Incorrect password.", variant: "destructive" });
        } else if (e.message === "NotFound") {
             setError('Paste not found or expired.');
        } else {
             setError('Failed to load paste.');
        }
     } finally {
        setLoading(false);
     }
  };

  const copyToClipboard = () => {
     if (decryptedText) {
        navigator.clipboard.writeText(decryptedText);
        toast({ title: "Copied!", description: "Copied to clipboard." });
     }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDownload = async (file: any, index: number) => {
    if (downloading[index] || !encryptionKey) return;
    
    setDownloading(prev => ({ ...prev, [index]: true }));
    try {
      const response = await fetch(file.url);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      
      const finalBlob = await decryptFile(blob, encryptionKey);
      
      const url = URL.createObjectURL(finalBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Download Error",
        description: err.message || "Failed to download or decrypt file.",
        variant: "destructive"
      });
    } finally {
      setDownloading(prev => ({ ...prev, [index]: false }));
    }
  };

  if (loading && !paste) {
     return <div className="text-center p-10"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto"></div></div>;
  }

  if (error) {
     return (
        <div className="bg-surface/80 p-8 rounded-xl border border-error/50 flex flex-col items-center text-center gap-4">
           <AlertTriangle size={48} className="text-error" />
           <h2 className="text-xl font-bold text-error">Something went wrong</h2>
           <p>{error}</p>
           <button onClick={() => window.location.href = '/'} className="btn-primary mt-4">Go Home</button>
        </div>
     );
  }

  if (isProtected && !decryptedText) {
     return (
        <div className="relative max-w-md mx-auto w-full group">
           <div className="absolute -inset-[1px] bg-gradient-to-r from-warning/30 via-primary/30 to-warning/30 rounded-2xl blur-[1px] transition-all duration-500"></div>
           <div className="relative bg-surface/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-2xl overflow-hidden">
              <div className="flex flex-col items-center gap-6 text-center">
                 <div className="relative">
                    <div className="absolute inset-0 bg-warning/20 blur-xl rounded-full animate-pulse"></div>
                    <div className="relative p-5 bg-warning/10 rounded-full border border-warning/20 text-warning">
                       <Lock size={48} />
                    </div>
                 </div>
                 <div>
                    <h2 className="text-2xl font-black tracking-tight mb-2">Password Protected</h2>
                    <p className="text-subtle-gray text-sm font-medium">This Klister is encrypted. Enter the secret password to decrypt and view the content.</p>
                 </div>
                 
                 <form onSubmit={handleUnlock} className="w-full space-y-4">
                    <input
                       type="password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Enter password"
                       className="w-full px-5 py-3 bg-input-bg/50 border border-border-color/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-warning/50 text-center font-bold tracking-widest backdrop-blur-sm transition-all"
                       autoFocus
                    />
                    <button 
                       type="submit"
                       disabled={loading}
                       className="relative group/btn w-full flex items-center justify-center gap-2 overflow-hidden px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-warning/10"
                    >
                       <div className="absolute inset-0 bg-gradient-to-r from-warning to-primary transition-all group-hover/btn:scale-105"></div>
                       <span className="relative text-white flex items-center gap-2">
                          {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <>Unlock Klister <Unlock size={18} className="group-hover/btn:rotate-12 transition-transform" /></>}
                       </span>
                    </button>
                 </form>
              </div>
           </div>
        </div>
     );
  }

  // If not protected but no decryption key, we can't show it
  if (!isProtected && paste && decryptedText === null && !loading) {
     return (
        <div className="bg-surface/80 p-8 rounded-xl border border-warning/50 flex flex-col items-center text-center gap-4">
           <Lock size={48} className="text-warning" />
           <h2 className="text-xl font-bold text-warning">Decryption Failed</h2>
           <p>This paste is encrypted but the decryption key is missing or invalid. If this is a protected paste, please ensure you are using the correct password.</p>
           <button onClick={() => window.location.href = '/'} className="btn-primary mt-4">Go Home</button>
        </div>
     );
  }

  return (
    <div className="relative group">
      {/* Decorative Gradient Border */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 to-primary-variant/20 rounded-2xl blur-[1px] transition-all duration-500"></div>

      <div className="relative bg-surface/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl flex flex-col gap-5">
        <div className="flex justify-between items-center border-b border-border-color/30 pb-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText size={20} className="text-primary" />
              </div>
              <span className="font-bold tracking-tight">Klister ID: <span className="text-primary">{id}</span></span>
           </div>
           <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
              {paste?.protected && (
                <span className="flex items-center gap-1.5 text-warning bg-warning/10 px-2 py-1 rounded-md">
                  <Lock size={12} /> Protected
                </span>
              )}
              <span className="flex items-center gap-1.5 text-subtle-gray bg-surface-variant/50 px-2 py-1 rounded-md">
                <Clock size={12} /> {timeLeft}
              </span>
           </div>
        </div>

        {decryptedText && (
          <div className="relative group/textarea">
             <textarea
                readOnly
                value={decryptedText}
                className="w-full h-96 bg-input-bg/50 border border-border-color/50 rounded-xl p-5 text-on-surface focus:outline-none resize-none font-mono backdrop-blur-sm transition-all"
             />
             <div className="absolute top-4 right-4 flex gap-2">
               <button 
                  onClick={copyToClipboard}
                  className="p-2.5 bg-surface/80 backdrop-blur-md hover:bg-primary hover:text-white rounded-xl border border-border-color/50 transition-all shadow-lg group/copy"
                  title="Copy to Clipboard"
               >
                  <Copy size={18} className="group-active/copy:scale-90 transition-transform" />
               </button>
             </div>
          </div>
        )}

        {paste?.files && paste.files.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
            <h3 className="text-[10px] font-black text-subtle-gray flex items-center gap-2 uppercase tracking-widest px-1">
              <Paperclip size={12} className="text-primary" /> Associated Files
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paste.files.map((file, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleDownload(file, idx)}
                  disabled={downloading[idx] || !encryptionKey}
                  className="flex items-center justify-between bg-surface-variant/30 hover:bg-primary/5 p-3.5 rounded-xl border border-border-color/30 transition-all group w-full disabled:opacity-50 backdrop-blur-md hover:border-primary/30"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                      {downloading[idx] ? (
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      ) : (
                        <Download size={16} />
                      )}
                    </div>
                    <div className="flex flex-col truncate text-left">
                      <span className="truncate text-sm font-semibold">{file.name}</span>
                      <span className="text-[10px] font-medium text-subtle-gray">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 pr-2">
                    Decrypt & Save
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-border-color/30">
          <button 
            onClick={() => window.location.href = '/'} 
            className="flex items-center gap-2 text-subtle-gray hover:text-primary text-sm font-bold transition-colors group/back"
          >
            <span className="group-hover/back:-translate-x-1 transition-transform">&larr;</span> Create New Klister
          </button>
          
          <div className="text-[10px] font-bold text-subtle-gray/50 uppercase tracking-widest">
            End-to-End Encrypted
          </div>
        </div>
      </div>
    </div>
  );
}
