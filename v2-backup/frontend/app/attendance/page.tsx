"use client";

import { useEffect, useState } from "react";

import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import api from "@/lib/api";
import { ATTENDANCE_STATUS_LABELS, EMPLOYEE_ROLE_LABELS, Attendance, Employee, Project } from "@/lib/types";

export default function AttendancePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/projects").then((response) => {
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProject(String(response.data[0].id));
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    api.get(`/projects/${selectedProject}/employees`).then((response) => setEmployees(response.data));
    loadAttendance(selectedProject, date);
  }, [selectedProject, date]);

  const loadAttendance = (projectId = selectedProject, day = date) => {
    if (!projectId) return;
    api.get(`/attendance/project/${projectId}/daily?date=${day}`).then((response) => setAttendance(response.data));
  };

  const getRecord = (employeeId: number) => attendance.find((item) => item.employee_id === employeeId);

  const checkIn = async (employeeId: number) => {
    setLoading(true);
    try {
      await api.post("/attendance/check-in", {
        employee_id: employeeId,
        project_id: Number(selectedProject),
        date,
        check_in: new Date().toTimeString().slice(0, 8),
      });
      loadAttendance();
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async (attendanceId: number) => {
    setLoading(true);
    try {
      await api.put(`/attendance/${attendanceId}/checkout`, { check_out: new Date().toTimeString().slice(0, 8) });
      loadAttendance();
    } finally {
      setLoading(false);
    }
  };

  const markAbsent = async (employeeId: number) => {
    setLoading(true);
    try {
      await api.post("/attendance/mark-absent", {
        employee_id: employeeId,
        project_id: Number(selectedProject),
        date,
      });
      loadAttendance();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="الفريق والنقطة"
        title="النقطة اليومية"
        description="تدبير يومي للحضور والغياب والخروج من نفس شاشة التشغيل."
      />

      <Card className="mb-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm text-slate-500">الورش</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-500">التاريخ</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Card>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-right text-slate-500">
              {["الاسم", "الدور", "الحالة", "الدخول", "الخروج", "الساعات", "الإجراءات"].map((header) => (
                <th key={header} className="pb-3 pr-4">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const record = getRecord(employee.id);
              return (
                <tr key={employee.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{employee.name}</td>
                  <td className="pr-4 text-slate-500">{EMPLOYEE_ROLE_LABELS[employee.role]}</td>
                  <td className="pr-4">
                    {record ? (
                      <StatusBadge status={record.status} label={ATTENDANCE_STATUS_LABELS[record.status]} />
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="pr-4">{record?.check_in || "—"}</td>
                  <td className="pr-4">{record?.check_out || "—"}</td>
                  <td className="pr-4">{record?.worked_hours ? `${record.worked_hours}h` : "—"}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {!record ? (
                        <>
                          <Button size="sm" onClick={() => checkIn(employee.id)} disabled={loading}>
                            دخول
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => markAbsent(employee.id)} disabled={loading}>
                            غياب
                          </Button>
                        </>
                      ) : null}
                      {record && record.status === "present" && !record.check_out ? (
                        <Button size="sm" variant="secondary" onClick={() => checkOut(record.id)} disabled={loading}>
                          خروج
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  ما كاين حتى موظف على هذا الورش.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
