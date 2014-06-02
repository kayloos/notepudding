class MainController < ApplicationController
  require 'json'

  before_filter :authenticate_user!, except: :start
  def start
    if user_signed_in?
      @user = {
        email:  current_user.email,
        pages:  current_user.pages.any? ? current_user.pages.first.pages_dump : [{textareas: []}],
        config: current_user.pages.first.config
      }.to_json
    else
      @user = {}
    end
  end

  def save_page
    if current_user.pages.any?
      page = current_user.pages.first
      page.pages_dump = params[:pages_dump]
      page.config = params[:config]
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
