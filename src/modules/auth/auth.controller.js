const asyncHandler = require("../../utils/asyncHandler");
const authService = require("./auth.service");

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result
  });
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  res.json({
    success: true,
    message: "Login successful",
    data: result
  });
});