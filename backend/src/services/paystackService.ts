export const createPaystackPayment = async (email: string, total_price: number, booking_id: number) => {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        },
        body: JSON.stringify({
            email,
            amount: Math.round(Number(total_price) * 100),
            callback_url: `${process.env.FRONTEND_URL}/PaymentCallback`,
            metadata: { booking_id }
        })
    });
    const data = await response.json();

    if (!data.status) {
        throw new Error(data.message);
    }
    return data.data;
};

export const checkPaystackPayment = async (reference: string) => {
    const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );
    const data = await response.json();

    if (!data.status) {
        throw new Error(data.message);
    }
    return data.data;
};