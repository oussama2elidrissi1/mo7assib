"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AppShell from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import api from "@/lib/api";

const schema = z.object({
  name: z.string().min(1),
  client_type: z.enum(["private", "public"]),
  location: z.string().min(1),
  address: z.string().optional(),
  project_type: z.enum(["labor_only", "labor_with_materials"]),
  status: z.enum(["planned", "active", "paused", "finished", "cancelled"]),
  agreed_price: z.string().optional(),
  start_date: z.string().optional(),
  estimated_end_date: z.string().optional(),
  estimated_duration_days: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api.get(`/projects/${id}`).then((r) => {
      const p = r.data;
      reset({
        name: p.name,
        client_type: p.client_type,
        location: p.location,
        address: p.address || "",
        project_type: p.project_type,
        status: p.status,
        agreed_price: p.agreed_price?.toString() || "",
        start_date: p.start_date || "",
        estimated_end_date: p.estimated_end_date || "",
        estimated_duration_days: p.estimated_duration_days?.toString() || "",
      });
    });
  }, [id, reset]);

  async function onSubmit(data: FormData) {
    await api.put(`/projects/${id}`, {
      ...data,
      agreed_price: data.agreed_price ? parseFloat(data.agreed_price) : undefined,
      estimated_duration_days: data.estimated_duration_days ? parseInt(data.estimated_duration_days) : undefined,
    });
    router.push(`/projects/${id}`);
  }

  return (
    <AppShell>
      <div className="mb-6"><h1 className="text-2xl font-bold">Modifier le chantier</h1></div>
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nom du projet *" {...register("name")} error={errors.name?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type de client *" {...register("client_type")} error={errors.client_type?.message}
              options={[{ value: "private", label: "Privé" }, { value: "public", label: "Public" }]} />
            <Select label="Type de projet *" {...register("project_type")} error={errors.project_type?.message}
              options={[{ value: "labor_only", label: "Main d'œuvre uniquement" }, { value: "labor_with_materials", label: "MO + Matériaux" }]} />
          </div>
          <Input label="Localisation *" {...register("location")} error={errors.location?.message} />
          <Input label="Adresse" {...register("address")} />
          <Select label="Statut" {...register("status")}
            options={[
              { value: "planned", label: "Planifié" }, { value: "active", label: "Actif" },
              { value: "paused", label: "En pause" }, { value: "finished", label: "Terminé" },
              { value: "cancelled", label: "Annulé" },
            ]} />
          <Input label="Prix convenu (MAD)" type="number" step="0.01" {...register("agreed_price")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date de début" type="date" {...register("start_date")} />
            <Input label="Fin estimée" type="date" {...register("estimated_end_date")} />
          </div>
          <Input label="Durée estimée (jours)" type="number" {...register("estimated_duration_days")} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Enregistrement..." : "Enregistrer"}</Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>Annuler</Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}
