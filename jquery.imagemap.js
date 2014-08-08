/*
 * Image Map/Area Editor (c) 2014 Octopods Development Team
 * 
 */

imagemap = (function($) {
  var self = {};
  
  var COORD_INDEX_KEY = 'coord-index';
  var DOT_CLASS = 'imagemap-dot';
  
  self.processing = false;
  
  self.start = function() {
    self.coords = [];
    
    self.processing = true;
  }

  self.create_map = function() {
    var name = get_name();
    
    self.image.attr('usemap', '#'+name);
    
    self.map = $('<map />').attr('name', name);
    
    self.map.insertAfter(self.image);
  }
  
  self.finish = function() {
    var area = get_area(self.coords);
    
    self.map.append(area);
    
    if (self.settings.draw_dot) {
      $('.'+DOT_CLASS).remove();
    }
    
    self.processing = false
    
    return area;
  }
  
  self.remove_map = function() {
    self.map.remove();
    self.image.unbind('click');
  }
  
  self.restore = function(areas) {
    areas.map(function(coords) {
      var area = $('<area/>').attr({
        shape: 'poly',
        href: '#',
        coords: coords,
        'data-number': self.map.find('area').length
      });
      
      self.map.append(area);
    });
  };
  
  $.fn.imagemap = function(options) {
    
    self.settings = $.extend({
      scale: 1,
      calibrate: true,
      calibrate_threshold: 7,
      draw_dot: true,
      dot_size: 10,
      dot_color: '#999'
    }, options);
    
    self.image = this;
    
    self.create_map();
    
    this.each(function() {
      $(this).click(bind_click);
    });
    
    if (self.settings.draw_dot) {
      bind_dots();
    }
    
    //self.start();
    
    return self;
  }
  
  function bind_click(e) {
    if (self.processing) {
      var x = e.offsetX * self.settings.scale;
      var y = e.offsetY * self.settings.scale;
      
      if (self.settings.draw_dot) {
        draw_dot(x, y, self.coords.length);
      }
    
      self.coords.push({x: x, y: y});
    }
  }
  
  function get_area(coords) {
    
    if (coords) {
      var area = $('<area />').attr({
        shape: 'poly',
        href: '#',
        'data-number': self.map.find('area').length
      });
    
      coords.map(function(coord, index) {
        var coords_attr = area.attr('coords');
        
        if (self.settings.calibrate && index > 0) {
          // If this element is last, compare with first one.
          // Otherwise, compare with previous element
          var compare = (index == coords.length-1) ? self.coords[0] : self.coords[index-1];
          
          var threshold = self.settings.calibrate_threshold;
          
          if (compare.x != coord.x && compare.x.is_near(coord.x, threshold)) {
            coord.x = compare.x;
          }
          
          if (compare.y != coord.y && compare.y.is_near(coord.y, threshold)) {
            coord.y = compare.y;
          }
        }
        
        coords_attr = '{0}{1},{2}'.format(
          coords_attr ? coords_attr+',' : '', 
          coord.x, 
          coord.y
        )
        
        area.attr('coords', coords_attr);
      });
    }
    
    return area;
  }
  
  function get_name() {
    return 'm{0}'.format((new Date).getTime());
  }
  
  function bind_dots() {
    self.dragging = null;
    
    self.image.parent().on('mousemove', function(e) {
      if (self.dragging) {
        var x = e.offsetX;
        var y = e.offsetY;
        
        if (x > 8 && y > 8) { // bug in Chrome
          self.dragging.css({
            left: x + 'px',
            top: y + 'px',
          });
        }
      }
    });
    
    self.image.parent().on('mousedown', '.'+DOT_CLASS, function(e) {
      self.dragging = $(e.target);
    });
    
    $(document.body).on('mouseup', function() {
      
      function calc_value(value) {
        return value*self.settings.scale + self.settings.dot_size/2;
      }
      
      if (self.dragging) {
        var x = parseInt(self.dragging.css('left'), 10);
        var y = parseInt(self.dragging.css('top'), 10);
        var coord_index = self.dragging.data(COORD_INDEX_KEY);
        
        self.coords[coord_index].x = calc_value(x);
        self.coords[coord_index].y = calc_value(y);
        
        self.dragging = null;
      }
    });
  }
  
  function draw_dot(x, y, coord_index) {
    self.image.parent().css('position', 'relative');
    
    var dot = $('<div/>').addClass(DOT_CLASS);
    
    dot.css({
      position: 'absolute',
      width: self.settings.dot_size + 'px',
      height: self.settings.dot_size + 'px',
      left: x/self.settings.scale - self.settings.dot_size/2 + 'px',
      top: y/self.settings.scale - self.settings.dot_size/2 + 'px',
      background: self.settings.dot_color,
      cursor: 'pointer',
      'border-radius': '50%'
    });
    
    dot.mouseover(function() {
      $(this).css('box-shadow', '0 0 3px rgba(100, 100, 100, 0.8)');
    }).mouseout(function() {
      $(this).css('box-shadow', '');
    });
    
    dot.data(COORD_INDEX_KEY, coord_index);
    
    dot.insertAfter(self.image);
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
  
  if (!Number.prototype.is_near) {
    Number.prototype.is_near = function(number, offset) {
      result = false;
    
      if (number - offset <= this.valueOf() && this.valueOf() <= number + offset) {
        result = true;
      }
    
      return result;
    }
  }
  
  return self;
  
})(jQuery);
