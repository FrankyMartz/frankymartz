# Jekyll plugin adds Octicon Markup to Jekyll Tags
#
# Author: Francisco Martinez (mailto:frankymartz@gmail.com)
# Site: http://frankymartz.com
# Copyright: Copyright (c) Franky Martinez 2014
# Distributed Under A Creative Commons License
#   - http://creativecommons.org/licenses/by-nc-sa/4.0/

module Jekyll
  class OcticonTag < Liquid::Tag
    def initialize(tag_name, icon, tokens)
      super
      @icon = icon
    end

    def render(context)
      "<i class=\"octicon octicon-#{@icon}\"></i>"
    end
  end
end

Liquid::Template.register_tag('octicon', Jekyll::OcticonTag)
