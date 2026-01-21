export const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err.message);

  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Server error" });
};
