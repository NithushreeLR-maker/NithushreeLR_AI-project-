async function startDelivery() {

    const product =
        document.getElementById("product").value;

    const house =
        document.getElementById("house").value;


    document.getElementById("status").innerHTML =
        "🟡 Order received. Robot is activating...";


    const response = await fetch("/deliver", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            product: product,
            house: house

        })

    });


    const data = await response.json();


    document.getElementById("route").innerHTML =
        data.path.join(" → ");


    document.getElementById("cost").innerHTML =
        data.cost;


    const plan =
        document.getElementById("plan");

    plan.innerHTML = "";


    data.plan.forEach(action => {

        let item =
            document.createElement("li");

        item.innerText = action;

        plan.appendChild(item);

    });


    document.getElementById("status").innerHTML =
        "🤖 Robot Active - Delivery Started";


    await animateRobot(data.path);


    document.getElementById("status").innerHTML =
        "✅ Product delivered successfully to "
        + data.customer;

}



function sleep(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}



async function animateRobot(path) {

    const robot =
        document.getElementById("robot");


    for (let location of path) {

        document
        .querySelectorAll(".active-location")
        .forEach(element =>
            element.classList.remove(
                "active-location"
            )
        );


        let target =
            document.getElementById(location);


        if (target) {

            target.classList.add(
                "active-location"
            );

            target.appendChild(robot);

        }


        document.getElementById("status").innerHTML =
            "🤖 Robot moving to "
            + location;


        await sleep(1500);

    }

}