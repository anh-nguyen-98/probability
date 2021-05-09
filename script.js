const cpType1OnClick = () => {
    const n = document.getElementById("cp_count").value;
    if (n != "") {
        document.getElementById("cp_prob").value = 1/n;
    } else {
        document.getElementById("cp_prob").value = "";
    }
  
   
}
const cpSubmitOnClick = () => { 
    if (!validateInput()) return;
    var n = document.getElementById("cp_count").value;
    if (document.getElementById("type_1").checked) {
        document.getElementById("cp_expectedV").innerHTML = e_type_1(n);
        document.getElementById("cp_var").innerHTML = var_type_1(n);
        return;
    }



}

function validateInput () {
    var n = document.getElementById("cp_count").value;
    var type_1 = document.getElementById("type_1").checked;
    var type_2 = document.getElementById("type_2").checked;
    if (n == "") {
        document.getElementById("cp_exception").innerHTML += 
        "number of coupon types can't be empty <br />";
        
    }

    if (!(type_1 | type_2)) {
        document.getElementById("cp_exception").innerHTML += 
        "problem type unchecked <br />";
    }
    return  n != "" && (type_1 | type_2);
}

const e_type_1 = (n) => {
    return n * harmonic (n);
}

const harmonic = (n) => {
    var sum = 0;
    for (var i = 1; i <= n; i ++) {
        sum += 1/i;
    }
    return sum;
}

const var_type_1 = (n) => {
    var sum1 = 0;
    var sum2 = 0;
    for (var i = 1; i <= n; i ++) {
        sum1 += 1/ Math.pow(i, 2);
        sum2 += 1/i;
    }

    return Math.pow(n, 2) * sum1 - n * sum2;

   

}


