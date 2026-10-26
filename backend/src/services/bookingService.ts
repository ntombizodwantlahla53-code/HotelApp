import { query } from "../config/database";

export const findRoomById = async (
    room_id: number
) => {
    const { rows } = await query(
        "SELECT * FROM rooms WHERE room_id = $1",
        [room_id]
    );
    return rows[0] || null;
};

export const createBooking = async (
    booking: { user_id: number; room_id: number;check_in: string; check_out: string;guests: number;
}) => {
    const room = await findRoomById(booking.room_id);
    if (!room) {
        throw new Error("room not found");
    }
    if (booking.guests < 1 || booking.guests > Number(room.capacity)) {
        throw new Error("quest capacity");
    }
    const start = new Date(booking.check_in);
    const end = new Date(booking.check_out);
    const nights = Math.round(
        (end.getTime() - start.getTime())/(1000*60*60*24)
    );
    if (!Number.isFinite(nights) || nights < 1) {
        throw new Error("DATES invalid");
    }

    const { rows: taken } = await query(
        `SELECT COUNT(*) FROM bookings
        WHERE room_id = $1 AND check_in < $3::date AND check_out > $2::date`,
        [booking.room_id, booking.check_in, booking.check_out]
    );
    if (Number(taken[0].count) >= Number(room.quantity)) {
        throw new Error("ROOM_FULL");
    }

    const total_price = Number(room.price) * nights;
    const { rows } = await query(
        `INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, nights, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [booking.user_id, booking.room_id, booking.check_in, booking.check_out, booking.guests, nights,total_price]
    );
    return rows[0];
};

export const findMyBookings = async (user_id: number) => {
    const { rows } = await query(
        `SELECT b.*, rooms.description AS room_description,
        rooms.price AS price_per_night,
        hotels.name AS hotel_name
        FROM bookings
        JOIN rooms ON bookings.room_id = rooms.room_id
        JOIN hotels ON rooms.hotel_id = hotels.hotel_id
        WHERE bookings.user_id = $1
        ORDER BY bookings.created_at DESC`,
        [user_id]
    );
    return rows;
};