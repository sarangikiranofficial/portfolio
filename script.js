document.addEventListener('DOMContentLoaded', () => {
    // 5. FILTERABLE PROJECT GALLERY WITH COUNT Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const visibleCountEl = document.getElementById('visible-count');

    // Store references to any active transition timeouts to prevent collisions on rapid clicks
    const timeouts = new Map();

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active status from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Set current button to active
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            filterProjects(filterValue);
        });
    }); 




    fetch("projects.json")
  .then(response => response.json())
  .then(projects => {
    const container = document.getElementById("github-projects-grid");

    if (!container) {
      console.error("github-projects-grid not found");
      return;
    }

    projects.forEach(project => {
      const card = document.createElement("div");

      card.className = "project-card";
      card.setAttribute("data-category", "github");

      card.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description || "No description"}</p>
        <p>${project.language || "N/A"}</p>
        <a href="${project.url}" target="_blank">
          View Repository
        </a>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => console.error(error));

    function filterProjects(filterValue) {
        let visibleCount = 0;

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const matches = filterValue === 'all' || category === filterValue;

            // Clear any pending timeouts for this specific card
            if (timeouts.has(card)) {
                clearTimeout(timeouts.get(card));
                timeouts.delete(card);
            }

            if (matches) {
                visibleCount++;
                
                // If the card is currently hidden, restore layout display and trigger fade-in
                if (card.classList.contains('card-hidden')) {
                    card.classList.remove('card-hidden');
                    card.classList.add('card-fading');
                    
                    // Force a browser reflow/repaint to apply initial opacity/scale state
                    void card.offsetWidth;
                    
                    // Trigger the smooth scale/fade-in transition
                    card.classList.remove('card-fading');
                } else if (card.classList.contains('card-fading')) {
                    // If it was in the middle of fading out, reverse it
                    card.classList.remove('card-fading');
                }
            } else {
                // If it is currently visible and not already marked as hidden/fading out
                if (!card.classList.contains('card-hidden') && !card.classList.contains('card-fading')) {
                    card.classList.add('card-fading');
                    
                    // Setup transition end handler to display none only after the scale/fade finishes
                    const transitionTimeout = setTimeout(() => {
                        if (card.classList.contains('card-fading')) {
                            card.classList.add('card-hidden');
                            card.classList.remove('card-fading');
                        }
                        timeouts.delete(card);
                    }, 350); // Matches the 0.35s ease transition duration in styles.css

                    timeouts.set(card, transitionTimeout);
                }
            }
        });

        // Update the project counter in real time
        if (visibleCountEl) {
            visibleCountEl.textContent = visibleCount;
        }
    }

    // Scroll animation hook for nav links
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, footer');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 120)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Blog "Read More" click handler to toggle excerpt expansion without jumping
    const readMoreLinks = document.querySelectorAll('.blog-read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const excerpt = link.previousElementSibling;
            if (excerpt && excerpt.classList.contains('blog-card-excerpt')) {
                excerpt.classList.toggle('expanded');
                if (excerpt.classList.contains('expanded')) {
                    link.innerHTML = 'Read Less <i class="fa-solid fa-arrow-up-long"></i>';
                } else {
                    link.innerHTML = 'Read More <i class="fa-solid fa-arrow-right-long"></i>';
                }
            }
        });
    });
});
