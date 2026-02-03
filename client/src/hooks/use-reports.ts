import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { InsertReport, Report, ReportStatus, InsertZone, InsertIntervention } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// === REPORTS ===

export function useReports() {
  return useQuery({
    queryKey: [api.reports.list.path],
    queryFn: async () => {
      const res = await fetch(api.reports.list.path);
      if (!res.ok) throw new Error("Failed to fetch reports");
      return api.reports.list.responses[200].parse(await res.json());
    },
  });
}

export function useReport(id: number) {
  return useQuery({
    queryKey: [api.reports.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.reports.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Report not found");
      return api.reports.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertReport) => {
      const res = await fetch(api.reports.create.path, {
        method: api.reports.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit report");
      return api.reports.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.analytics.stats.path] });
      toast({
        title: "Report Submitted",
        description: "Thank you for helping us manage the stray dog population.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ReportStatus }) => {
      const url = buildUrl(api.reports.updateStatus.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return api.reports.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.analytics.stats.path] });
      toast({
        title: "Status Updated",
        description: "The report status has been successfully changed.",
      });
    },
  });
}

// === ZONES ===

export function useZones() {
  return useQuery({
    queryKey: [api.zones.list.path],
    queryFn: async () => {
      const res = await fetch(api.zones.list.path);
      if (!res.ok) throw new Error("Failed to fetch zones");
      return api.zones.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertZone) => {
      const res = await fetch(api.zones.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create zone");
      return api.zones.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.zones.list.path] });
    },
  });
}

// === INTERVENTIONS ===

export function useCreateIntervention() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertIntervention) => {
      const res = await fetch(api.interventions.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to log intervention");
      return api.interventions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.interventions.list.path] });
      toast({
        title: "Intervention Logged",
        description: "Operation details saved successfully.",
      });
    },
  });
}

// === ANALYTICS ===

export function useAnalytics() {
  return useQuery({
    queryKey: [api.analytics.stats.path],
    queryFn: async () => {
      const res = await fetch(api.analytics.stats.path);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return api.analytics.stats.responses[200].parse(await res.json());
    },
  });
}
