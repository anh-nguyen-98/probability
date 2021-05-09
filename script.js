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
                        .split("\n")
                        .map(p => parseFloat(p))
                        .filter(p => !isNaN(p) && p > 0 && p <= 1);
    console.log(p_lst);
    if (!validateInput(n, type_1, type_2, p_lst)) return;
    if (type_1) cal_type_1(n);
        
    else cal_type_2 (p_lst);
  
}

function validateInput (n, type_1, type_2, p_lst) {
    if (n == "") 
        document.getElementById("cp_exception").innerHTML += "Error: number of coupon types can't be empty <br />";

    if (!(type_1 | type_2)) 
        document.getElementById("cp_exception").innerHTML += "Error: problem type unchecked <br />";
    
    if (type_2 && p_lst.length != n) 
        document.getElementById("cp_exception").innerHTML += "Error: missing/ incorrect-format coupon probability input <br />";
    
    if (type_2 && p_lst.reduce((a, b) => a + b, 0) != 1)
        document.getElementById("cp_exception").innerHTML += "Error: sum of coupon probability is not 1 <br />";

    return  n != "" && (type_1 | (type_2 && p_lst.length == n
                                    && p_lst.reduce((a, b) => a + b, 0) == 1));
}

function cal_type_1 (n) {
    var sum1 = 0;
    var sum2 = 0;
    for (var i = 1; i <= n; i ++) {
        sum1 += 1/i;
        sum2 += 1/ Math.pow(i, 2);
    }
    var exp_v = sum1 * n;
    var variance = Math.pow(n, 2) * sum2 - n * sum1;
    document.getElementById("cp_expectedV").innerHTML = exp_v;
    document.getElementById("cp_var").innerHTML = variance;
}



function cal_type_2 (p_lst) {
    // get sum of p_combinations table
    var sum_p_table = combine_sum_p(p_lst);
    console.log(sum_p_table);

    // expected value, variance
    var exp_v = 0;
    var variance = 0; 
    
    for (const opr_count of sum_p_table.keys()) {
        sums = sum_p_table.get(opr_count);
        sums.forEach(p_sum => {
            exp_v += Math.pow (-1, opr_count-1) * (1/p_sum);
                    
            variance += Math.pow (-1, opr_count-1) * (1/ Math.pow(p_sum, 2));
            console.log(exp_v);
            console.log("var");
            console.log(variance);
            return exp_v, variance;
        });
      
    }
    variance = variance - Math.pow(exp_v, 2) - exp_v; 

    // show result
    document.getElementById("cp_expectedV").innerHTML = exp_v;
    document.getElementById("cp_var").innerHTML = variance;
    
}



function combine_sum_p (p_lst) {
    let table =  new Map(); // key: number of operands, value: sum of combin. of operands 
    for (var i = 1; i <= p_lst.length; i++){
        table.set(i, []);
    }
    combine(p_lst, table, -1, 0, 0);
    return table;


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


