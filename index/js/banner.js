class BannerSlider {
    constructor(containerId) {
        console.log('Initializing BannerSlider...');
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Banner container not found!');
            return;
        }
        
        console.log('Container found:', this.container);
        
        this.slider = this.container.querySelector('.slider');
        this.slides = this.container.querySelectorAll('.slide');
        this.prevBtn = this.container.querySelector('.slider-prev');
        this.nextBtn = this.container.querySelector('.slider-next');
        this.dotsContainer = this.container.querySelector('.slider-dots');
        
        console.log('Elements found:', {
            slider: this.slider,
            slides: this.slides,
            prevBtn: this.prevBtn,
            nextBtn: this.nextBtn,
            dotsContainer: this.dotsContainer
        });
        this.currentIndex = 0;
        this.timer = null;
        this.autoPlayDelay = 5000; // 5 seconds

        this.initDots();
        this.setupEventListeners();
        this.startAutoPlay();
        this.updateSlider();
    }

    initDots() {
        this.dots = [];
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });
        this.updateDots();
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            this.stopAutoPlay();
        });

        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
            this.startAutoPlay();
        });
    }

    handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            this.nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
            this.prevSlide();
        }
    }

    updateSlider() {
        this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateDots();
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
        this.resetAutoPlay();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlider();
        this.resetAutoPlay();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.timer = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    }

    stopAutoPlay() {
        clearInterval(this.timer);
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BannerSlider('banner-slider');
});
