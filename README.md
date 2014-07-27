jquery.imagemap
===============

HTML image &lt;map&gt; generator

####Usage####
```javascript
var map = $('img').imagemap({scale: 1});
map.start();
// make few clicks on image
map.finish();

map.start();
// make another few clicks
map.finish();
```
Result:  
```html
<map name="m1406450644460">
  <area shape="poly" href="#" coords="175,101,180,230,259,238,294,129,218,83">
  <area shape="poly" href="#" coords="397,166,407,247,467,169,433,151,402,146">
</map>
```
