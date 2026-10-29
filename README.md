# HotelApp

<img src="https://socialify.git.ci/ntombizodwantlahla53-code/HotelApp/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="HotelApp" width="640" height="320" />

## Project Description

**HotelApp** is a full-stack hotel booking website. It lets people find a hotel, look at its rooms, book a room for chosen dates, and pay online. It also gives hotel staff (admins) a place to add hotels and rooms and to manage bookings and payments.
Think of it as a small version of Booking.com:customers book and pay, admins run the hotels.

**Live demo**

- Website (frontend): https://hotel-app-m1wm.vercel.app
- Server (backend API): https://hotel-app-theta-jet.vercel.app/api/hotels

## Features

### For customers
- Create an account with an email and password, or sign in with **Google**
- Browse hotels and see the rooms in each hotel
- Book a room for the dates you choose
- Pay for a booking online with **Paystack**
- Save hotels to a **Favourites** list
- Read and write **reviews** for hotels
- See your own bookings and edit your **profile**

### For admins
- Add, edit and delete **hotels**
- Add, edit and delete **rooms**
- See all **reservations** and approve or cancel them
- See all **payments**
- Receive an **email** when a customer pays


## Tech Stack 

- **Frontend:** React + TypeScript + Vite.
- **State:** Redux Toolkit
- **Routing:** React Router
- **Backend:** Node.js + Express + TypeScript. This is the server. It receives requests and sends back data.
- **Database:** PostgreSQL on Neon. It stores users, hotels, rooms, bookings and more.
- **Login:** JWT + bcrypt + Google Sign-In. Safe logins and password hashing.
- **Payments:** Paystack. It takes card payments.
- **Emails:** Nodemailer. It sends payment and booking emails.
- **Hosting:** Vercel. It hosts both the frontend and the backend.

## Main Pages

**Everyone can open:**
- `/` Landing page
- `/Register` and `/Login`
- `/hotels/:hotel_id/rooms` Rooms of a hotel

**Logged-in users only:**
- `/bookings/:room_id` Book a room
- `/Payment/:booking_id` Pay for a booking
- `/Favourites` Saved hotels
- `/Profile` Your profile

**Admins only:**
- `/Admin` Admin dashboard
- `/Hotels` Manage hotels
- `/Rooms` Manage rooms

## Database Tables

- `users`: name, email, hashed password, role (`Customer` or `Admin`)
- `hotels`: the hotels
- `rooms`: the rooms that belong to a hotel
- `bookings`: which user booked which room, the dates, the price, `booking_status` and `payment_status`
- `reviews`: user reviews for hotels
- `favourites`: the hotels a user has saved


## Run It on Your Own Computer now
### 1. What you need first
- [Node.js](https://nodejs.org) 
- Git
- A free [Neon](https://neon.com) account (the database)
- A [Google Cloud](https://console.cloud.google.com) OAuth Client ID (for Google sign-in)
- A [Paystack](https://paystack.com) account (test keys are fine)
- A Gmail address with an **App Password** (for emails)

### 2. Download the project
```bash
git clone https://github.com/ntombizodwantlahla53-code/HotelApp.git
cd HotelApp
```

### 3. Set up the database (Neon)
1. Create a new project on Neon.
2. Click Connect, and copy the connection string.
3. Open the Neon **SQL Editor** and create the tables listed above.

### 4. Set up the backend
```bash
cd backend
npm install
```

Create a file called `backend/.env` and fill it in:

```env
DATABASE_URL=your_neon_connection_string
JWT_SECRET=any_long_random_text
PAYSTACK_SECRET_KEY=your_paystack_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_gmail_address
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=email_that_receives_payment_alerts
PORT=3000
```

Start it:
```bash
npm run dev
```
You should see: `Database connection successful`.

### 5. Set up the frontend
Open a **second** terminal:
```bash
cd frontend
npm install
```

Create a file called `frontend/.env`:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start it:
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

> In Google Cloud Console, add `http://localhost:5173` under **Authorized JavaScript origins** or Google sign-in will not work.

### 6. Make yourself an admin
New accounts are `Customer` by default. To become an admin, run this in the Neon **SQL Editor**:
```sql
UPDATE users SET role = 'Admin' WHERE email = 'your_email@example.com';
```
Log out and log in again.


## Test the API with Postman

You can test the backend without the website by using [Postman](https://www.postman.com/downloads/).

**Base URL**
- Live: `https://hotel-app-theta-jet.vercel.app/api`
- Local: `http://localhost:3000/api`

### How to send a request in Postman
1. Click **New → HTTP Request**.
2. Choose the method (GET, POST, PUT, PATCH or DELETE) on the left of the URL bar.
3. Type the full endpoint in the URL bar, for example `https://hotel-app-theta-jet.vercel.app/api/hotels`.
4. If the request needs data, open the **Body** tab, choose **raw**, change the type on the right from Text to **JSON**, and paste the JSON from the examples below.
5. Click **Send** and read the answer at the bottom.

### Routes that need you to be logged in
1. Send the **login** request below and copy the `token` from the answer.
2. In your next request open the **Authorization** tab.
3. Choose **Bearer Token** and paste the token.
4. Click **Send**.

### 1. Register
`POST /api/auth/register`
```json
{
  "name": "Ntombi",
  "email": "ntombi@example.com",
  "password": "ntombizodwa012"
}
```

### 2. Login (gives you the token)
`POST /api/auth/login`
```json
{
  "email": "ntombi@example.com",
  "password": "ntombizodwa012"
}
```

### 3. Get all hotels
`GET /api/hotels`

No body needed.

### 4. Add a hotel (admin token needed)
`POST /api/hotels`
```json
{
  "name": "Ocean View Hotel",
  "description": "A calm hotel next to the beach",
  "address": "12 Beach Road",
  "city": "Durban",
  "country": "South Africa",
  "ammenities": "WiFi, Pool, Breakfast",
  "star_rating": 4,
  "image_url": "https://example.com/hotel.jpg"
}
```

### 5. Get the rooms of a hotel
`GET /api/hotels/1/rooms`

No body needed. Replace `1` with the hotel id.

### 6. Add a room (admin token needed)
`POST /api/rooms`
```json
{
  "hotel_id": 1,
  "description": "Double room with sea view",
  "ammenities": "TV, Air conditioning",
  "capacity": 2,
  "quantity": 5,
  "price": 1200,
  "image_urls": ["https://example.com/room1.jpg", "https://example.com/room2.jpg"]
}
```

### 7. Book a room (token needed)
`POST /api/bookings`
```json
{
  "room_id": 1,
  "check_in": "2026-12-20",
  "check_out": "2026-12-23",
  "guests": 2,
  "number_of_rooms": 1
}
```

### 8. See your bookings (token needed)
`GET /api/bookings/my`

No body needed.

### 9. Pay for a booking (token needed)
`POST /api/bookings/1/pay`

No body needed. Replace `1`with the booking id. The answer contains a Paystack payment link.

### 10. Add a review (token needed)
`POST /api/hotels/1/reviews`
```json
{
  "rating": 5,
  "comment": "Clean rooms and friendly staff"
}
```

### 11. Add a hotel to favourites (token needed)
`POST /api/favourites`
```json
{
  "hotel_id": 1
}
```

### 12. Approve or cancel a reservation (admin token needed)
`PATCH /api/reservations/1/status`
```json
{
  "booking_status": "Approved"
}
```
Use `"Cancelled"` to cancel.

### 13. Delete things (token needed)
- `DELETE /api/favourites/1` removes hotel 1 from your favourites
- `DELETE /api/reviews/1` removes review 1
- `DELETE /api/hotels/1` deletes hotel 1 (admin)
- `DELETE /api/rooms/1` deletes room 1 (admin)


## How It Is Hosted

Both parts are hosted on **Vercel** for me, from the same GitHub repository, as two separate projects.

**Backend project**
- Root Directory: `backend`
- Needs all the backend environment variables above, except `PORT`
- `FRONTEND_URL` is the website's address

**Frontend project**
- Root Directory: `frontend`
- Needs `VITE_GOOGLE_CLIENT_ID`
- `frontend/vercel.json` sends every `/api/...`request to the backend address

After the frontend address is known, add it to:
- the backend `FRONTEND_URL` variable on Vercel (no `/` at the end), then redeploy the backend
- the Google OAuth **Authorized JavaScript origins**

## Author
Built by Me>[ntombizodwantlahla53-code](https://github.com/ntombizodwantlahla53-code)