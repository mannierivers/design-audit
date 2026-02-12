export default {
  providers: [
    {
      // Make sure this is NOT hardcoded. It must use the variable.
      domain: process.env.CLERK_ISSUER_URL,
      applicationID: "convex",
    },
  ],
};