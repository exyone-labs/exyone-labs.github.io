Jekyll::Hooks.register :site, :pre_render do |site|
  site.posts.docs.each do |post|
    begin
      lang = post.data['lang'] || 'en'
      lang = lang.to_s.strip
      lang = 'en' if lang.empty?
      
      slug = post.data['slug']
      if slug.nil? || slug.to_s.strip.empty?
        basename = post.basename_without_ext.to_s
        slug = basename.sub(/^\d{4}-\d{2}-\d{2}-/, '')
      end
      
      slug = slug.to_s.strip
      slug = slug.gsub(/[^a-zA-Z0-9\-_]/, '-')
      slug = slug.gsub(/-+/, '-')
      slug = slug.gsub(/^-|-$/, '')
      slug = 'untitled' if slug.empty?
      
      permalink = "/posts/#{lang}/#{slug}/"
      post.data['permalink'] = permalink
      
    rescue => e
      Jekyll.logger.warn "Auto-permalink:", "Error processing post: #{e.message}"
      post.data['permalink'] = "/posts/untitled/"
    end
  end
end
