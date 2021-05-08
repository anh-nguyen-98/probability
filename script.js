const submitOnClick = () => {
    const input = document.getElementById("coupon_input").value;
    console.log(input);
    document.getElementById("coupon_ret").innerHTML = harmonic(input)*input;

}

const harmonic = (n) => {
    var sum = 0;
    for (var i = 1; i <= n; i ++) {
        sum += 1/i;
    }
    return sum;
}