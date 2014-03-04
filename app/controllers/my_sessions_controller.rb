class MySessionsController < Devise::SessionsController
  respond_to :json
  def create
    user = params[:user]
    type = "success"
    logger.info params.to_yaml

    if User.exists?(email: user[:email])
      info = "Successfully signed in as " + user[:email]
    else
      @user = User.new(:email                 => user[:email],
                       :password              => user[:password],
                       :password_confirmation => user[:password])
      if @user.valid?
        @user.save
        info = "Successfully created and signed user in as " + user[:email]
      else
        info = "Validation errors: " + @user.errors.full_messages.join(", ")
        type = "danger"
      end
    end

    warden.authenticate(:scope => resource_name, :recall => "#{controller_path}#failure")
    if user_signed_in?
      user = {:email => current_user.email, :pages => current_user.pages.any? ? current_user.pages.first.pages_dump : [{textareas: []}]}
    else
      if type != "danger"
        type = "danger"
        info = "Password does not correlate with user email"
        user = {}
      end
    end
    render :status => 200,
           :json => {
             :type => type,
             :info => info,
             :user => user
           }
  end

  def destroy
    warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    sign_out
    render :status => 200,
           :json => { :success => true,
                      :info => "Logged out",
           }
  end

  def failure
    render :status => 401,
           :json => { :success => false,
                      :info => "Login Credentials Failed"
           }
  end

  def show_current_user
    warden.authenticate!(:scope => resource_name, :recall => "#{controller_path}#failure")
    render :status => 200,
           :json => { :success => true,
                      :info => "Current User",
                      :user => current_user
           }

  end
end
