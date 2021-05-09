const cpType1OnClick = () => {
    const n = document.getElementById("cp_count").value;
    if (n != "") {
        document.getElementById("cp_prob").value = 1/n;
    } else {
        document.getElementById("cp_prob").value = "";
    }
  
   
}
const cpSubmitOnClick = () => { 
    var n = document.getElementById("cp_count").value;
    var type_1 = document.getElementById("type_1").checked;
    var type_2 = document.getElementById("type_2").checked;
    var p_lst = document.getElementById("cp_prob").value
                                .split("\n").filter(p => !isNaN(p))
                                .map(p => parseInt(p));
    console.log(p_lst);
    if (!validateInput(n, type_1, type_2, p_lst)) return;
    if (type_1) cal_type_1(n);
        
    else cal_type_2 (n, p_lst);
  
}

function validateInput (n, type_1, type_2, p_lst) {
    var err = document.getElementById("cp_exception").innerHTML;
    if (n == "") err += "Error: number of coupon types can't be empty <br />";

    if (!(type_1 | type_2)) err += "Error: problem type unchecked <br />";
    
    if (type_2 && p_lst.length != n) err += 
        "Error: missing/ incorrect-format coupon probability input <br />";
    
    if (type_2 && p_lst.length == n && p_lst.reduce((a, b) => a + b, 0) != 1)
        err += "Error: sum of coupon probability is not 1 <br />";

    return  n != "" && (type_1 | type_2 && p_lst.length == n);
}

function cal_type_1 (n) {
    document.getElementById("cp_expectedV").innerHTML = epv_type_1(n);
    document.getElementById("cp_var").innerHTML = var_type_1(n);
}


const epv_type_1 = (n) => {
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

function cal_type_2 (n, p_lst) {
    combine_sum_p(p_lst);
}

function combine_sum_p (p_lst) {
    let table =  new Map(); // key: length of combo, value: sum 
    for (var i = 1; i <= p_lst.length; i++){
        table.set(i, []);
    }
    combine(p_lst, table, -1, 0, 0);
    console.log(table);


}
function combine (p_lst, table, curr_idx, sum, n) {
    if (curr_idx == p_lst.length -1) return;
    for (var nxt = curr_idx +1; nxt < p_lst.length; nxt++) {
        sum += p_lst[nxt];
        table.get(n+1).push(sum);
        combine (p_lst, table, nxt, sum, n+1);
        sum -= p_lst[nxt];
    }
}


