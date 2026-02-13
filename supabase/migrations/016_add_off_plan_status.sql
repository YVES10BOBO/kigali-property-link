-- Allow off-plan / project properties by extending the status check constraint

ALTER TABLE properties 
  DROP CONSTRAINT IF EXISTS properties_status_check;

ALTER TABLE properties
  ADD CONSTRAINT properties_status_check 
  CHECK (status IN (
    'pending_approval',  -- New listing awaiting admin approval
    'available',         -- Approved and available
    'off_plan',          -- Off-plan project / under development
    'reserved',          -- Reserved but not yet sold/rented
    'sold',              -- Sold (hidden from public)
    'rented',            -- Rented (hidden from public)
    'unverified',        -- Availability not confirmed (hidden)
    'rejected',          -- Rejected by admin (hidden)
    'needs_revision'     -- Needs changes before approval
  ));

