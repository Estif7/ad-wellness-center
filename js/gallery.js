const cards = document.querySelectorAll('.card');
const modal = document.getElementById('modal');
const modalVideo = document.getElementById('modalVideo');
const closeBtn = document.getElementById('close');

/* Masonry row span fix */
function resizeGridItem(item){
    const rowHeight = 10;
    const rowGap = 16;

    const video = item.querySelector('video');
    
    // Set default row span assuming 16:9 aspect ratio
    const defaultAspectRatio = 9 / 16; // height/width
    const defaultRowSpan = Math.ceil((defaultAspectRatio * item.offsetWidth) / (rowHeight + rowGap));
    item.style.gridRowEnd = "span " + defaultRowSpan;
    
    video.addEventListener('loadedmetadata', () => {
        const rowSpan = Math.ceil((video.videoHeight / video.videoWidth * item.offsetWidth) / (rowHeight + rowGap));
        item.style.gridRowEnd = "span " + rowSpan;
    });
    
    // If video is already loaded, trigger the calculation
    if (video.readyState >= 1) {
        const rowSpan = Math.ceil((video.videoHeight / video.videoWidth * item.offsetWidth) / (rowHeight + rowGap));
        item.style.gridRowEnd = "span " + rowSpan;
    }
}

cards.forEach(card => resizeGridItem(card));

/* Scroll animation */
const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        }
    });
},{threshold:0.2});

cards.forEach(c=>observer.observe(c));

/* Hover autoplay */
cards.forEach(card=>{
    const video = card.querySelector('video');

    card.addEventListener('mouseenter', ()=>{
        video.play();
    });

    card.addEventListener('mouseleave', ()=>{
        video.pause();
        video.currentTime = 0;
    });

    /* Open modal */
    card.addEventListener('click', ()=>{
        modal.style.display = "flex";
        modalVideo.src = video.src;
        modalVideo.play();
    });
});

/* Close modal */
closeBtn.onclick = ()=>{
    modal.style.display = "none";
    modalVideo.pause();
};

/* Close on background click */
modal.onclick = (e)=>{
    if(e.target === modal){
        modal.style.display = "none";
        modalVideo.pause();
    }
};

const gallery = document.getElementById('gallery');
const cardsArr = Array.from(document.querySelectorAll('.card'));
const dotsContainer = document.getElementById('dots');

let currentIndex = 0;

/* Create dots */
cardsArr.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
        cardsArr[i].scrollIntoView({
            behavior: 'smooth',
            inline: 'center'
        });
    });

    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

/* Update active dot on scroll */
gallery.addEventListener('scroll', () => {
    let closestIndex = 0;
    let closestDistance = Infinity;

    cardsArr.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const center = window.innerWidth / 2;
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(center - cardCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
        }
    });

    if (closestIndex !== currentIndex) {
        dots[currentIndex].classList.remove('active');
        dots[closestIndex].classList.add('active');
        currentIndex = closestIndex;
    }
});

let isScrolling;

gallery.addEventListener('scroll', () => {
    clearTimeout(isScrolling);

    isScrolling = setTimeout(() => {
        let closest = 0;
        let minDist = Infinity;

        cardsArr.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            const center = window.innerWidth / 2;
            const cardCenter = rect.left + rect.width / 2;
            const dist = Math.abs(center - cardCenter);

            if (dist < minDist) {
                minDist = dist;
                closest = i;
            }
        });

        cardsArr[closest].scrollIntoView({
            behavior: "smooth",
            inline: "center"
        });
    }, 100);
});