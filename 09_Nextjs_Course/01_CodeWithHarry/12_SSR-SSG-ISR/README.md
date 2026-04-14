## SSR - Server Side Rendering
This is default behaviour

## SSG - Static Site Generation
Any content which does not have network calls is a static page by default

## ISG or ISR - Incremental-Static Regeneration
fetch in next.js caches the response.
To opt out use:
```
export const dynamic = 'force-dynamic';
```
However, there are exception, fetch requests are not cached
When:
-  Used inside a Server Action.
-  Used inside a Route Handler that uses the POST method.
