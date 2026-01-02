import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Bulk import properties from CSV/JSON
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { properties, format = 'json' } = body;

    if (!properties || !Array.isArray(properties) || properties.length === 0) {
      return NextResponse.json(
        { error: 'No properties provided' },
        { status: 400 }
      );
    }

    // Validate and transform properties
    const validatedProperties = [];
    const errors: Array<{ row: number; error: string }> = [];

    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      
      try {
        // Required fields validation
        if (!prop.title || !prop.price || !prop.location) {
          errors.push({
            row: i + 1,
            error: 'Missing required fields: title, price, or location',
          });
          continue;
        }

        // Validate price
        const price = parseFloat(prop.price);
        if (isNaN(price) || price < 0) {
          errors.push({
            row: i + 1,
            error: 'Invalid price',
          });
          continue;
        }

        // Validate price_type
        if (prop.price_type && !['rent', 'sale'].includes(prop.price_type)) {
          errors.push({
            row: i + 1,
            error: 'Invalid price_type (must be "rent" or "sale")',
          });
          continue;
        }

        // Transform property data
        const propertyData = {
          title: prop.title.trim(),
          description: prop.description?.trim() || null,
          price: price,
          price_type: prop.price_type || 'rent',
          location: prop.location.trim(),
          bedrooms: parseInt(prop.bedrooms) || 0,
          bathrooms: parseInt(prop.bathrooms) || 0,
          area: parseFloat(prop.area) || 0,
          furnished: prop.furnished === true || prop.furnished === 'true' || prop.furnished === '1',
          parking: prop.parking === true || prop.parking === 'true' || prop.parking === '1',
          security: prop.security === true || prop.security === 'true' || prop.security === '1',
          generator: prop.generator === true || prop.generator === 'true' || prop.generator === '1',
          amenities: Array.isArray(prop.amenities) 
            ? prop.amenities 
            : prop.amenities 
              ? prop.amenities.split(',').map((a: string) => a.trim()).filter(Boolean)
              : [],
          images: Array.isArray(prop.images) 
            ? prop.images 
            : prop.images 
              ? prop.images.split(',').map((img: string) => img.trim()).filter(Boolean)
              : [],
          status: 'pending_approval', // All imported properties need approval
          owner_id: user.id,
        };

        validatedProperties.push(propertyData);
      } catch (error) {
        errors.push({
          row: i + 1,
          error: error instanceof Error ? error.message : 'Validation error',
        });
      }
    }

    if (validatedProperties.length === 0) {
      return NextResponse.json(
        { 
          error: 'No valid properties to import',
          errors,
        },
        { status: 400 }
      );
    }

    // Insert properties in batches (to avoid timeout)
    const batchSize = 50;
    const insertedProperties = [];
    const insertErrors: Array<{ row: number; error: string }> = [];

    for (let i = 0; i < validatedProperties.length; i += batchSize) {
      const batch = validatedProperties.slice(i, i + batchSize);
      
      const { data, error: insertError } = await supabase
        .from('properties')
        .insert(batch)
        .select();

      if (insertError) {
        // Try inserting one by one to identify which ones fail
        for (let j = 0; j < batch.length; j++) {
          try {
            const { data: singleData, error: singleError } = await supabase
              .from('properties')
              .insert(batch[j])
              .select()
              .single();

            if (singleError) {
              insertErrors.push({
                row: i + j + 1,
                error: singleError.message,
              });
            } else if (singleData) {
              insertedProperties.push(singleData);
            }
          } catch (err) {
            insertErrors.push({
              row: i + j + 1,
              error: err instanceof Error ? err.message : 'Insert error',
            });
          }
        }
      } else if (data) {
        insertedProperties.push(...data);
      }
    }

    // Send admin notification if properties were imported
    if (insertedProperties.length > 0) {
      try {
        const { sendPropertyPendingNotification } = await import('@/lib/utils/property-email');
        
        // Send notification for bulk import
        const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        if (adminEmail) {
          // Note: This is a simplified notification. You might want to send one email for the batch.
          await sendPropertyPendingNotification({
            propertyTitle: `${insertedProperties.length} properties imported`,
            propertyLocation: 'Bulk Import',
            ownerName: user.email || 'Property Owner',
            propertyId: insertedProperties[0]?.id || '',
          });
        }
      } catch (emailError) {
        console.error('Failed to send import notification:', emailError);
        // Don't fail the import if email fails
      }
    }

    return NextResponse.json({
      success: true,
      imported: insertedProperties.length,
      total: properties.length,
      errors: errors.length + insertErrors.length,
      errorDetails: [...errors, ...insertErrors],
      properties: insertedProperties,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An error occurred',
        success: false,
      },
      { status: 500 }
    );
  }
}
