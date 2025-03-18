const express = require('express');
const router = express.Router();
const { getSessionRecommendations, bookRecommendedSession } = require('../services/recommendationService');

/**
 * @route   GET /api/recommendations
 * @desc    Get AI-powered schedule recommendations
 * @access  Private
 */
router.get('/', async (req, res) => {
    try {
        const {
            date,
            instrument_id,
            program_id,
            student_id
        } = req.query;

        if (!date) {
            return res.status(400).json({ 
                success: false, 
                error: 'Session date is required' 
            });
        }

        if (!instrument_id && !program_id) {
            return res.status(400).json({ 
                success: false, 
                error: 'Either instrument_id or program_id is required' 
            });
        }

        const sessionRequest = {
            session_date: date,
            instrument_id,
            program_id,
            student_id
        };

        const recommendations = await getSessionRecommendations(sessionRequest);
        
        if (!recommendations.success) {
            return res.status(404).json(recommendations);
        }

        return res.json(recommendations);
    } catch (error) {
        console.error('❌ Error in recommendation route:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Server error generating recommendations' 
        });
    }
});

/**
 * @route   POST /api/recommendations/book
 * @desc    Book a session based on a recommendation
 * @access  Private
 */
router.post('/book', async (req, res) => {
    try {
        const {
            recommendation,
            student_id,
            session_number
        } = req.body;

        if (!recommendation || !student_id) {
            return res.status(400).json({ 
                success: false, 
                error: 'Recommendation and student_id are required' 
            });
        }

        const sessionDetails = {
            student_id,
            session_number
        };

        const result = await bookRecommendedSession(recommendation, sessionDetails);
        
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error('❌ Error in booking route:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Server error booking the session' 
        });
    }
});

module.exports = router;