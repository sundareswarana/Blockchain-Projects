async function registerEmployee() {

    const employeeId =
        document.getElementById("employeeId").value;

    const employeeName =
        document.getElementById("employeeName").value;

    const designation =
        document.getElementById("designation").value;

    const salary =
        document.getElementById("salary").value;

    const location =
        document.getElementById("location").value;
    const photoFile = document.getElementById("photo").files[0];

if (!photoFile) {
    alert("Please select an employee photo.");
    return;
}

const photo = "image/" + photoFile.name;

    try {

        const tx =
       await contract.registerEmployee(

    employeeId,
    employeeName,
    designation,
    salary,
    location,
    photo

);

        alert("Transaction Submitted");

        await tx.wait();

        alert("Employee details Registered Successfully");
        clearForm();

    }
    catch(err){

        console.log(err);

        alert(err.message);

    }

}
async function searchEmployee(){

    const id =
    document.getElementById("employeeId").value;

    const employee =
    await contract.getEmployee(id);

    document.getElementById("output").innerHTML = `
<h3>Employee Details</h3>

Employee Name : ${employee[0]}<br>
Designation : ${employee[1]}<br>
Salary : ${employee[2]} LPA<br>
Location : ${employee[3]}<br><br>
Photo Path : ${employee[4]}<br>
<img src="${employee[4]}" width="120">
`;
}
function clearForm() {

    document.getElementById("employeeId").value = "";
    document.getElementById("employeeName").value = "";
    document.getElementById("designation").value = "";
    document.getElementById("salary").value = "";
    document.getElementById("location").value = "";
    document.getElementById("photo").value = "";
document.getElementById("output").innerHTML = "No employee searched.";
}
