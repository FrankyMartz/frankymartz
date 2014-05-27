# Jekyll plugin adds ternary conditionals to Liquid Filters.
#
# Author: Francisco Martinez (mailto:frankymartz@gmail.com)
# Site: http://frankymartz.com
# Copyright: Copyright (c) Franky Martinez 2014
# Distributed Under A Creative Commons License
#   - http://creativecommons.org/licenses/by-nc-sa/4.0/

module Jekyll
  module TernaryFilter
    # Public: Ternary conditional
    #
    # condition     - Expression evaluated to boolean
    # true_output   - Output if condition is true
    # false_output  - Output if condition is false (default: '')
    #
    # Examples
    #
    #   {% assign greet = true %}
    #   {{ greet | if: 'Hi.', 'Bye.' }} # => 'Hi.'
    #
    # Return value of true_output or false_output
    def ifelse(condition, true_output, false_output='')
      condition ? true_output : false_output
    end

    # Public: Negated ternary conditional
    #
    # condition     - Expression evaluated to boolean
    # false_output  - Output while condition is false
    # true_output   - Output if condition is true (default: '')
    #
    # Examples
    #
    #   {% assign greet = true %}
    #   {{ greet | unless: 'Hi.', 'Bye.' }} # => 'Bye.'
    #
    # Return value of true_output or false_output.
    def unless(condition, false_output, true_output='')
      condition ? true_output : false_output
    end

  end
end

Liquid::Template.register_filter(Jekyll::TernaryFilter)
