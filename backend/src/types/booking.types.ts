export interface Booking {
    booking_id: number;
    user_id: number;
    room_id: number;
    check_in: Date;
    check_out: Date;
    guests: number;
    number_of_rooms: number;
    nights: number;
    total_price: number;
    payment_status: string;
    booking_status: string;
    paid_at: Date | null;
    created_at: Date;
}

export type NewBooking = Omit<Booking,'booking_id' | 'nights' | 'total_price' | 'payment_status' | 'booking_status' | 'paid_at' | 'created_at'>;