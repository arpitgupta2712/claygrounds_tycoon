# Storage Configuration

Last Updated: 2025-06-02T15:24:42.237Z

## Required Buckets

The following storage buckets need to be created in Supabase:

1. `documents`
   - Purpose: Store booking-related documents
   - Access: Public read, authenticated write
   - Structure: /bookings/{booking_id}/*

2. `media`
   - Purpose: Store location images and media files
   - Access: Public read, authenticated write
   - Structure: /locations/{location_id}/*

3. `user-uploads`
   - Purpose: Store user-uploaded content
   - Access: Authenticated read/write
   - Structure: /users/{user_id}/*

## Bucket Setup Instructions

1. Go to Supabase Dashboard > Storage
2. Create each bucket with the following settings:
   - Public bucket: false
   - File size limit: 50MB
   - Allowed mime types: image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document

## Access Control

Currently, RLS is disabled for development. When implementing authentication:

1. Create RLS policies for each bucket
2. Implement proper access control based on user roles
3. Set up appropriate CORS policies
