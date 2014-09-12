class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :pads

  DEFAULT_CONFIG = {
    style: {
      fontSize: "18px",
      fontFamily: "Helvetica Neue",
      width: "800px",
      backgroundColor: "#FFFFC3"
    }
  }

  DEFAULT_PAD = [{ textareas: [], curves: [] }]

  def config
    pads.any? ? current_pad.config : DEFAULT_CONFIG
  end

  def pages_dump
    pads.any? ? current_pad.pages_dump : DEFAULT_PAD
  end

  def current_pad
    pads.any? ? pads.first : nil
  end
end

