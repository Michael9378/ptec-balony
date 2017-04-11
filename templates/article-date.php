<time class="updated" datetime="<?php echo get_the_time('c'); ?>"><?php echo get_the_date('M'); ?><br><span><?php echo get_the_date('d'); ?></span></time>
<div class="comment-add">
	<a href="<?php comments_link(); ?>"><?php comments_number('0', '1', '%'); ?></a>
</div>