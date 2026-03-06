import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

function mapUnits(row: any) {
  if (!row) return row;
  const { property_units, ...rest } = row;
  return {
    ...rest,
    units: property_units || [],
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('properties')
      .select('*, property_units(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(mapUnits(data));
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();
    
    // Extract units if provided
    const { units, ...propertyData } = body;
    
    // Update property
    const { data, error } = await supabase
      .from('properties')
      .update(propertyData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    // Handle units update if provided
    if (units !== undefined) {
      // Delete existing units
      await supabase
        .from('property_units')
        .delete()
        .eq('property_id', id);
      
      // Insert new units if provided
      if (Array.isArray(units) && units.length > 0) {
        // Get property currency for inheritance
        const { data: propertyData } = await supabase
          .from('properties')
          .select('currency')
          .eq('id', id)
          .single();
        
        const unitsToInsert = units.map((unit: any) => ({
          ...unit,
          property_id: id,
          // Inherit currency from property if not specified in unit
          currency: unit.currency || propertyData?.currency || 'RWF',
        }));
        
        const { error: unitsError } = await supabase
          .from('property_units')
          .insert(unitsToInsert);
        
        if (unitsError) {
          console.error('Error updating units:', unitsError);
          // Don't fail the request, but log the error
        }
      }
    }
    
    // Fetch property with units
    const { data: propertyWithUnits } = await supabase
      .from('properties')
      .select('*, property_units(*)')
      .eq('id', id)
      .single();
    
    return NextResponse.json(mapUnits(propertyWithUnits || data));
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
