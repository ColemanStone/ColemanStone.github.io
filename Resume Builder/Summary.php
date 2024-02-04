<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Summary</title>
</head>

<body>
    <form method="post" action="Summary.php">
        <h1> This is the page you would use to enter your summary information</h1>
        <label for="Summary">Summary:</label>
        <input type="text" id="Summary" name="Summary"><br><br>
        <input type="submit" value="Submit">
        <?php
        $firstName  = "";
        $lastName = "";
        $email = "";
        $phone = "";
        $address = "";
        $city = "";
        $state = "";
        $zip = "";
        $summary = "";
        $school = "";
        $degree = "";
        $major = "";
        $gradDate = "";
        $company = "";
        $jobTitle = "";
        $startDate = "";
        $endDate = "";
        $skill = "";
        $experience = "";
        $refName = "";
        $refPhoneNumber = "";
        $refEmail = "";

        if (isset($_POST['Summary'])) {
            echo "<h2>Summary: " . $_POST['Summary'] . "</h2>";
        }
        ?>
</body>

</html>