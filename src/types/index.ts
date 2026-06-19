export type Shift = "MORNING" | "EVENING";
export type Role = "ADMIN" | "USER";

export interface BookingWithUser {
  id: number;
  shift: Shift;
  bookingDate: Date;
  createdAt: Date;
  userId: string;
  shared: boolean;
  user: {
    id: string;
    username: string;
    flat: string;
    floor: string;
  };
}
