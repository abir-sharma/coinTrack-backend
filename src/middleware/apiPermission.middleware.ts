// src/middleware/apiPermission.middleware.ts
export const requireApiPermission = (permission: string) => {
  return (req: any, res: any, next: any) => {
    const apiClient = req.apiClient;

    if (!apiClient.permissions.includes(permission)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};
