import { query } from "../config/database";

export const findAllReservations = async () => {
    const { rows } = await query(
        `SELECT bookings.booking_id,
        to_char(bookings.check_in, 'YYYY-MM-DD') AS check_in,
        to_char(bookings.check_out, 'YYYY-MM-DD') AS check_out,
        bookings.guests, bookings.nights, bookings.total_price,
        bookings.payment_status, bookings.booking_status,
        users.name AS user_name, users.email AS user_email,
        rooms.description AS room_description, hotels.name AS hotel_name
        FROM bookings
        JOIN users ON bookings.user_id = users.id
        JOIN rooms ON bookings.room_id = rooms.room_id
        JOIN hotels ON rooms.hotel_id = hotels.hotel_id
        ORDER BY bookings.created_at DESC`
    );
    return rows;
};

export const changeReservationStatus = async (booking_id: number, booking_status: string) => {
    const { rows } = await query(
        "UPDATE bookings SET booking_status = $1 WHERE booking_id = $2 RETURNING *",
        [booking_status, booking_id]
    );
    return rows[0] || null;
};

export const changeReservationDetails = async (
    booking_id: number, check_in: string, check_out: string, guests: number
) => {
    const { rows: found } = await query(
        `SELECT bookings.room_id, rooms.price, rooms.capacity, rooms.quantity
        FROM bookings JOIN rooms ON bookings.room_id = rooms.room_id
        WHERE bookings.booking_id = $1`,
        [booking_id]
    );
    const room = found[0];
    if (!room) {
        return null;
    }
    if (guests > Number(room.capacity)) {
        throw new Error("TOO_MANY_GUESTS");
    }
    const nights = Math.round(
        (new Date(check_out).getTime() - new Date(check_in).getTime()) / (1000 * 60 * 60 * 24)
    );
    const { rows: taken } = await query(
        `SELECT COUNT(*) FROM bookings
        WHERE room_id = $1 AND booking_id <> $4 AND booking_status <> 'Cancelled'
        AND check_in < $3::date AND check_out > $2::date`,
        [room.room_id, check_in, check_out, booking_id]
    );
    if (Number(taken[0].count) >= Number(room.quantity)) {
        throw new Error("ROOM_FULL");
    }
    const { rows } = await query(
        `UPDATE bookings SET check_in = $1, check_out = $2, guests = $3, nights = $4, total_price = $5
        WHERE booking_id = $6 RETURNING *`,
        [check_in, check_out, guests, nights, Number(room.price) * nights, booking_id]
    );
    return rows[0];
};