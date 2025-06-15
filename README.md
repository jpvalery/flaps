# ✈️ FLAPS – Flexible Light Aircraft Passenger System

**FLAPS** is an open-source platform for managing and booking seats on private or light aircraft flights. Built with modern web technologies, FLAPS makes it easy to list flights, book seats, and manage reservations—all through a clean UI and powerful API.

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
  /actions			→ Server actions for the front-end
  /api            → API routes
  /components     → Reusable UI components
  /email          → react.email templates
  /fonts				→ Open fonts used
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
