// ================================
// Muhamed Suliman Portfolio
// script.js
// ================================

// -------------------------------
// Dark / Light Theme
// -------------------------------

const themeToggle = document.querySelector(".theme-toggle");

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {

        localStorage.setItem("theme", "light");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "dark");
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';

    }

});

// -------------------------------
// Sticky Navbar Shadow
// -------------------------------

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,.25)";

    } else {

        navbar.style.boxShadow = "none";

    }

});

// -------------------------------
// Scroll Reveal Animation
// -------------------------------

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: .15

});

document.querySelectorAll("section").forEach(section => {

    section.classList.add("fade");

    observer.observe(section);

});

// -------------------------------
// Active Navigation
// -------------------------------

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (pageYOffset >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

// -------------------------------
// Smooth Scroll
// -------------------------------

navLinks.forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({

            behavior: "smooth"

        });

    });

});

// -------------------------------
// Typing Animation
// -------------------------------

const titles = [

    "Data Engineer",

    "Microsoft Fabric Engineer",

    "ETL Developer",

    "SQL Developer",

    "Informatica Developer"

];

const typingElement = document.querySelector(".hero h2");

let titleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {

    const currentTitle = titles[titleIndex];

    if (!deleting) {

        typingElement.textContent = currentTitle.substring(0, charIndex++);

        if (charIndex > currentTitle.length) {

            deleting = true;

            setTimeout(typeEffect, 1500);

            return;

        }

    } else {

        typingElement.textContent = currentTitle.substring(0, charIndex--);

        if (charIndex < 0) {

            deleting = false;

            titleIndex++;

            if (titleIndex >= titles.length) {

                titleIndex = 0;

            }

        }

    }

    setTimeout(typeEffect, deleting ? 40 : 90);

}

typeEffect();

// -------------------------------
// Back To Top Button
// -------------------------------

const topButton = document.createElement("button");

topButton.innerHTML = "↑";

topButton.className = "top-btn";

document.body.appendChild(topButton);

topButton.style.position = "fixed";
topButton.style.right = "25px";
topButton.style.bottom = "25px";
topButton.style.width = "50px";
topButton.style.height = "50px";
topButton.style.border = "none";
topButton.style.borderRadius = "50%";
topButton.style.cursor = "pointer";
topButton.style.display = "none";
topButton.style.fontSize = "20px";
topButton.style.background = "#2563EB";
topButton.style.color = "white";
topButton.style.boxShadow = "0 10px 30px rgba(0,0,0,.3)";
topButton.style.zIndex = "999";

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        topButton.style.display = "block";

    } else {

        topButton.style.display = "none";

    }

});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

// -------------------------------
// Footer Year
// -------------------------------

const footer = document.querySelector("footer p");

if (footer) {

    footer.innerHTML =

        `© ${new Date().getFullYear()} Muhamed Suliman | Built with HTML, CSS & JavaScript`;

}

console.log("Portfolio Loaded Successfully 🚀");
