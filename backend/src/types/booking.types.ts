export interface Booking {
    booking_id: number;
    user_id: number;
    room_id: number;
    check_in: Date;
    check_out: Date;
    guests: number;
    nights: number;
    total_price: number;
    created_at: Date;
}

export type NewBooking = Omit<Booking,'booking_id' | 'nights' | 'total_price' | 'created_at'>;