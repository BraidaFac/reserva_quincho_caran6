"use client";
import { useState, useEffect } from "react";
import {
  add, eachDayOfInterval, endOfMonth, format, getDay,
  isSameDay, isSameMonth, isToday, parse, startOfToday,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShiftModal } from "./shift-modal";
import type { BookingWithUser } from "@/types";

const COL_START: Record<number, string> = {
  0: "", 1: "col-start-2", 2: "col-start-3", 3: "col-start-4",
  4: "col-start-5", 5: "col-start-6", 6: "col-start-7",
};

interface Props {
  userId: string;
  isAdmin: boolean;
  bookings: BookingWithUser[];
  onRefresh: () => Promise<void>;
}

export function BookingCalendar({ userId, isAdmin, bookings, onRefresh }: Props) {
  const [today, setToday] = useState<Date>(() => startOfToday());
  const [currentMonth, setCurrentMonth] = useState(() => format(startOfToday(), "MMM-yyyy"));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const t = startOfToday();
    setToday(t);
    setCurrentMonth(format(t, "MMM-yyyy"));
  }, []);

  const firstDay = parse(currentMonth, "MMM-yyyy", new Date());
  const days = eachDayOfInterval({ start: firstDay, end: endOfMonth(firstDay) });

  const bookingsForDay = (day: Date) =>
    bookings.filter((b) => isSameDay(day, new Date(b.bookingDate)));

  const isDayFull = (day: Date) => bookingsForDay(day).length >= 2;
  const isPast = (day: Date) => day < today;

  function openModal(day: Date) {
    if (isDayFull(day) || isPast(day)) return;
    setSelectedDay(day);
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-3 sm:p-6 shadow-sm">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(format(add(firstDay, { months: -1 }), "MMM-yyyy"))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-semibold text-base sm:text-lg capitalize">
            {format(firstDay, "MMMM yyyy", { locale: es })}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(format(add(firstDay, { months: 1 }), "MMM-yyyy"))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground mb-1">
          {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dayBookings = bookingsForDay(day);
            const full = dayBookings.length >= 2;
            const past = isPast(day) && !isToday(day);
            const hasMorning = dayBookings.some((b) => b.shift === "MORNING");
            const hasEvening = dayBookings.some((b) => b.shift === "EVENING");

            return (
              <div
                key={day.toISOString()}
                className={cn(idx === 0 && COL_START[getDay(day)], "flex flex-col items-center py-0.5")}
              >
                <button
                  disabled={full || past}
                  onClick={() => openModal(day)}
                  className={cn(
                    "h-8 w-8 sm:h-9 sm:w-9 rounded-full flex flex-col items-center justify-center text-xs sm:text-sm font-medium transition-colors relative",
                    isToday(day) && "bg-primary text-primary-foreground",
                    !isToday(day) && !past && !full && "hover:bg-accent",
                    past && "text-muted-foreground/40 cursor-not-allowed",
                    full && !past && "cursor-not-allowed",
                    !isToday(day) && !past && "text-foreground",
                  )}
                >
                  {format(day, "d")}
                </button>
                <div className="flex gap-0.5 mt-0.5 h-1.5">
                  {hasMorning && <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />}
                  {hasEvening && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-3 sm:mt-4 text-xs text-muted-foreground justify-center">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Mediodía</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Noche</span>
        </div>
      </div>

      {selectedDay && (
        <ShiftModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          day={selectedDay}
          existingBookings={bookingsForDay(selectedDay)}
          userId={userId}
          onBooked={onRefresh}
        />
      )}
    </div>
  );
}
