class MainController < ApplicationController
  require 'json'

  before_filter :authenticate_user!, except: :start
  def start
    if user_signed_in?
      @user = {
        email:  current_user.email,
        pages:  current_user.pages_dump,
        config: current_user.config
      }
    else
      @user = {}
    end
    @user = @user.to_json
  end

  def save_pad
    if current_user.pads.any?
      pad            = current_user.pads.first
      pad.pages_dump = params[:pages_dump]
      pad.config     = params[:config]
      pad.save
    else
      current_user.pads << Pad.new(pages_dump: params[:pages_dump])
    end

    render status: 200,
           json: {
             type: "success"
           }
  end

  def get_pad
    if current_user.pads.any?
      pages = current_user.pads.first.pages_dump
    else
      pages = [{textareas: []}] # FIXME: Use default_pad
    end

    render status: 200,
           json: {
             type: "success",
             pages: pages
           }
  end
end
