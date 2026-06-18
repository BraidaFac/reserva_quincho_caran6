"use client";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Sun, Moon, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { BookingWithUser } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: Date;
  existingBookings: BookingWithUser[];
  userId: string;
  onBooked: () => void;
}

export function ShiftModal({ open, onOpenChange, day, existingBookings, userId, onBooked }: Props) {
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState<"MORNING" | "EVENING" | null>(null);

  const morningTaken = existingBookings.some((b) => b.shift === "MORNING");
  const eveningTaken = existingBookings.some((b) => b.shift === "EVENING");

  async function book(shift: "MORNING" | "EVENING") {
    setLoading(shift);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, bookingDate: day.toISOString(), shift, shared }),
    });
    setLoading(null);
    if (res.ok) {
      toast.success("Reserva creada");
      onBooked();
      onOpenChange(false);
      setShared(false);
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Error al reservar");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Elegir turno</DialogTitle>
          <DialogDescription className="capitalize">
            {format(day, "EEEE d 'de' MMMM", { locale: es })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Morning */}
          <button
            disabled={morningTaken || loading !== null}
            onClick={() => book("MORNING")}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
              morningTaken
                ? "opacity-40 cursor-not-allowed bg-muted"
                : "hover:bg-secondary/80 bg-secondary/40 border-secondary cursor-pointer"
            )}
          >
            <Sun className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">Mediodía</p>
              {morningTaken && <p className="text-xs text-muted-foreground">Ocupado</p>}
            </div>
            {loading === "MORNING" && <Loader2 className="h-4 w-4 animate-spin" />}
          </button>

          {/* Evening */}
          <button
            disabled={eveningTaken || loading !== null}
            onClick={() => book("EVENING")}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
              eveningTaken
                ? "opacity-40 cursor-not-allowed bg-muted"
                : "hover:bg-accent/80 bg-accent/40 border-accent cursor-pointer"
            )}
          >
            <Moon className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm">Noche</p>
              {eveningTaken && <p className="text-xs text-muted-foreground">Ocupado</p>}
            </div>
            {loading === "EVENING" && <Loader2 className="h-4 w-4 animate-spin" />}
          </button>

          {/* Shared toggle */}
          <button
            onClick={() => setShared(!shared)}
            className={cn(
              "w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
              shared ? "bg-accent border-accent" : "bg-muted/40 border-muted"
            )}
          >
            <div className={cn(
              "h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0",
              shared ? "bg-primary border-primary" : "border-muted-foreground"
            )}>
              {shared && <span className="text-white text-[10px] font-bold">✓</span>}
            </div>
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Label className="cursor-pointer text-sm">Turno compartido</Label>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
