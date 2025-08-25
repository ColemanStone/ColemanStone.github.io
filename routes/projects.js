const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/projects', async (req, res) => {
    try {
        const username = 'colemanstone'; // Replace with your GitHub username
        const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated`);

        const repos = response.data.filter(repo => !repo.fork); // Optional: Exclude forks

        res.render('projects', { repos });
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        res.render('projects', { repos: [] });
    }
});

module.exports = router;