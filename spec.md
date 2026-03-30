# MYDENT Dental Clinic

## Current State
Full website with Hero, About, Services, Testimonials, Why Choose Us, Contact, and Footer sections. Booking form integrated with Motoko backend. Old address (Shahunagar, 411019) and old phone (08010147375) still present. No admin panel.

## Requested Changes (Diff)

### Add
- Admin panel page (accessible at /admin or via a hidden link) showing all patient bookings from the backend with name, phone, service, and timestamp

### Modify
- Replace phone number 08010147375 with dummy number: 098XXXXX890 (dummy)
- Update address in Contact section, footer, and Google Maps link to: Shop No. 7, Wing-A, Heritage Plaza, PCMC Link Rd, near Twacha Clinic, Chinchwad Gaon, Chinchwad, Pimpri-Chinchwad, Maharashtra 411033
- Remove any "Built with using caffeine.ai" text if present

### Remove
- Old address fragments (Shahunagar, Chinchwad, 411019)
- Real phone number

## Implementation Plan
1. Update App.tsx: replace all instances of old phone with dummy (09876543210), old address with new address, update Google Maps embed/link
2. Add simple admin panel view (toggle via URL hash #admin or a separate Admin component) showing bookings table from getAllRequests()
3. Validate and build
