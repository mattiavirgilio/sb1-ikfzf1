import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

export async function isAuthenticated(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

export async function hasRole(req: NextApiRequest, res: NextApiResponse, requiredRole: string) {
  const session = await getSession({ req });
  if (!session || session.user.role !== requiredRole) {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }
  return true;
}