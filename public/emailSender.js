document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = {
        userEmail: document.getElementById('userEmail').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Send the form data to your server endpoint
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        // Check if the response is successful; if not, throw an error
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle the successful response here
        alert(data.message); // Use the server's response message
    })
    .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error);
        alert('Error sending email. Please check the console for more details.');
    });
});
