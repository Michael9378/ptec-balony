<footer class="content-info" role="contentinfo">
  <div id="upperFooter">
  	<div class="container">
  		<div class="row">
    		<?php dynamic_sidebar('sidebar-footer'); ?>
    	</div>
    </div>
  </div>
  <div id="lowerFooter">
  	<div class="container">
      <div class="row">
        <div class="col-md-5">
          <?php wp_nav_menu( array('menu' => 'Footer Menu', 'menu_class' => 'list-inline footer-nav' )); ?>
        </div>
        <div class="col-md-2">
      		<span class="copyright">&copy;2015 Pebble Technology International</span><br>
      		<span class="800-phone">800.937.5058</span>
      		<span class="fax">Fax 480.948.9808</span>
        </div>
        <div class="col-md-5">
       		<span><em>All rights reserved. Reproduction in whole or in part without permission is strictly prohibited</em></span>
        </div>
      </div>
  	</div>
  </div>
</footer>
