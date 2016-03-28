2tagsearch
================
A search engine for Instagram

<a href="http://multi-hashtag-search.herokuapp.com/">Link to the app</a>

<h3>About / Why</h3>

As a shoe collector, I wanted to look at pictures of a particular shoe the Nike Flyknit Trainer.  Unfortunately on Instagram, there aren't too many pictures tagged #flyknittrainer.  I thought of a solution, which was to search for all shoes tagged #nike, however as I would soon realize, there are too many pictures to sort through.  I wanted to somehow be able to search multiple tags at once and was surprised Instagram doesn't have a feature that does this.  I thought of a solution which was to search #nike tagged pictures, and from there pick only the pictures that had the #flyknit tag.

<h3>How it works</h3>
<uo>
  <li>It firsts searches for #tag1 images.  From those images, go through all the tags until #tag2 is found and append to matched results.
  <li>Then it switches to searching for #tag2 images first instead, and then matching #tag1.  Results should have no repeats


<h3>How was it made?</h3>
<ul>
  <li><b>JQuery</b> - Event-Handling and Making Requests
  <li><b>Bootstrap</b> - Front-End
</ul>
