const express = require('express');
const router = express.Router();

// ROUTE 1:  Get all data of the coach: GET '/api/train/fetchalldata'. 
router.get('/fetchalldata', (req, res)=>{
    
    res.json([])
})

module.exports = router