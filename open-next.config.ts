import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// No R2 incremental cache configured yet — this is a preview/test build.
// Add r2IncrementalCache here once an R2 bucket exists for ISR caching.
export default defineCloudflareConfig();
