jquery.imagemap
===============

Advanced HTML image &lt;map&gt; generator

####Usage####
```javascript
var options = {
  scale: 1,
  dot_size: 7
};

var map = $('img').imagemap(options);
map.start();
// make few clicks on image
map.finish();

map.start();
// make another few clicks
map.finish();

// remove map
map.remove_map();
```
Result:  
```html
<img src='test.png' usemap="#m1406450644460" />
<map name="m1406450644460">
  <area shape="poly" href="#" coords="175,101,180,230,259,238,294,129,218,83">
  <area shape="poly" href="#" coords="397,166,407,247,467,169,433,151,402,146">
</map>
```

####Options####
Name | Default | Description
-----|---------|------------
scale|1.0|Image scale ratio
calibrate| true|Calibrate coordinates for each point (can increase accuracy)
calibrate_threshold| 7|Threshold of calibration (px)
draw_dot|true|Draw dot with each click. User can drag it to increase accuracy
dot_size|10|Draggable dot size
dot_color|"#999"|Dot color
