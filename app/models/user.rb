class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :pads

  def default_config
    {
      style: {
        fontSize: "18px",
        fontFamily: "Helvetica Neue",
        width: "800px",
        backgroundColor: "#FFFFC3"
      }
    }
  end

  def default_pad
    [{textareas: []}]
  end

  def config
    pads.any? ? current_pad.config : default_config
  end

  def pages_dump
    pads.any? ? current_pad.pages_dump : default_pad
  end

  def current_pad
    pads.any? ? pads.first : nil
  end
end
