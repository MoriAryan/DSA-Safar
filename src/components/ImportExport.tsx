"use client";

import React, { useRef } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "./ui/button";

export function ImportExport() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = localStorage.getItem("striver-a2z-progress-storage");
    if (!data) return;
    
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tuf-progress-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm("Warning: Importing a backup will overwrite your current progress. Do you want to continue?")) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        // Basic validation
        JSON.parse(content);
        localStorage.setItem("striver-a2z-progress-storage", content);
        window.location.reload(); // Reload to sync Zustand store
      } catch (err) {
        alert("Invalid backup file!");
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
        <Download size={16} />
        Export Progress
      </Button>
      
      <input 
        type="file" 
        accept=".json" 
        ref={fileInputRef} 
        onChange={handleImport} 
        className="hidden" 
      />
      
      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
        <Upload size={16} />
        Import Progress
      </Button>
    </div>
  );
}
