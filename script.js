const submitOnClick = () => {
    const input = document.getElementById("inputCC").value;
    console.log(input);
    console.log(typeof(input));
    document.getElementById("retCC").innerHTML = harmonic(input)*input;

}

const harmonic = (n) => {
    var sum = 0;
    for (var i = 1; i <= n; i ++) {
        sum += 1/i;
    }
    return sum;
}