const loginForm=document.getElementById('login-form');
const invalidCredentials=document.getElementById('invalidCredentials');

loginForm.addEventListener("submit",async (e)=>{
    e.preventDefault();

    const email=document.getElementById('email');
    const password=document.getElementById('password');
    const emailValue=email.value;
    const passwordValue=password.value;

    const result = await fetch('/authenticate',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            emailValue,
            passwordValue
        })
    }).then((res) => res.json())

    if(result.status === 200){
        password.value="";
        console.log(result.message)
        document.location.href='/users';
    }
    else{
        if (result.status === 400) {
            email.style.borderColor='red';
            password.style.borderColor='red';
            password.value="";
            invalidCredentials.style.display="block";
            setTimeout(() => {
                invalidCredentials.style.display="none";
                email.style.borderColor='gray';
                password.style.borderColor='gray';
            }, 5000);
        }
        
    }
})

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
});