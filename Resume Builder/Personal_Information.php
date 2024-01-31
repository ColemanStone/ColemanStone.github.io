<?php
// Start the session
session_start();
?>

<!DOCTYPE html>
<html>

<body>

    <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
        Name: <input type="text" name="name">
        <br>
        <input type="submit">
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // collect value of input field
        $name = $_POST['name'];
        if (empty($name)) {
            echo "Name is empty";
        } else {
            // Save the data to the session
            $_SESSION["name"] = $name;
            echo "Name: " . $name;
        }
    }
    ?>

</body>

</html>