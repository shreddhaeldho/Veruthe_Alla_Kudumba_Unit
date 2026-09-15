import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { event_id } = await req.json();
    if (!event_id) {
      return NextResponse.json({ error: "Missing event_id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("saved_events")
      .upsert({ user_id: user.id, event_id }, { onConflict: "user_id,event_id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, saved: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { event_id } = await req.json();
    if (!event_id) {
      return NextResponse.json({ error: "Missing event_id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("saved_events")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", event_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, saved: false });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
