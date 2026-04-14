## 🔼 Environment files or Env files
- .env and .env.local are environment variable files.
- They store key–value pairs (like secrets, API URLs, feature flags)that your app reads at runtime or build time.

## 🔼 Higher priority overrides lower priority
- In most modern frameworks, the priority is:
```
.env.local ✅ (highest priority)
.env

```
##  Notes:
- 🔼 Higher priority overrides lower priority
```
(1) .env.local  (highest priority)
(2) .env  (lower priority)
```
- process.env.ID => Avaibale only at server side
- process.env.SECRET_PUBLIC_ID => Available on both server & client side.
*/

