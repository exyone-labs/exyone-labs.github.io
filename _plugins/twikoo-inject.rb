Jekyll::Hooks.register :documents, :post_render do |document|
  inject_twikoo_comment(document)
end

def inject_twikoo_comment(document)
  return unless document.output_ext == '.html'
  
  output = document.output
  return unless output && output.include?('</body>')
  
  is_post = document.is_a?(Jekyll::Document) && 
            document.collection && 
            document.collection.label == 'posts'
  
  return unless is_post
  
  twikoo_container = <<~HTML
    
    <!-- Twikoo Comment System -->
    <div id="twikoo-section" style="max-width: 800px; margin: 0.5rem auto 2rem auto; padding: 0 1rem;">
      <div style="display: flex; justify-content: center; align-items: center; gap: 1.5rem; margin-bottom: 1rem;">
        <span style="height: 1px; flex: 1; background: var(--border-color, #e1e4e8);"></span>
        <a id="twikoo-toggle-btn" href="javascript:void(0)" style="color: var(--text-muted, #888); font-size: 0.85rem; text-decoration: none; white-space: nowrap; padding: 0.25rem 0.5rem; border-radius: 4px; transition: all 0.2s;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          展开 Twikoo 评论
        </a>
        <span style="height: 1px; flex: 1; background: var(--border-color, #e1e4e8);"></span>
      </div>
      <div id="twikoo-comment-container" style="display: none;">
        <div id="tcomment"></div>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.all.min.js"></script>
    <script>
    (function() {
      var twikooLoaded = false;
      var btn = document.getElementById('twikoo-toggle-btn');
      var container = document.getElementById('twikoo-comment-container');
      
      btn.addEventListener('click', function() {
        if (container.style.display === 'none') {
          container.style.display = 'block';
          btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> 收起 Twikoo 评论';
          if (!twikooLoaded) {
            twikoo.init({
              envId: 'https://comments.exyone.us.kg/',
              el: '#tcomment',
              path: location.pathname,
              lang: document.documentElement.lang || 'en'
            });
            twikooLoaded = true;
          }
        } else {
          container.style.display = 'none';
          btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> 展开 Twikoo 评论';
        }
      });
      
      btn.addEventListener('mouseenter', function() {
        btn.style.background = 'var(--border-color, #e1e4e8)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.background = 'transparent';
      });
    })();
    </script>
  HTML
  
  document.output = output.sub('</body>', "#{twikoo_container}\n</body>")
end
