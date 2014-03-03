class MainController < ApplicationController
  require 'json'
  def start
    if user_signed_in?
      @user = {
        :email => current_user.email,
        :pages => current_user.pages.any? ? current_user.pages.first.pages_dump : [{textareas: []}]
      }.to_json
    else
      @user = []
    end
  end
end
