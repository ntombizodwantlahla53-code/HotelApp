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
3. Open the Neon **SQL Editor** and create the tables listed:
```sql 
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'Customer' CHECK (role IN ('Customer', 'Admin'))
);

CREATE TABLE hotels (
    hotel_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100),
    ammenities TEXT,
    star_rating INTEGER,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    description TEXT,
    ammenities TEXT,
    capacity INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    image_urls TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id INTEGER NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL,
    nights INTEGER NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE favourites (
    favourite_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hotel_id INTEGER NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    UNIQUE (user_id, hotel_id)
);

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hotel_id INTEGER NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, hotel_id)
);

ALTER TABLE bookings ADD COLUMN number_of_rooms INTEGER NOT NULL DEFAULT 1;
ALTER TABLE bookings ADD COLUMN booking_status VARCHAR(20) DEFAULT 'Pending';
```
NB: run tables 1 by 1 not all in 1.
tables:

### 4. Set up the backend
```bash
cd backend
npm install

```

## Create a file called `backend/.env` and fill it in:
```env
DATABASE_URL= your_neon_connection_string
JWT_SECRET= this-key-is-very-secret
PAYSTACK_SECRET_KEY= your_paystack_secret_key (you will get your paystack key
 on your paystack go to paystack settings and 
 look for API option you will get your api_key there ,copy and come paste it here)

GOOGLE_CLIENT_ID=your_google_client_id (go to https://console.cloud.google.com/ and login or sign up with your email. 
Add new project you can name it HotelApp, 
then on options goi to API and services on your left side you'll see option ,go to OAuth consent screen)

FRONTEND_URL=http://localhost:5173 (put this url but youll change it after you hoted your frontend and put e.g https://........vercel.app if you host using vercel)
EMAIL_USER=your_gmail_address
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=email_that_receives_payment_alerts
PORT=3000
```
## theN create config file on backend with database.ts inside it put:
```json
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const textDbConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("Database connection successful");
        client.release();
    } catch (error) {
        console.log("Unable to connect to the database:", error);
        process.exit(1);
    }
};

>Also Update your package json scripts

```

Start it/run it:
```bash
npm run dev
```
when you're connected then you should see:`Database connection successful` on your terminal after you run it using 'npm run dev'

### 5. Set up the frontend
Open a second terminal:
```bash
cd frontend (this means you work on frontend only and whatever you commit or push 
here will commit only changes inside frontend only not both frontend and backend then cd backend means backend work only)
npm install( or npm i)
```

Create a file called .env on frontend 
```env inside it write this:

VITE_GOOGLE_CLIENT_ID=your_google_client_id (go to https://console.cloud.google.com/ and login or sign up with your email. 
Add new project you can name it HotelApp, 
then on options go to API and services option on your left side, and choose OAuth consent screen inside it)
```

Start it/run it:
```bash
npm run dev
```


## In Google Cloud Console, add `http://localhost:5173` under >Authorized JavaScript origins< you'll see where they wrote URL you include your frontend url
and also after you hosted you'll go to edit this url and put hosted url link or Google sign-in will not work.

### 6. Make yourself an admin
New accounts are `Customer` by default. To become an admin, run this in the Neon project SQL editor: 
```sql
UPDATE users 
SET role = 'Admin' WHERE email = 'your_email@example.com';
```
Log out and log in again then youll be redirected to admin page not landing page.


## Test the API with Postman

You can test the backend without the website by using [Postman](https://www.postman.com/downloads/).

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

>BACKEND POSTMAN runs:
### 1. Register
`POST /api/auth/register`
```json
{
  "name": "Ntombi",
  "email": "ntombi@example.com",
  "password": "ntombizodwa012"
}

if you wanna register as an admin the you'll write: 
{
  "name": "Ntombi",
  "email": "ntombi@example.com",
  "password": "ntombizodwa012",
  "role": "Admin"
}

```

### 2. Login (you'll be given token and you'll have to copy it)
`POST /api/auth/login`
```json
{
  "email": "ntombi@example.com",
  "password": "ntombizodwa012"
}
```

### 3. Get all hotels
`GET /api/hotels`

you'll get all hotels no need to write anything on your body

### 4. Add a hotel (admin token needed so that login token should be on your authorization you'll select Berea token and put that login token before working on body here)
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
  "image_url": "https://example.com/hotel.jpg (you can get images url on pexels https://www.pexels.com/)"
}
```

### 5. Get the rooms of a hotel
`GET /api/hotels/1/rooms`

that 1 number is hotel_id number, e.g. if you have hotel_id 1 
and you wanna get room for it then put the number of your hotel_id.
also here there's no need to write anything on your body

### 6. Add a room (admin token needed so that login token should be on your authorization you'll select Berea token and put that login token before working on body here)
`POST /api/rooms`
```json
{
  "hotel_id": 1,
  "description": "Double room with sea view",
  "ammenities": "Free Wifi, TV, Air conditioning",
  "capacity": 2,
  "quantity": 5,
  "price": 1200,
  "image_urls": ["https://example.com/room1.jpg", "https://example.com/room2.jpg"] (also here you can get images url on pexels https://www.pexels.com/)")
}
```

### 7. Book a room (also here the token is needed)
`POST /api/bookings`
```json
{
  "room_id": 1,
  "check_in": "2026-12-20",
  "check_out": "2026-12-23",
  "guests": 2,
  "number_of_rooms": 1
}
NB: make sure check_in is before check_out

```

### 8. See your bookings (also here the token is needed)
`GET /api/bookings/my`

you'll get all bookings no need to write anything on your body

### 9. Pay for a booking (also here the token is needed)
`POST /api/bookings/1/pay`
that 1 number is booking_id number, e.g. if you have booking_id 1 .if you have booking_id :2 then instead of that 1 you can put 2.
also here there's no need to write anything on your body. The answer will contain a Paystack payment link.

### 10. Add a review (also here the token is needed)
`POST /api/hotels/1/reviews`
```json
{
  "rating": 5,
  "comment": "Clean rooms and friendly staff"
}
```

### 11. Add a hotel to favourites (also here the token is needed)
`POST /api/favourites`
```json
{
  "hotel_id": 1
}
```

### 12. Approve or cancel a reservation (admin token needed and admin token not customer token as their token are not the same)
`PATCH /api/reservations/1/status`
```json
{
  "booking_status": "Approved"
}
```
Use`"Cancelled"`to cancel.

### 13. Delete things (token is needed)
- `DELETE /api/favourites/1` removes hotel 1 from your favourites
- `DELETE /api/reviews/1` removes review 1
- `DELETE /api/hotels/1` deletes hotel 1 (admin)
- `DELETE /api/rooms/1` deletes room 1 (admin)


## How It Is Hosted

Both parts are hosted on VERCEL for me, from the same GitHub repository, as two separate projects.

>HOSTING BACKEND
- Root Directory: `backend` (when you host make sure for root directory you choose backend).
- Needs all the backend environment variables above, except `PORT` so you'll put these :
on key name write **DATABASE_URL**
then on value put  **..your neon connection string**
then press add variables after putting the value on each:

key **JWT_SECRET**
value **this-key-is-very-secret**

key **PAYSTACK_SECRET_KEY**
**value** your_paystack_secret_key (you will get your paystack key
 on your paystack go to paystack settings and 
 look for API option you will get your api_key there ,copy and come paste it here)

key **GOOGLE_CLIENT_ID**
**value** your_google_client_id (go to https://console.cloud.google.com/ and login or sign up with your email. 
Add new project you can name it HotelApp, 
then on options goi to API and services on your left side you'll see option ,go to OAuth consent screen)

key **FRONTEND_URL**=
**value** http://localhost:5173 (put this url but youll change it after you hoted your frontend and put e.g https://........vercel.app if you host using vercel)

key **EMAIL_USER**
**value** your_gmail_address

key **EMAIL_PASSWORD**
**value** your_gmail_app_password

key **ADMIN_EMAIL**=
**value** email_that_receives_payment_alerts


>HOSTING FRONTEND
- Root Directory: `frontend` .(when you host make sure for root directory you choose frontend).
- then under environment variables put `VITE_GOOGLE_CLIENT_ID` and on value you'll put your_google_client_id.then you can deploy.
- `frontend/vercel.json` sends every `/api/...`request to the backend address

After the frontend address is known, add it to:
- the backend `FRONTEND_URL` variable on Vercel (no `/` at the end), then redeploy the backend
- the Google OAuth **Authorized JavaScript origins**

## Author
Built by Me>[ntombizodwantlahla53-code](https://github.com/ntombizodwantlahla53-code)