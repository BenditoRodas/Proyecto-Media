const modelos = {

HP: [

"HP 14",
"HP 15",
"HP Pavilion 14",
"HP Pavilion 15",
"HP Victus 15",
"HP Victus 16",
"HP ProBook 440",
"HP ProBook 450"

],

Lenovo: [

"IdeaPad 1",
"IdeaPad 3",
"IdeaPad 5",
"ThinkBook 14",
"ThinkBook 15",
"ThinkPad E14",
"ThinkPad E15",
"Legion 5"

]

};
const marca=document.getElementById("marca");

const familia=document.getElementById("familia");

marca.addEventListener("change",function(){

familia.innerHTML="";

let opcion=document.createElement("option");

opcion.text="Seleccione una familia";

opcion.value="";

familia.appendChild(opcion);

modelos[marca.value].forEach(function(item){

let nueva=document.createElement("option");

nueva.text=item;

nueva.value=item;

familia.appendChild(nueva);

});

});
const boton=document.getElementById("buscar");

boton.addEventListener("click",function(){

const modelo=document.getElementById("modelo").value;

const resultado=document.getElementById("resultado");

if(marca.value=="" || familia.value=="" || modelo==""){

resultado.innerHTML="<h3>⚠ Complete todos los campos.</h3>";

return;

}

resultado.innerHTML=`

<h3>Equipo encontrado</h3>

<p><b>Marca:</b> ${marca.value}</p>

<p><b>Familia:</b> ${familia.value}</p>

<p><b>Modelo:</b> ${modelo}</p>

<br>

<p>✔ Listo para buscar los drivers.</p>

`;

});