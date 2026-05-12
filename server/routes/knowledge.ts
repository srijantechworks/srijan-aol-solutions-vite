import { Router, Request, Response } from 'express';
import { fetchKnowledgePage } from '../services/dynamoService';

const router = Router();

// GET /api/knowledge?page=17
router.get('/', async (req: Request, res: Response) => {
    try {
        const pageQuery = req.query.page as string;
        const pageNumber = parseInt(pageQuery, 10);

        // Validation: Ensure we actually got a number
        if (isNaN(pageNumber)) {
            return res.status(400).json({
                error: "Invalid page number. Please provide a numeric value."
            });
        }

        const pageData = await fetchKnowledgePage(pageNumber);

        if (!pageData) {
            return res.status(404).json({
                error: `Page ${pageNumber} not found in the wisdom vault.`
            });
        }

        // Returns { PK, SK, text, html, ... }
        res.json(pageData);

    } catch (error) {
        console.error("Knowledge Route Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;