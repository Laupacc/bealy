import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT = process.env.JWT_SECRET as string;

// Middleware to authenticate JWT token
export const authenticateJWT = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  // const token = req.headers.authorization?.split(" ")[1];
  const token = req.cookies.token;

  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT, (err: any, user: any) => {
    if (err) {
      console.log("Error verifying token:", err);
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    console.log("User authenticated:", user);
    next();
  });
};

// Middleware to refresh JWT token
export const refreshToken = (req: any, res: Response, next: NextFunction) => {
  // const token = req.headers.authorization?.split(" ")[1];
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT) as jwt.JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpire = decoded.exp! - currentTime;

    // Check if the token is about to expire in the next 10 minutes (600 seconds)
    if (timeToExpire < 600) {
      console.log("Token is about to expire, refreshing...");
      const newToken = jwt.sign({ email: decoded.email }, JWT, {
        expiresIn: "1h",
      });

      console.log("Generated new token");

      res.locals.newToken = newToken; // Store the new token temporarily
      // res.setHeader("Authorization", `Bearer ${res.locals.newToken}`);
      // Set the new token in the cookie
      setTokenInCookies(res, newToken);

      console.log("New token added to header in RefreshToken middleware");
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed in RefreshToken middleware:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Set the token in cookie
export const setTokenInCookies = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
};

export const setUserIdInCookies = (res: Response, userId: number) => {
  res.cookie("userId", userId, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
};
