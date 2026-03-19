# Sewing Closet DB Bootstrap

Run these in order against a Postgres database:

```bash
psql "$DATABASE_URL" -f db/sql/001_schema.sql
psql "$DATABASE_URL" -f db/sql/002_seed.sql
```

What this gives you:

- 10 garment categories
- 50 seeded garment styles
- measurement dictionary
- starter style-to-measurement requirements
- fabric library + style recommendations
- starter pattern variants and fit-rule placeholders

## Recommended next migration

Use your longer fit-rule SQL draft as the next migration (for richer conditional logic and generated outputs).  
The API routes in this repo are already shaped for that upgrade.

