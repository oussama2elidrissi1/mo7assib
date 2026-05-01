"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Badge, statusVariant } from "@/components/ui/Badge";
import api from "@/lib/api";
import type { Attendance, Employee, Project } from "@/lib/types";
import { EMPLOYEE_ROLE_LABELS } from "@/lib/types";

export default function AttendancePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/projects").then((r) => {
      setProjects(r.data);
      if (r.data.length > 0) setSelectedProject(String(r.data[0].id));
    });
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    api.get(`/projects/${selectedProject}/employees`).then((r) => setEmployees(r.data));
    loadAttendance();
  }, [selectedProject, date]);

  const loadAttendance = () => {
    if (!selectedProject) return;
    api.get(`/attendance/project/${selectedProject}/daily?date=${date}`).then((r) => setAttendance(r.data));
  };

  const getRecord = (empId: number) => attendance.find((a) => a.employee_id === empId);

  const checkIn = async (empId: number) => {
    setLoading(true);
    try {
      await api.post("/attendance/check-in", {
        employee_id: empId, project_id: parseInt(selectedProject),
        date, check_in: new Date().toTimeString().slice(0, 8),
      });
      loadAttendance();
    } finally { setLoading(false); }
  };

  const checkOut = async (attId: number) => {
    setLoading(true);
    try {
      await api.put(`/attendance/${attId}/checkout`, { check_out: new Date().toTimeString().slice(0, 8) });
      loadAttendance();
    } finally { setLoading(false); }
  };

  const markAbsent = async (empId: number) => {
    setLoading(true);
    try {
      await api.post("/attendance/mark-absent", { employee_id: empId, project_id: parseInt(selectedProject), date });
      loadAttendance();
    } finally { setLoading(false); }
  };

  const statusLabel: Record<string, string> = { present: "Présent", absent: "Absent", half_day: "Mi-journée" };

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pointage</h1>
        <p className="text-gray-500 text-sm">Gestion quotidienne des présences</p>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Chantier</label>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm">
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              {["Nom", "Rôle", "Statut", "Entrée", "Sortie", "Heures", "Actions"].map(h => (
                <th key={h} className="pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const rec = getRecord(emp.id);
              return (
                <tr key={emp.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{emp.name}</td>
                  <td className="pr-4 text-gray-500">{EMPLOYEE_ROLE_LABELS[emp.role]}</td>
                  <td className="pr-4">
                    {rec ? <Badge label={statusLabel[rec.status]} variant={statusVariant(rec.status)} /> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="pr-4">{rec?.check_in || "—"}</td>
                  <td className="pr-4">{rec?.check_out || "—"}</td>
                  <td className="pr-4">{rec?.worked_hours ? `${rec.worked_hours}h` : "—"}</td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {!rec && (
                        <>
                          <Button size="sm" onClick={() => checkIn(emp.id)} disabled={loading}>Entrée</Button>
                          <Button size="sm" variant="secondary" onClick={() => markAbsent(emp.id)} disabled={loading}>Absent</Button>
                        </>
                      )}
                      {rec && rec.status === "present" && !rec.check_out && (
                        <Button size="sm" variant="secondary" onClick={() => checkOut(rec.id)} disabled={loading}>Sortie</Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {employees.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-gray-400">Aucun employé sur ce chantier.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
