// CPP
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
    if (!cpValidateInput(n, type_1, type_2, p_lst)) return;
    if (type_1) cpCalType1(n);
        
    else cpCalType2 (p_lst);
  
}

function cpValidateInput (n, type_1, type_2, p_lst) {
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

function cpCalType1 (n) {
    var sum1 = 0;
    var sum2 = 0;
    for (var i = 1; i <= n; i ++) {
        sum1 += 1/i;
        sum2 += 1/ Math.pow(i, 2);
    }
    var exp_v = sum1 * n;
    var variance = Math.pow(n, 2) * sum2 - n * sum1;
    
    // dist
    var lim = 0.001;
    var dist = [[], []];
    var p = 1/n;
    var t = 0;
    var f_t = 0;
    // optimize with recursion for a ^ x
    while ((1 - f_t) > lim) {
        dist[0].push(t);
        dist[1].push(f_t);
        t += 1;
        f_t = Math.pow(1 - Math.exp(-p*t), n);
        
    }
    console.log(dist);
 

    document.getElementById("cp_expectedV").innerHTML = exp_v;
    document.getElementById("cp_var").innerHTML = variance;
    var ctx = document.getElementById("cp_dist").getContext('2d');
    buildChart(ctx, dist);
      
}



function cpCalType2 (p_lst) {
    // get sum of p_combinations table
    var sum_p_table = combine_sum_p(p_lst);
    // console.log(sum_p_table);

    // expected value, variance
    var exp_v = 0;
    var variance = 0; 
    
    for (const opr_count of sum_p_table.keys()) {
        sums = sum_p_table.get(opr_count);
        sums.forEach(p_sum => {
            exp_v += Math.pow (-1, opr_count-1) * (1/p_sum);
                    
            variance += Math.pow (-1, opr_count-1) * (1/ Math.pow(p_sum, 2));
            return exp_v, variance;
        });
      
    }
    variance = 2*variance - Math.pow(exp_v, 2) - exp_v; 

    // dist
    var lim = 0.001;
    var dist = [[], []];
    var t = 0;
    var f_t = 0;
    while ((1 - f_t) > lim) {
        dist[0].push(t);
        dist[1].push(f_t);
        t += 1;
        f_t = 1;
        for (var i = 0; i < p_lst.length; i++) {
            var p = p_lst[i];
            f_t *= 1 - Math.exp(-p*t);
        }
    }

    // show result
    document.getElementById("cp_expectedV").innerHTML = exp_v;
    document.getElementById("cp_var").innerHTML = variance;
    var ctx = document.getElementById("cp_dist").getContext('2d');
    buildChart(ctx, dist);
    
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

function buildChart(ctx, dist) {
    try {
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dist[0],
                datasets: [{
                    label: 'density distribution', // Name the series
                    data: dist[1], // Specify the data values array
                    fill: true,
                    borderColor: '#2196f3', // Add custom color border (Line)
                    backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
                    borderWidth: 1 // Specify bar border width
                }]
            },
            options: {
              responsive: true, // Instruct chart js to respond nicely.
              maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
            }
        });
    }
    catch (err) {
        throw ("Error");
    }
   
}

// M/M/1

const qtSubmitOnClick = () => {
    var mean_arv_time = document.getElementById("mean_arv_time").value;
    var mean_svc_time = document.getElementById("mean_svc_time").value;
    

    var type_1 = document.getElementById("qt_type_1").checked;
    var type_2 = document.getElementById("qt_type_2").checked;
    console.log(mean_arv_time);
    if (type_1) qtCalType1(mean_arv_time, mean_svc_time);
        
    else if (type_2) qtCalType2();
    else throw new Error ("select queueing system type");
}

function qtCalType1 (mean_arv_time, mean_svc_time) {
    var lambda = 1/mean_arv_time;
    var mu = 1/mean_svc_time;
    var var_arv = 1/Math.pow(lambda, 2);
    var var_svc = 1/Math.pow(mu, 2);
    var p_svr_busy = lambda/mu;
    var l_q = Math.pow(p_svr_busy, 2) / (1 - p_svr_busy);
    var w_q = l_q/lambda;
    var w = w_q + 1/mu;
    var l = lambda * w;
    var p_svr_idle = 1 - p_svr_busy;

    console.log("success");
    document.getElementById("mean_arv_rate").innerHTML = lambda;
    document.getElementById("mean_svc_rate").innerHTML = mu;
    document.getElementById("var_arv").innerHTML = var_arv;
    document.getElementById("var_svc").innerHTML = var_svc;
    document.getElementById("p_svr_busy").innerHTML = p_svr_busy;
    document.getElementById("mean_q_cust").innerHTML = l_q;
    document.getElementById("mean_q_wait").innerHTML = w_q;
    document.getElementById("mean_sys_cust").innerHTML = l;
    document.getElementById("mean_sys_wait").innerHTML = w;
    document.getElementById("p_svr_idle").innerHTML = p_svr_idle;

}
function qtCalType2() {

}
function qtValidateInput(){

}






