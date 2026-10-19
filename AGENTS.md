# Art Work Project & Development Protocol

## Strict Execution Rules:

1. **Server Management (CRITICAL RULE):**
   - **DO NOT** run or start the server (`npm run start`, `npm run dev`, or background daemons) automatically after implementations.
   - The **USER** is exclusively responsible for starting, stopping, and running the local server.
   - Never attempt to occupy or kill port 3000 unless explicitly commanded by the user.

2. **Scope of Implementation Verification:**
   - After every implementation or code update, the agent's responsibility strictly ends at:
     1. Running `npm run build` to verify compilation, types, and zero lint errors.
     2. Running automated component or Playwright tests.
     3. Providing a clear status summary to the user.
   - Once build & tests are verified, conclude the turn without launching the server.
