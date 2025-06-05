# BOOKINGS_UPLOAD.md

## 📋 Overview

This guide covers the complete workflow for uploading, validating, and batch processing booking files using the Supabase-based backend. It includes API documentation, step-by-step instructions, troubleshooting, and best practices for both local development and Heroku production.

---

## 🏗️ Architecture

- **Storage:** Supabase Storage (cloud, shared)
- **Database:** Supabase PostgreSQL
- **Processing:** In-memory (buffer-based)
- **API:** RESTful endpoints (see below)
- **No local file paths or Postgres pool**—all operations use Supabase Storage and API.

---

## 🛠️ Prerequisites & Setup

### Local Development
- Node.js installed
- Project cloned, dependencies installed (`npm install`)
- `.env` file with Supabase credentials:
  ```
  SUPABASE_URL=your_supabase_project_url
  SUPABASE_ANON_KEY=your_supabase_anon_key
  ```
- Start server:
  ```bash
  npm start
  ```

### Heroku Production
- Heroku app deployed
- Supabase credentials set as config vars

---

## 📁 File Requirements

- **Formats:** `.xlsx`, `.xls`, `.csv`
- **Required Columns:**  
  (See full list in API docs, e.g. Name, City, Venue, Venue ID, Date of Booking, Slot Details, Booking Reference Id, Phone, Email, ... Hudle QR)
- **Tip:** Use the provided template or check the API for the latest required columns.

---

## 🔌 API Endpoints

### 1. Upload Booking File
- **POST** `/api/bookings/uploadFile`
- **Body:** `multipart/form-data` with `file`
- **Response:**
  ```json
  { "success": true, "fileName": "...", "originalName": "...", "fileUrl": "...", "filePath": "..." }
  ```

### 2. List Booking Files
- **GET** `/api/bookings/files`
- **Response:** `{ "success": true, "files": [ ... ] }`

### 3. Get File Download URL
- **GET** `/api/bookings/files/:fileName/url`
- **Response:** `{ "success": true, "url": "..." }`

### 4. Delete Booking File
- **DELETE** `/api/bookings/files/:fileName`
- **Response:** `{ "success": true, "message": "..." }`

### 5. Analyze Booking File
- **POST** `/api/bookings/analyze`
- **Body:** `{ "fileName": "..." }`
- **Response:** `{ "success": true, "rowCount": 123, "data": [ ... ] }`

### 6. Batch Process Booking Files
- **POST** `/api/bookings/process`
- **Body:**  
  - To process specific files: `{ "fileNames": ["file1.xlsx", "file2.xlsx"] }`
  - To process **all** files: `{}` (leave `fileNames` empty or omit)
- **Response:** Summary and details for each file.

---

## 🚦 Step-by-Step Workflow

### 1. Prepare Files
- Ensure correct format and columns.

### 2. Upload Files
- Use Postman or:
  ```bash
  curl -X POST http://localhost:3001/api/bookings/uploadFile -F "file=@/path/to/file.xlsx"
  ```

### 3. List Files
  ```bash
  curl http://localhost:3001/api/bookings/files
  ```

### 4. (Optional) Analyze a File
  ```bash
  curl -X POST http://localhost:3001/api/bookings/analyze -H "Content-Type: application/json" -d '{"fileName": "yourfile.xlsx"}'
  ```

### 5. Batch Process Files
- **All files:**
  ```bash
  curl -X POST http://localhost:3001/api/bookings/process -H "Content-Type: application/json" -d '{}'
  ```
- **Specific files:**
  ```bash
  curl -X POST http://localhost:3001/api/bookings/process -H "Content-Type: application/json" -d '{"fileNames":["file1.xlsx","file2.xlsx"]}'
  ```

### 6. (Optional) Download or Delete a File
- Download:
  ```bash
  curl http://localhost:3001/api/bookings/files/yourfile.xlsx/url
  ```
- Delete:
  ```bash
  curl -X DELETE http://localhost:3001/api/bookings/files/yourfile.xlsx
  ```

---

## 🛡️ Troubleshooting & Tips

- **"No file uploaded":** Check your form-data key is `file`.
- **"Only Excel and CSV files are allowed":** Check file extension.
- **"Missing required columns":** Check your file headers.
- **"Upload failed":** Check Supabase credentials and bucket permissions.
- **"pool is not defined":** You are using an old version—update to use Supabase client only.
- **"Invalid file structure":** File is missing required columns.
- **"No files found":** No files in bucket or wrong bucket/project.

---

## 📝 Testing Checklist

- [ ] Server running and credentials set
- [ ] Files in correct format and columns
- [ ] Upload, list, analyze, and batch process tested
- [ ] Data appears in Supabase database

---

## 🏁 Example Local & Heroku Workflows

### Local
```bash
npm start
curl -X POST http://localhost:3001/api/bookings/uploadFile -F "file=@/path/to/file.xlsx"
curl http://localhost:3001/api/bookings/files
curl -X POST http://localhost:3001/api/bookings/process -H "Content-Type: application/json" -d '{}'
```

### Heroku
```bash
curl -X POST https://www.partner.claygrounds.com/api/bookings/uploadFile -F "file=@/path/to/file.xlsx"
curl https://www.partner.claygrounds.com/api/bookings/files
curl -X POST https://www.partner.claygrounds.com/api/bookings/process -H "Content-Type: application/json" -d '{}'
```

---

## 📚 Glossary & Best Practices

- **Supabase Storage key:** The file name in Supabase Storage (e.g., `booking-12345.xlsx`)
- **Buffer-based processing:** All file validation and analysis is performed in-memory using file buffers.
- **No local file paths:** All operations use Supabase Storage, not local disk.
- **Batch process all:** Omit `fileNames` to process all files in the bucket.
- **Required columns:** Always check the latest API docs for required columns.

---

_Last updated: June 2025_ 