"use client";
import { useEffect, useRef, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import api from "@/lib/api";
import type { Document, Project } from "@/lib/types";
import { FileText, Upload, Trash2, Download } from "lucide-react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = (pid: string) => {
    if (!pid) return;
    api.get(`/projects/${pid}/documents`).then((r) => setDocuments(r.data));
  };

  useEffect(() => {
    api.get("/projects").then((r) => {
      setProjects(r.data);
      if (r.data.length > 0) { setSelectedProject(String(r.data[0].id)); load(String(r.data[0].id)); }
    });
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProject) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("project_id", selectedProject);
      form.append("related_type", "project");
      await api.post("/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      load(selectedProject);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm("Supprimer ce document ?")) return;
    await api.delete(`/documents/${docId}`);
    load(selectedProject);
  };

  const fmtSize = (kb?: number) => kb ? `${(kb / 1024).toFixed(1)} MB` : "";
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="flex gap-2">
          <select value={selectedProject} onChange={(e) => { setSelectedProject(e.target.value); load(e.target.value); }}
            className="border rounded-lg px-3 py-1.5 text-sm">
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx" onChange={handleUpload} />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading || !selectedProject}>
            <Upload size={16} className="mr-2" />{uploading ? "Envoi..." : "Téléverser"}
          </Button>
        </div>
      </div>

      <Card>
        {documents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText size={40} className="mx-auto mb-2 opacity-30" />
            <p>Aucun document. Téléversez votre premier fichier.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {documents.map((d) => (
              <li key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">{d.file_name}</p>
                    <p className="text-xs text-gray-400">{d.mime_type} {fmtSize(Number(d.file_size))}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`${API_URL}${d.file_url}`} target="_blank" rel="noreferrer">
                    <Button variant="ghost" size="sm"><Download size={14} /></Button>
                  </a>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(d.id)}>
                    <Trash2 size={14} className="text-red-400" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AppShell>
  );
}
