//Käännökset
const kaannokset = {
    ancestry: {
        "pure-blood": "Puhdasverinen",
        "half-blood": "Puoliverinen",
        "muggleborn": "Jästisyntyinen",
        "squib": "Surkki",
        "": "Tuntematon"
    },
    house: {
        "Gryffindor": "Rohkelikko",
        "Slytherin": "Luihuinen",
        "Hufflepuff": "Puuskupuh",
        "Ravenclaw": "Korpinkynsi",
        "": "Tuntematon"
    },
    patronus: {
        "stag": "Uroshirvi",
        "otter": "Saukko",
        "Jack Russel terrier": "Jack Russelin terrieri",
        "swan": "Joutsen",
        "hare": "Jänis",
        "horse": "Hevonen",
        "tabby cat": "Kissa",
        "doe": "Naarashirvi",
        "wolf": "Susi",
        "persian cat": "Kissa",
        "weasel": "Kärppä",
        "lynx": "Ilves",
        "non-corporeal": "Aineeton",
        "": "Tuntematon"
    }
}

let hahmot = [];

//Lataa kaikki hahmot
function lataaHahmot() {

// Ajax pyynnön lähetys jQueryn avulla
$.get("https://hp-api.onrender.com/api/characters", function(tiedot) {
  hahmot = tiedot;
  taytaValikot();
});
}

lataaHahmot();

//Hae hahmon tiedot klikkaamalla nimeä
document.querySelectorAll(".valikonsisalto").forEach(valikko => {
  valikko.addEventListener("click", function (e) {
    e.preventDefault();

    if (e.target.tagName === "A") {
      const hahmonNimi = e.target.dataset.name;
      haeHahmo(hahmonNimi); 
    }
  });
});

//Hae yksittäinen hahmo ja lisää sen tiedot hahmokortille. Osa tiedoista suomennettu oman sanakirjan avulla.
    function haeHahmo(nimi) {
    const hahmo = hahmot.find(hahmo => hahmo.name === nimi);
    
      $("#hahmoKortti").html(`
      <h1>${hahmo.name}</h1>
<hr>
     <h3>Muut nimet</h3>
  <p>${hahmo.alternate_names.join(", ") || "-"}</p> 

  <h3>Syntymäaika</h3>
  <p>${hahmo.dateOfBirth || "Ei tiedossa"}</p>

<h3>Syntyperä</h3>
  <p>${kaannokset.ancestry[hahmo.ancestry]}</p>

  <h3>Tupa</h3>
  <p>${kaannokset.house[hahmo.house]}</p>

  <h3>Suojelius</h3>
  <p>${kaannokset.patronus[hahmo.patronus]}</p>

   <h3>Status</h3>
  <p>${hahmo.alive ? "Elossa" : "Kuollut"}</p> 

  <h3>Näyttelijä</h3>
  <p>${hahmo.actor}</p>

  <div class="kortti-kuva">
  ${hahmo.image ? `<img src="${hahmo.image}" alt="${hahmo.name}" class="hahmokuva">` : ""}
  </div>
`);
}

//Lisää kuvalliset hahmot oikeisiin alasvetovalikoihin
function taytaValikot() {
    const opiskelijat = hahmot.filter(h => h.hogwartsStudent && h.image);
    const opettajat = hahmot.filter(h => h.hogwartsStaff  && h.image);
    const muut = hahmot.filter(h => !h.hogwartsStudent && !h.hogwartsStaff && h.image);

    const opiskelijalista = document.querySelector("#opiskelijatLista");
    const opettajalista = document.querySelector("#opettajatLista");
    const muutlista = document.querySelector("#muutLista");

    
  opiskelijat.forEach(hahmo => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = hahmo.name;
    a.dataset.name = hahmo.name;
    opiskelijalista.appendChild(a);
  });

  opettajat.forEach(hahmo => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = hahmo.name;
    a.dataset.name = hahmo.name;
    opettajalista.appendChild(a);
  });

    muut.forEach(hahmo => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = hahmo.name;
    a.dataset.name = hahmo.name;
    muutlista.appendChild(a);
  });
}

//Etsi hakukentästä suomenkielisellä tuvan nimellä tai sen osalla.
function haeTupa(tupa) {
const tulokset = hahmot.filter(hahmo => kaannokset.house[hahmo.house] && kaannokset.house[hahmo.house].toLowerCase().includes(tupa));

 //Tyhjennä vanhat tulokset
const hakutulokset = document.querySelector("#hakuTulokset");
hakutulokset.innerHTML = "";

//Lisää virhe, jos hakusana väärin eikä tästä syystä tuota tulosta.
    if (tulokset.length === 0) {
        hakutulokset.innerHTML = "<h1 class = 'virhe'>Ei hakutuloksia</h1>";
        return;
    }

//Lisää tuvan nimi otsikoksi
    const houseName = tulokset[0].house;
    hakutulokset.innerHTML += `
        <h1>${kaannokset.house[houseName]}</h1>
        <hr>`;

//Lisää hahmot listaan. Lisää tieto onko hahmo oppilas/opettaja/muu.
  tulokset.forEach(h => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${h.name}</strong>
       ${h.hogwartsStudent ? "Oppilas" : h.hogwartsStaff ? "Opettaja" : "Muu"}<br><br>
    `;

        hakutulokset.appendChild(div);
    });
};

//Hakunappi hakee hahmot tuvan perusteella. Napin painaminen tyhjentää hakukentän.
const hakunappi = document.querySelector("form");
const hakukentta = document.querySelector("#hakukentta");
const alkuperainenPlaceholder = hakukentta.placeholder;

hakunappi.addEventListener("submit", function(e) {
    e.preventDefault();
const sana = hakukentta.value.trim().toLowerCase();

//Lisää virhe, jos tyhjä haku.
if (sana === "") {
  hakukentta.placeholder = "Yritä uudestaan";
  hakukentta.classList.add("virhe");
  return; 
}

//Suorita haku, poista virhe ja palauta hakukenttä ennalleen.
hakukentta.classList.remove("virhe");
hakukentta.placeholder = alkuperainenPlaceholder;
haeTupa(sana);
hakukentta.value ="";
});

//Palauta hakukenttä ennalleen, kun aloitetaan uusi haku.
hakukentta.addEventListener("input", function () {
    hakukentta.classList.remove("virhe");
    hakukentta.placeholder = alkuperainenPlaceholder;
});

//Liikkuvat pilvet headeriin vanta.js avulla 
window.addEventListener("load", function () {
  VANTA.CLOUDS({
    el: "#pilvet",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    skyColor: 0x151b2b,
    cloudColor: 0x4b5366,
    sunColor: 0xf0d58a,
    sunGlareColor: 0x8b5a2b,
    sunlightColor: 0xc9b37e,
    speed: 1.1
  });
});

//Navigointipalkissa vaihtuvat taikalauseet jsdelivr/typed.js avulla
  new Typed("#typed", {
    strings: [
      "Qui arcana quaerit, veritatem in umbris inveniet",
      "Per noctem obscuram, lumen magiae semper ardet",
      "In silentio noctis, antiqua arcana susurrant",
      "Magia vetus adhuc per muros huius castelli fluit"


    ],
    typeSpeed: 60,
    backSpeed: 30,
    loop: true
  });

//Kortit ilmestyvät vuorotellen näkyviin jQuery efekteillä
$(document).ready(function() {
$(".vasenkortti")
    .css({
      position: "relative",
      top: "200px",
      opacity: 0
    })
    .delay(200)
    .animate({
      top: "0px",
      opacity: 1
    }, 600);

$(".oikeakortti")
    .css({
      position: "relative",
      top: "-100px",
      opacity: 0
    })
    .delay(800)
    .animate({
      top: "0px",
      opacity: 1
    }, 600);

$(".keskimmainenkortti")
  .css({
    position: "relative",
    opacity: 0
  })
  .delay(1400)
  .animate({
    opacity: 1
  }, 800);

});

