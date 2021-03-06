/*
 * Third party
 */
@@include('../../node_modules/jquery/dist/jquery.js')

/*
 * Frontend WebApp
 */
(function($) {
	function WebApp(){
		this.appname = "WebApp";
		this.version = "1.0.0";
		this.author = "ShineKami";
	}
  
  //Init example function
  WebApp.prototype.example = function(){
    console.log("Webapp work!");
  }
  
	//Init all functional
	WebApp.prototype.init = function(){
		if(!$('body').hasClass('webapp-init')){
			this.example();

			$('body').addClass('webapp-init');
		}
	}

	//Global fronted application
	window.app = new WebApp;
})(jQuery);

jQuery(document).ready(function(){
	app.init();
}).ajaxComplete(function(){
	app.init();
})
