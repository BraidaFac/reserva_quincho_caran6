"use client";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2, Sun, Moon, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BookingWithUser } from "@/types";

interface BookingCardProps {
  booking: BookingWithUser;
  currentUserId: string;
  isAdmin: boolean;
  onDeleted: (id: string) => void;
}

export function BookingCard({ booking, currentUserId, isAdmin, onDeleted }: BookingCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isMine = booking.userId === currentUserId;
  const canDelete = isMine || isAdmin;
  const isMorning = booking.shift === "MORNING";

  async function handleDelete() {
    if (!confirm("¿Cancelar esta reserva?")) return;
    setIsDeleting(true);
    const res = await fetch(`/api/bookings/${booking.id}`, { method: "DELETE" });
    setIsDeleting(false);
    if (res.ok) {
      toast.success("Reserva cancelada");
      onDeleted(booking.id);
    } else {
      toast.error("No se pudo cancelar");
    }
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border p-4 transition-colors",
        isMorning ? "bg-secondary/60 border-secondary" : "bg-accent/40 border-accent"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn("h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0",
          isMorning ? "bg-amber-100" : "bg-primary/10"
        )}>
          {isMorning ? <Sun className="h-4 w-4 text-amber-600" /> : <Moon className="h-4 w-4 text-primary" />}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-sm capitalize truncate">
            {format(new Date(booking.bookingDate), "EEEE d 'de' MMMM", { locale: es })}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span className="text-xs text-muted-foreground">
              {isMorning ? "Mediodía" : "Noche"} · P{booking.user.floor}/D{booking.user.flat}
            </span>
            {booking.shared && (
              <Badge variant="outline" className="text-xs py-0 h-4 gap-0.5">
                <Users className="h-2.5 w-2.5" /> Compartido
              </Badge>
            )}
            {isMine && <Badge variant="accent" className="text-xs py-0 h-4">Mía</Badge>}
          </div>
        </div>
      </div>
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
