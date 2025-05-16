import { Request, Response } from "express";

class HealthCheckController {
  async handleRequest(req: Request, res: Response): Promise<void> {
    res.status(200).json({ message: 'Application healthy' });
  }
}

export default HealthCheckController;
