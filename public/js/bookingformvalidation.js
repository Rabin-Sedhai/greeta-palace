document.addEventListener('DOMContentLoaded', () => {
	// Preloader
	const loader = document.getElementById("preloader");
	window.addEventListener("load", () => {
		loader.style.display = 'none';
	});
});
var app = {

	settings: {
		booking: $('.booking'),
		content: $('.content'),
		description: $('.description'),
		slider: $('.slider')
	},

	init: function() {
		instance = this;
		settings = this.settings;

		settings.booking.hide();
		this.bindUIActions();
	},

	swap: function(start, end, currentView, desiredView) {
		settings.slider.css('width', start);
		settings.content.css('width', end);

		currentView.fadeOut(200);
		
		setTimeout(function(){
			desiredView.fadeIn(600);
		}, 100);
	},

	bindUIActions: function() {

		settings.description.find('button').on('click', function(){
			instance.swap('20%', '80%', settings.description, settings.booking);
		});

		settings.booking.find('.prevslide').on('click', function(){
			instance.swap('35%', '65%', settings.booking, settings.description);
		});

		settings.booking.find('button').on('click', function(){
			instance.swap('35%', '65%', settings.booking, settings.description);

		});

	}
}

app.init();


function priceCalc(){
    var nights = document.getElementById("night").value;
    var price = document.getElementById("price").innerText;
    var totallPrice = nights * price;
    document.getElementById("final-price").textContent = totallPrice;
};

document.getElementById("night").addEventListener("input",priceCalc);
