import { query } from "../config/database";

export const findBookingToPay = async (booking_id: number, user_id: number) => {
    const { rows } = await query(
        `SELECT booking_id, total_price FROM bookings
        WHERE booking_id = $1 AND user_id = $2 AND payment_status = 'Pending'
        AND booking_status <> 'Cancelled'`,
        [booking_id, user_id]
    );
    return rows[0] || null;
};

export const markBookingAsPaid = async (booking_id: number, user_id: number) => {
    const { rows } = await query(
        `UPDATE bookings SET payment_status = 'Paid', paid_at = NOW()
        WHERE booking_id = $1 AND user_id = $2 AND payment_status = 'Pending'
        RETURNING *`,
        [booking_id, user_id]
    );
    return rows[0] || null;
};

export const findAllPayments = async () => {
    const { rows } = await query(
        `SELECT bookings.booking_id, bookings.total_price, bookings.payment_status,
        bookings.paid_at, users.name AS user_name, users.email AS user_email,
        hotels.name AS hotel_name FROM bookings
        JOIN users ON bookings.user_id = users.id
        JOIN rooms ON bookings.room_id = rooms.room_id
        JOIN hotels ON rooms.hotel_id = hotels.hotel_id
        WHERE bookings.booking_status <> 'Cancelled'
        ORDER BY bookings.created_at DESC`
    );
    return rows;
};