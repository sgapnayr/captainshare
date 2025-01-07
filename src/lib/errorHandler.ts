export function handleError(error: unknown) {
  console.error("Error:", error);
  return {
    message: "Internal Server Error",
    status: 500,
    ...(process.env.NODE_ENV !== "production" && { debug: error }),
  };
}
