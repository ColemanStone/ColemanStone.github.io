document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.github.com/users/ColemanStone/repos')
    .then(response => response.json())
    .then(data => {
        const repoList = document.getElementById('repo-list');
        data.forEach(repo => {
            const repoItem = document.createElement('div');
            repoItem.innerHTML = `
                <h2>${repo.name}</h2>
                <p>${repo.description || 'No description available.'}</p>
                <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                <!-- Add more links here for live versions if available -->
            `;
            repoList.appendChild(repoItem);
        });
    })
    .catch(error => console.log('Error fetching repositories:', error));
});
