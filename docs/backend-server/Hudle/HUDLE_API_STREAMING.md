# Hudle API Streaming Endpoints (NDJSON)

## Overview
Certain Hudle venue endpoints now support real-time streaming of results using NDJSON (newline-delimited JSON). This allows clients to receive and process data page by page as it is fetched from the Hudle API, improving responsiveness for large datasets.

---

## Streaming Endpoints
- `GET /api/hudle/venues/global` — Streams all venues for all regions, page by page.
- `GET /api/hudle/venues/region/:cityId` — Streams venues for a single region/city, page by page.

---

## Response Format
- **Content-Type:** `application/x-ndjson`
- **Each line:** A JSON object representing a page of results.

Example NDJSON line:
```json
{
  "cityId": "11",
  "regionName": "Delhi NCR",
  "page": 1,
  "venues": [ ... ],
  "summary": { ... }
}
```

---

## How to Use
- **With curl:**
  ```sh
  curl -N http://localhost:3001/api/hudle/venues/global
  ```
- **With jq for pretty-printing:**
  ```sh
  curl -N http://localhost:3001/api/hudle/venues/global | jq
  ```
- **In JavaScript:**
  Use `fetch` and process each line as it arrives for real-time UI updates.

---

## Client Notes
- Each line is a complete JSON object for a page of venues.
- Clients can process and display results incrementally as they arrive.
- Compatible with most browsers, JS clients, and command-line tools.

---

## Error Handling
- If an error occurs, a final NDJSON line will be sent:
  ```json
  { "error": "Error message here" }
  ```

---

## Benefits
- **Faster perceived performance** for large datasets.
- **Real-time updates** for web UIs and dashboards.
- **Easy integration** with tools like `jq`, browser fetch, and streaming clients.

---

## See Also
- [HUDLE_API.md](HUDLE_API.md) — Main Hudle API documentation
- [HUDLE_API_STREAMING_CHECKLIST.md](../../HUDLE_API_STREAMING_CHECKLIST.md) — Implementation plan and progress 