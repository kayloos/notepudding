class MainController < ApplicationController
  require 'json'
  def start
    if user_signed_in?
      @user = {
        :email => current_user.email,
        :pages => current_user.pages.any? ? current_user.pages.first.pages_dump : [{textareas: []}]
      }.to_json
    else
      @user = {}
    end
  end

  def save_page
    authenticate_user!

    if current_user.pages.any?
      page = current_user.pages.first
      page.pages_dump = params[:pages_dump]
      page.save
    else
      current_user.pages << Page.new(pages_dump: params[:pages_dump])
    end

    render :status => 200,
           :json => {
             :type => "success"
           }
  end

  def get_pages
    authenticate_user!

    if current_user.pages.any?
      pages = current_user.pages.first.pages_dump
    else
      pages = [{textareas: []}]
    end

    render :status => 200,
           :json => {
             :type => "success",
             :pages => pages
           }
  end
end
