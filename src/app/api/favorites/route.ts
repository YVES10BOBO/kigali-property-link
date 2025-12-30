import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch user's favorites
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ favorites: [] }, { status: 200 });
    }

    const { data: favorites, error } = await supabase
      .from("favorites")
      .select("property_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching favorites:", error);
      return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
    }

    const propertyIds = favorites?.map((f) => f.property_id) || [];
    return NextResponse.json({ favorites: propertyIds }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/favorites:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Add a favorite
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { property_id } = await request.json();

    if (!property_id) {
      return NextResponse.json({ error: "property_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, property_id })
      .select()
      .single();

    if (error) {
      // If it's a duplicate, that's okay - just return success
      if (error.code === "23505") {
        return NextResponse.json({ success: true, favorite: { property_id } }, { status: 200 });
      }
      console.error("Error adding favorite:", error);
      return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
    }

    return NextResponse.json({ success: true, favorite: data }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/favorites:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Remove a favorite
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const property_id = searchParams.get("property_id");

    if (!property_id) {
      return NextResponse.json({ error: "property_id is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("property_id", property_id);

    if (error) {
      console.error("Error removing favorite:", error);
      return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE /api/favorites:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

