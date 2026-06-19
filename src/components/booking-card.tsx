"use client";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2, Sun, Moon, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn, parseBookingDate } from "@/lib/utils";
import type { BookingWithUser } from "@/types";

interface BookingCardProps {
  booking: BookingWithUser;
  currentUserId: string;
  isAdmin: boolean;
  onDeleted: (id: number) => void;
}

export function BookingCard({ booking, currentUserId, isAdmin, onDeleted }: BookingCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isMine = booking.userId === currentUserId;
  const canDelete = isMine || isAdmin;
  const isMorning = booking.shift === "MORNING";
  const bookingDate = parseBookingDate(booking.bookingDate);

  async function handleDelete() {
    setIsDeleting(true);
    const res = await fetch(`/api/bookings/${booking.id}`, { method: "DELETE" });
    setIsDeleting(false);
    setConfirmOpen(false);
    if (res.ok) {
      toast.success("Reserva cancelada");
      onDeleted(booking.id);
    } else {
      toast.error("No se pudo cancelar");
    }
  }

  return (
    <>
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
              {format(bookingDate, "EEEE d 'de' MMMM", { locale: es })}
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
            onClick={() => setConfirmOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>Cancelar reserva</DialogTitle>
            <DialogDescription>
              ¿Cancelar el turno del{" "}
              <strong className="text-foreground capitalize">
                {format(bookingDate, "EEEE d 'de' MMMM", { locale: es })}
              </strong>{" "}
              ({isMorning ? "Mediodía" : "Noche"})?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={isDeleting}>
              No, mantener
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Cancelando…" : "Sí, cancelar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
