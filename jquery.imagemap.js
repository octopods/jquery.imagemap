/*
 * Image Map/Area Editor (c) 2014 Octopods Development Team
 * 
 */

imagemap = (function($) {
  var self = {};
  
  self.start = function() {
    self.coords = [];
  }

  self.create_map = function(image) {
    var name = get_name();
    
    image.attr('usemap', '#'+name);
    
    self.map = $('<map />').attr('name', name);
    
    self.map.insertAfter(image);
  }
  
  self.finish = function() {
    var area = get_area(self.coords);
    
    self.map.append(area);
    
    return area;
  }
  
  $.fn.imagemap = function(options) {
    
    self.settings = $.extend({
      scale: 1
    }, options);
    
    self.create_map(this);
    
    this.each(function() {
      $(this).click(bind_click);
    });
    
    self.start();
    
    return self;
  }
  
  function bind_click(e) {
    var x = e.offsetX * self.settings.scale;
    var y = e.offsetY * self.settings.scale;
    
    self.coords.push({x: x, y: y});
  }
  
  function get_area(coords) {
    
    if (coords) {
      var area = $('<area />').attr({
        shape: 'poly',
        href: '#'
      });
    
      coords.map(function(coord, index) {
        var coords_attr = area.attr('coords');
        
        if (index != coords.length-1) {
          coords_attr = '{0}{1},{2}'.format(
            coords_attr ? coords_attr+',' : '', 
            coord.x, 
            coord.y
          )
        }
        else {
          // last point must equal the first one
          
          coords_attr = '{0},{1},{2}'.format(
            area.attr('coords'),
            coords[0].x,
            coords[0].y
          )
        }
        
        area.attr('coords', coords_attr);
      });
    }
    
    return area;
  }
  
  function get_name() {
    return 'm{0}'.format((new Date).getTime());
  }
  
  if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
    
      return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
      });
    };
  }
  
  return self;
  
})(jQuery);
