# Jekyll plugin removes empty lines from HTML files
#
# Author: kerotaa
# Site: http://kerotaa.hateblo.jp
# Copyright: Copyright (c) 2012 kerotaa
# License: MIT
# URL: https://gist.github.com/kerotaa/5788650

module Jekyll
  module Convertible
    def write(dest)
      path = destination(dest)
      FileUtils.mkdir_p(File.dirname(path))
      if File.extname(path).downcase == '.html' then
        self.output.strip!
      	reg = /<\/?pre[^>]*>/i
      	pres = self.output.scan(reg)
      	tary = self.output.split(reg)
      	oary = []
      	reg = /^[\s\t]*(\r\n|\r|\n)/
      	tary.each_with_index { |e, i|
      	  oary << ( i % 2 != 0 ? e : e.gsub(reg, '') )
          oary << pres[i] if pres.size > i
      	}
      	self.output = oary.join('')
      end
      File.open(path, 'w') do |f|
        f.write( self.output )
      end
    end
  end
end
