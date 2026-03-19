# Sewing Closet API (MVP)

Routes support two modes:

- `DATABASE_URL` set: queries Postgres
- no `DATABASE_URL`: uses built-in no-DB seed catalog + local file persistence for profile data

## Endpoints

- `GET /api/styles`
- `GET /api/styles/:slug`
- `GET /api/styles/:slug/measurements`
- `GET /api/styles/:slug/fabrics`
- `POST /api/profiles`
- `POST /api/profiles/:id/measurements`
- `POST /api/styles/:slug/generate-fit`

In no-DB mode, profile/measurement writes persist to `data/runtime/sewing-closet-local.json` (ignored by git).

## Example requests

Create profile:

```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"11111111-1111-1111-1111-111111111111",
    "profileName":"Primary Profile",
    "preferredUnit":"in",
    "isDefault":true
  }'
```

Save measurements:

```bash
curl -X POST http://localhost:3000/api/profiles/1/measurements \
  -H "Content-Type: application/json" \
  -d '{
    "measurements":[
      {"code":"bust_full","value":36},
      {"code":"waist_natural","value":28},
      {"code":"hip_full","value":38.5}
    ]
  }'
```

Generate fit:

```bash
curl -X POST http://localhost:3000/api/styles/wrap_dress/generate-fit \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"11111111-1111-1111-1111-111111111111",
    "profileId":1
  }'
```

