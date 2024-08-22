function request(fn) {
	fetch("/" + fn, {method: 'GET'});
}

function checkPassword() {
	var enteredPassword = document.getElementById("password").value;
	enteredPassword = CryptoJS.SHA256(enteredPassword).toString();
	var correctPassword = "1912766d6ba0e50e8b1bacfb51207e83b95b7ac0cd8ce15307cdf4965e7e3f6c";
	var protectedContent = document.getElementById("protected-content");
	var passwordCheck = document.getElementById("password-check");

	if (enteredPassword === correctPassword) {
		passwordCheck.style.display = "none";
		protectedContent.style.display = "block";
		document.title = "Controllr"
		document.getElementById("favicon").setAttribute("href", "https://gist.githubusercontent.com/K1ngOfPugs/b8f6dfd5faf52b5e846e30e3bc3993b3/raw/19f28b812951d0f39918c29d5002f49d91a117d6/smirk.ico");
	} else {
		console.log("Entered: " + enteredPassword);
		console.log("Correct: " + correctPassword);
	}
}