<img align="left" width="150" height="150" src="https://github.com/user-attachments/assets/001425ee-d5f2-4adc-82cf-83ffff5ab9bf">

# ✈️ FLAPS – Flexible Light Aircraft Passenger System

**FLAPS** is an open-source platform for managing and booking seats on private or light aircraft flights. Built with modern web technologies, FLAPS makes it easy to list flights, book seats, and manage reservations—all through a clean UI and powerful API.

![Split Flaps GIF](https://github.com/user-attachments/assets/2c5b6d4d-c4a1-480b-8fb1-d61c587b7a2e)


---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15 (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **Emails**: [Resend](https://resend.com)
- **Hosting**: Easily deployable to Vercel

---

## 📦 Features

### 🛩️ Flight Management
- Create new flights with route, date/time, aircraft type, and seat availability
- View a list of upcoming flights
- Cancel flights (cascade cancel all bookings)

### 👥 Passenger Booking
- Book available seats on upcoming flights
- Cancel individual bookings
- Real-time seat availability updates

### 🔌 API Endpoints
RESTful API routes available under `/api`:

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| POST   | `/api/booking/cancel/:id`  | Cancel a single booking     |
| POST   | `/api/booking/confirm/:id` | Confirm a single booking    |
| POST   | `/api/booking/create`      | Create a booking            |
| GET    | `/api/booking/get/:id`     | Fetch details for a booking |
| DELETE | `/api/flight/:id`          | Delete (cancel) a flight    |
| POST   | `/api/flight`              | Create a new flight         |
| GET    | `/api/flights`             | Get all available flights   |


---

## 🧑‍💻 Getting Started

1. **Clone the repo:**

   ```bash
   git clone https://github.com/jpvalery/flaps.git
   cd flaps
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure environment:**

   Duplicate the `env.example` file and add the required variables:

4. **Generate and apply database schema:**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
	npx prisma db push
   ```

5. **Run the dev server:**

   ```bash
   pnpm dev
   ```

6. **Visit**: [http://localhost:3000](http://localhost:3000)

---

## 🧱 Project Structure

```
/app
  /action         → Server actions for the front-end
  /api            → API routes
  /components     → Reusable UI components
  /email          → react.email templates
  /fonts	  → Open fonts used
  /lib            → Prisma, utilities, helper functions
  /prisma         → Schema + generated client
  /public         → Public folder
```

---

## 🤝 Contributing

PRs and issues welcome! Whether you're a pilot, designer, or developer—help us improve FLAPS for the community.

---

## 📝 License

MIT — free for personal and commercial use.

---

## ✈️ About the Name

**FLAPS** = *Flexible Light Aircraft Passenger System* — inspired by the flight control surfaces that make smooth takeoffs and landings possible.

---

## Screenshots

### UI

![Empty State](https://github.com/user-attachments/assets/32e08e0f-6c10-4573-b585-1680e81689a2)

![Flight Listed](https://github.com/user-attachments/assets/e9256e23-1e51-4587-a7fd-49061d908810)

![Flight Details Modal](https://github.com/user-attachments/assets/fa3d062b-2d8d-44bc-bdb2-11ecbf9bb028)

![Flight Booking Modal](https://github.com/user-attachments/assets/704bc27e-4121-4f0a-8c03-c3d062d3bb02)

![Booking Reservation Success Modal](https://github.com/user-attachments/assets/23794972-70f9-4864-bde5-f12ca7b24403)

![Booking Confirmation](https://github.com/user-attachments/assets/55f36191-b7e8-4a06-bdb3-fab866d1d0b5)

![Booking Confirmation Success](https://github.com/user-attachments/assets/2504f978-7567-41d0-bd94-3221fde82147)

![Booking Page](https://github.com/user-attachments/assets/d25e7a5a-3214-4ced-b247-2ec8b5916cb1)

![Booking Cancellation Success](https://github.com/user-attachments/assets/9b881093-ac4a-48b9-b4e0-d3d5ca8830e4)

### Emails

![Flight Creation Notification](https://github.com/user-attachments/assets/44247fb7-4ff3-418f-914e-cb8b39e799e8)

![Reservation Confirmation](https://github.com/user-attachments/assets/3d2f465f-0b84-4bbe-9eef-7e01f362dd03)

![Confirmation Email](https://github.com/user-attachments/assets/f0f7ee98-9b39-4871-a3b1-c1ef7ef566db)

![Cancellation Email](https://github.com/user-attachments/assets/e0b0cb73-0f2f-44a8-9688-4f4ffefd62d6)

