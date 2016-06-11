var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

window.onload = function()
{
	var doc = document.documentElement;

	function find(name) { return document.getElementsByClassName(name)[0]; }
	function findAll(name) { return document.getElementsByClassName(name); }
	function getScroll() { return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0); }
	function setScroll(v) { window.scrollTo(0, v); }

	var works = find("works");
	var content = find("content");
	var portfolio = find("portfolio");
	var links = findAll("link");
	var back = find("back");
	var current = null;
	var was = 0;

	// tweening
	function tween(from, to, duration, ease, callback, complete)
	{
		var start = new Date();
		var tick = function()
		{
			var percent = Math.min(1, Math.max(0, ((new Date() - start) / 1000) * (1 / duration)));
			var value = from + (to - from) * ease(percent);
			callback(value);

			if (percent < 1)
				requestAnimationFrame(tick);
			else if (complete != undefined)
				complete();
		}
		tick();
	}
	function cubeIn(t) { return t * t * t; }
	function cubeOut(t) { return 1 - cubeIn(1 - t); }
	function cubeInOut(t) { return t <= 0.5 ? cubeIn(t * 2) / 2 : cubeOut(t * 2 - 1) / 2 + 0.5; }

	// view a selected work
	function view(id)
	{
		if (works.getElementsByClassName("work-" + id).length > 0)
		{
			// setup
			was = getScroll();
			works.style.top = Math.max(0, was - content.offsetTop) + "px";
			works.style.display="block";

			if (!isMobile)
				window.location.hash = '#' + id;

			// tween
			tween(100, 0, 0.5, cubeInOut, 
				function(v)
				{
					works.style.left = v + "%";
					portfolio.style.left = (v - 100) + "%";
				}, 
				function()
				{
					portfolio.style.display = "none";
					works.style.top = "0px";
					if (getScroll() >= content.offsetTop)
						setScroll(content.offsetTop);
				}
			);
			tween(0, 1, 1, cubeInOut, function(v)
			{
				back.style.opacity = v;
				back.style.top = v * 24;
			})

			// disable previous
			if (current != null)
			{
				current.style.display = "none";
				var lastDisqus = current.getElementsByClassName("disqus")[0];
				if (lastDisqus != undefined)
				{
					lastDisqus.innerHTML = "";
					lastDisqus.setAttribute("id", "");
				}
			}

			// enable next
			{
				current = works.getElementsByClassName("work-" + id)[0];
				current.style.display = "block";

				// show postcard of the current selection
				var postcard = current.getElementsByClassName("postcard")[0];
				postcard.style.backgroundImage = 'url(' + postcard.getAttribute("data-bg") + ')';

				// show any images we should load
				var imgs = current.getElementsByTagName("img");
				for (var i = 0; i < imgs.length; i ++)
					if (imgs[i].getAttribute("data-toload") != undefined)
						imgs[i].src = imgs[i].getAttribute("data-toload");

				// disqus?
				var disqus = current.getElementsByClassName("disqus")[0];
				if (disqus != undefined)
				{
					disqus.setAttribute("id", "disqus_thread");
					var disqus_shortname = 'noelfb-portfolio';
					var disqus_identifier = disqus.getAttribute("data-disqus");
					
					if (window.DISQUS)
					{
						DISQUS.reset(
						{
							reload: true,
							config: function() 
							{
								this.page.identifier = disqus_identifier;
								this.page.url = window.location.href;
							}
						});
					}
					else
					{
						var dsq = document.createElement('script'); 
						dsq.type = 'text/javascript'; 
						dsq.async = true;
						dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
						(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
					}
				}
			}
		}
	}

	// go back to portfolio
	back.addEventListener("click", function()
	{
		if (!isMobile)
			window.location.hash = '#portfolio';
		portfolio.style.display="block";

		// reset scroll position
		if (getScroll() >= content.offsetTop)
			setScroll(was);
		works.style.top = Math.max(0, getScroll() - content.offsetTop) + "px";

		// tween
		tween(0, 100, 0.5, cubeInOut, 
			function(v)
			{
				works.style.left = v + "%";
				portfolio.style.left = (v - 100) + "%";
			}, 
			function() { works.style.display = "none"; }
		);
	});

	// add view events to each link
	for (var i = 0; i < links.length; i ++)
	{
		(function()
		{
			var link = links[i];
			var id = link.getAttribute("data-id");
			link.addEventListener("click", function() { view(id); });
		})();
	}

	// auto-view on-load if there's a # value
	var hash = window.location.hash;
	if (hash.length > 2)
		view(hash.replace('#', ''));
}