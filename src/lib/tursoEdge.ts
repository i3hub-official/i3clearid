import { createClient } from "@libsql/client/web";

const client = createClient({
  url: "libsql://i3clearid-vercel-icfg-g1gwseeajtube2qkypnwlulr.aws-eu-west-1.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTcwMjI0MTYsImlkIjoiZjg1NDg5OTMtNGEyZi00ODNiLWE0NmEtNWYzODI0OTJjNTg1IiwicmlkIjoiNDgzNWM5M2QtMjhjMy00ODk4LWJiZjUtYjhkOWJlMmQzOWY5In0.lbPv0tu6xTCNMZnoeizVetc0LcP6mDHwlsvhkGqhMyWqlAFMxlZQiJur8VrWKiDFzD1Xf-hfk65iNhDMTz8OBQ",
});
