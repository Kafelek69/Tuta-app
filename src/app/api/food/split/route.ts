import { NextResponse } from "next/server";
import { getCurrentUserFromSession } from "@/lib/session";

type SplitBody = {
  total?: number;
  people?: number;
  serviceFeePercent?: number;
};

export async function POST(request: Request) {
  const currentUser = await getCurrentUserFromSession();
  if (!currentUser) {
    return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
  }

  const body = (await request.json()) as SplitBody;
  const total = Number(body.total || 0);
  const people = Number(body.people || 0);
  const serviceFeePercent = Number(body.serviceFeePercent || 0);

  if (!Number.isFinite(total) || total <= 0 || !Number.isFinite(people) || people < 1) {
    return NextResponse.json({ error: "Błędne dane rachunku." }, { status: 400 });
  }

  const finalTotal = total + total * (serviceFeePercent / 100);
  const perPerson = finalTotal / people;

  return NextResponse.json({
    split: {
      total: Number(finalTotal.toFixed(2)),
      perPerson: Number(perPerson.toFixed(2)),
      people,
      serviceFeePercent,
    },
  });
}
