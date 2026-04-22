import { ContentPageShell } from "@/components/content-page-shell";

const serviceTimes = [
  "Sunday: 9:30 AM and 11:30 AM",
  "Tuesday: 6:30 PM Bible Study",
  "Saturday: 7:00 AM Prayer Gathering",
];

export default function VisitPage() {
  return (
    <ContentPageShell
      title="Plan Your Visit"
      subtitle="You Are Welcome"
      description="Whether this is your first time in church or your first time in a long time, we are ready to receive you with love."
      image="/images/hero-slide-1.jpg"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold">Service Times</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-(--stone)">
            {serviceTimes.map((time) => (
              <li key={time} className="rounded-lg bg-(--blush) px-4 py-2 font-semibold text-(--ink)">
                {time}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-(--ash) bg-white px-6 py-6">
          <h2 className="text-2xl font-bold">What To Expect</h2>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            Expect heartfelt worship, practical biblical teaching, and a supportive atmosphere where women and families
            can experience spiritual refreshment.
          </p>
          <p className="mt-3 text-sm leading-7 text-(--stone)">
            Parking volunteers and welcome team members are available to guide you from arrival to seating.
          </p>
        </article>
      </div>
    </ContentPageShell>
  );
}
