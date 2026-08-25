body = document.querySelector("body");
list = document.querySelectorAll("ul li");
home = document.querySelector(".home");
destination = document.querySelector(".destination");

links = document.querySelectorAll("a");
planet = document.querySelector(".destination div img");
pname = document.querySelector(".planetName");
desc = document.querySelector(".description");
time = document.querySelector(".time");
dist = document.querySelector(".distance");
console.log(desc);

let circles = document.querySelectorAll(".circle");
let the_crew = document.querySelectorAll(".wraper")

circles[0].onclick = () => {
  circles[0].classList.add("ActiveCircle");
  circles[1].classList.remove("ActiveCircle");
  circles[2].classList.remove("ActiveCircle");
  circles[3].classList.remove("ActiveCircle");
}

circles[1].onclick = () => {
  circles[1].classList.add("ActiveCircle");
  circles[0].classList.remove("ActiveCircle");
  circles[2].classList.remove("ActiveCircle");
  circles[3].classList.remove("ActiveCircle");

  the_crew[1].style.cssText = "display:block"
  the_crew[0].style.cssText = "transform:translatex(110%)"

  setTimeout(() => {
    the_crew[0].style.cssText = "display:none"
  the_crew[1].style.cssText = "transform:translatex(0%); display:flex"
  }, 950);
}

circles[2].onclick = () => {
  circles[2].classList.add("ActiveCircle");
  circles[1].classList.remove("ActiveCircle");
  circles[0].classList.remove("ActiveCircle");
  circles[3].classList.remove("ActiveCircle");
}

circles[3].onclick = () => {
  circles[3].classList.add("ActiveCircle");
  circles[1].classList.remove("ActiveCircle");
  circles[2].classList.remove("ActiveCircle");
  circles[0].classList.remove("ActiveCircle");
}

links[0].onclick = function () {
  links[0].classList.add("activee");
  links[1].classList.remove("activee");
  links[2].classList.remove("activee");
  links[3].classList.remove("activee");
  planet.style.cssText = "opacity:0; transform:scale(0);";
  pname.style.cssText = "opacity:0; transform:translatex(100px);";
  time.style.cssText = "opacity:0; transform:translatex(100px);";
  dist.style.cssText = "opacity:0; transform:translatex(100px);";
  desc.style.cssText = "opacity:0; ;";

  setTimeout(() => {
    planet.setAttribute(
      "src",
      "D:/space-tourism-website-main/starter-code/assets/destination/image-moon.png"
    );
    pname.innerHTML = "MOON";
    desc.innerHTML =
      "See our planet as you’ve never seen it before. A perfect relaxing trip away to help regain perspective and come back refreshed. While you’re there, take in some history by visiting the Luna 2 and Apollo 11 landing sites.";
    time.innerHTML = "3 days";
    dist.innerHTML = "384,400 km";

    planet.style.cssText = "opacity:1; transform:scale(1);";
    pname.style.cssText = "opacity:1; transform:scale(1);";
    time.style.cssText = "opacity:1; transform:scale(1);";
    dist.style.cssText = "opacity:1; transform:scale(1);";
    desc.style.cssText = "opacity:1; ;";
  }, 500);
};

links[1].onclick = function () {
  links[1].classList.add("activee");
  links[0].classList.remove("activee");
  links[2].classList.remove("activee");
  links[3].classList.remove("activee");
  planet.style.cssText = "opacity:0; transform:scale(0);";
  pname.style.cssText = "opacity:0; transform:translatex(100px);";
  time.style.cssText = "opacity:0; transform:translatex(100px);";
  dist.style.cssText = "opacity:0; transform:translatex(100px);";
  desc.style.cssText = "opacity:0; ;";

  setTimeout(() => {
    planet.setAttribute(
      "src",
      "D:/space-tourism-website-main/starter-code/assets/destination/image-mars.png"
    );
    pname.innerHTML = "MARS";
    time.innerHTML = "9 months";
    dist.innerHTML = "225 mil. km";
    desc.innerHTML =
      "Don’t forget to pack your hiking boots. You’ll need them to tackle Olympus Mons, the tallest planetary mountain in our solar system. It’s two and a half times the size of Everest!";

    planet.style.cssText = "opacity:1; transform:scale(1);";
    pname.style.cssText = "opacity:1; transform:scale(1);";
    time.style.cssText = "opacity:1; transform:scale(1);";
    dist.style.cssText = "opacity:1; transform:scale(1);";
    desc.style.cssText = "opacity:1; ;";
  }, 500);
};

links[2].onclick = function () {
  links[2].classList.add("activee");
  links[1].classList.remove("activee");
  links[0].classList.remove("activee");
  links[3].classList.remove("activee");
  planet.style.cssText = "opacity:0; transform:scale(0);";
  pname.style.cssText = "opacity:0; transform:translatex(100px);";
  time.style.cssText = "opacity:0; transform:translatex(100px);";
  dist.style.cssText = "opacity:0; transform:translatex(100px);";
  desc.style.cssText = "opacity:0; ;";

  setTimeout(() => {
    planet.setAttribute(
      "src",
      "D:/space-tourism-website-main/starter-code/assets/destination/image-europa.png"
    );
    pname.innerHTML = "EUROPA";
    time.innerHTML = "3 years";
    dist.innerHTML = "628 mil. km";
    desc.innerHTML =
      "The smallest of the four Galilean moons orbiting Jupiter, Europa is a winter lover’s dream. With an icy surface, it’s perfect for a bit of ice skating, curling, hockey, or simple relaxation in your snug wintery cabin.";

    planet.style.cssText = "opacity:1; transform:scale(1);";
    pname.style.cssText = "opacity:1; transform:scale(1);";
    time.style.cssText = "opacity:1; transform:scale(1);";
    dist.style.cssText = "opacity:1; transform:scale(1);";
    desc.style.cssText = "opacity:1; ;";
  }, 500);
};

links[3].onclick = function () {
  links[3].classList.add("activee");
  links[1].classList.remove("activee");
  links[2].classList.remove("activee");
  links[0].classList.remove("activee");
  planet.style.cssText = "opacity:0; transform:scale(0);";
  pname.style.cssText = "opacity:0; transform:translatex(100px);";
  time.style.cssText = "opacity:0; transform:translatex(100px);";
  dist.style.cssText = "opacity:0; transform:translatex(100px);";
  desc.style.cssText = "opacity:0; ;";

  setTimeout(() => {
    planet.setAttribute(
      "src",
      "D:/space-tourism-website-main/starter-code/assets/destination/image-titan.png"
    );
    pname.innerHTML = "TITAN";
    time.innerHTML = "7 years";
    dist.innerHTML = "1.6 bil. km";
    desc.innerHTML =
      "The only moon known to have a dense atmosphere other than Earth, Titan is a home away from home (just a few hundred degrees colder!). As a bonus, you get striking views of the Rings of Saturn.";

    planet.style.cssText = "opacity:1; transform:scale(1);";
    pname.style.cssText = "opacity:1; transform:scale(1);";
    time.style.cssText = "opacity:1; transform:scale(1);";
    dist.style.cssText = "opacity:1; transform:scale(1);";
    desc.style.cssText = "opacity:1; ;";
  }, 500);
};

list[0].onclick = function () {
  list[0].classList.add("active");
  list[1].classList.remove("active");
  list[2].classList.remove("active");
  list[3].classList.remove("active");
  body.style.cssText =
    "background-image: url(D:/space-tourism-website-main/starter-code/assets/home/background-home-desktop.jpg)";
  destination.style.display = "none";
  home.style.display = "flex";
};
list[1].onclick = function () {
  list[1].classList.add("active");
  list[0].classList.remove("active");
  list[2].classList.remove("active");
  list[3].classList.remove("active");
  body.style.cssText =
    "background-image: url(D:/space-tourism-website-main/starter-code/assets/destination/background-destination-desktop.jpg)";
  destination.style.display = "grid";
  home.style.display = "none";
};
list[2].onclick = function () {
  list[2].classList.add("active");
  list[1].classList.remove("active");
  list[0].classList.remove("active");
  list[3].classList.remove("active");
  body.style.cssText =
    "background-image: url(D:/space-tourism-website-main/starter-code/assets/crew/background-crew-desktop.jpg)";
};
list[3].onclick = function () {
  list[3].classList.add("active");
  list[1].classList.remove("active");
  list[2].classList.remove("active");
  list[0].classList.remove("active");
  body.style.cssText =
    "background-image: url(D:/space-tourism-website-main/starter-code/assets/technology/background-technology-desktop.jpg";
};
