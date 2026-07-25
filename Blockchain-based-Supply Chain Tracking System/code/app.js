async function registerProduct() {

    const productId =
        document.getElementById("productId").value;

    const productName =
        document.getElementById("productName").value;

    const manufacturer =
        document.getElementById("manufacturer").value;

    const location =
        document.getElementById("location").value;

    const status =
        document.getElementById("status").value;

    try {

        const tx =
        await contract.registerProduct(

            productId,
            productName,
            manufacturer,
            location,
            status

        );

        alert("Transaction Submitted");

        await tx.wait();

        alert("Product Registered Successfully");
        clearForm();

    }
    catch(err){

        console.log(err);

        alert(err.message);

    }

}
async function searchProduct(){

    const id =
    document.getElementById("productId").value;

    const product =
    await contract.getProduct(id);

    document.getElementById("output").innerHTML =

    "<b>Name:</b> " + product[0] + "<br>" +

    "<b>Manufacturer:</b> " + product[1] + "<br>" +

    "<b>Location:</b> " + product[2] + "<br>" +

    "<b>Status:</b> " + product[3];

}
function clearForm() {

    document.getElementById("productId").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("manufacturer").value = "";
    document.getElementById("location").value = "";
    document.getElementById("status").selectedIndex = 0;
document.getElementById("output").innerHTML = "No product searched.";
}
