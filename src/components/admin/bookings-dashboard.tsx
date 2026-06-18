"use client";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Sun, Moon, Users, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  shift: "MORNING" | "EVENING";
  bookingDate: string;
  shared: boolean;
  user: { username: string; flat: string; floor: string };
}

interface ApiResponse {
  bookings: Booking[];
  total: number;
  page: number;
  totalPages: number;
}

const SHIFT_OPTIONS = [
  { value: "ALL", label: "Todos los turnos" },
  { value: "MORNING", label: "Mediodía" },
  { value: "EVENING", label: "Noche" },
];

export function BookingsDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ from: "", to: "", shift: "ALL" });

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    if (filters.shift !== "ALL") params.set("shift", filters.shift);

    const res = await fetch(`/api/admin/bookings?${params}`);
    if (res.ok) setData(await res.json());
    setIsLoading(false);
  }, [page, filters]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  }

  function clearFilters() {
    setFilters({ from: "", to: "", shift: "ALL" });
    setPage(1);
  }

  const hasFilters = filters.from || filters.to || filters.shift !== "ALL";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <form onSubmit={applyFilters} className="flex flex-wrap gap-3 items-end">
          <div className="space-y-1.5 min-w-[140px]">
            <Label>Desde</Label>
            <Input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5 min-w-[140px]">
            <Label>Hasta</Label>
            <Input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5 min-w-[160px]">
            <Label>Turno</Label>
            <Select value={filters.shift} onValueChange={(v) => setFilters((f) => ({ ...f, shift: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SHIFT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="gap-1.5">
              <Search className="h-3.5 w-3.5" /> Filtrar
            </Button>
            {hasFilters && (
              <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                Limpiar
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Stats summary */}
      {data && (
        <p className="text-sm text-muted-foreground">
          {data.total} reserva{data.total !== 1 ? "s" : ""} encontrada{data.total !== 1 ? "s" : ""}
          {hasFilters ? " con los filtros aplicados" : ""}
        </p>
      )}

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Fecha</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead className="hidden sm:table-cell">Depto</TableHead>
              <TableHead className="hidden md:table-cell">Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}><div className="h-4 bg-muted animate-pulse rounded" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No se encontraron reservas
                </TableCell>
              </TableRow>
            ) : (
              data?.bookings.map((b) => {
                const isMorning = b.shift === "MORNING";
                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium capitalize">
                      {format(new Date(b.bookingDate), "EEE d MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("gap-1", isMorning ? "bg-amber-100 text-amber-700" : "bg-accent text-accent-foreground")}
                      >
                        {isMorning ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                        {isMorning ? "Mediodía" : "Noche"}
                      </Badge>
                    </TableCell>
                    <TableCell>{b.user.username}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                      P{b.user.floor} · D{b.user.flat}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {b.shared && (
                        <Badge variant="outline" className="gap-1 text-xs">
                          <Users className="h-3 w-3" /> Compartido
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {data.page} de {data.totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline" size="icon" className="h-8 w-8"
              disabled={data.page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
              const pg = data.totalPages <= 5 ? i + 1
                : data.page <= 3 ? i + 1
                : data.page >= data.totalPages - 2 ? data.totalPages - 4 + i
                : data.page - 2 + i;
              return (
                <Button
                  key={pg}
                  variant={pg === data.page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setPage(pg)}
                >
                  {pg}
                </Button>
              );
            })}
            <Button
              variant="outline" size="icon" className="h-8 w-8"
              disabled={data.page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
