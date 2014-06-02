require 'rails_helper'

describe MainController, focus:true do
  context "when not signed in, the user" do
    it "has access to #start" do
      get :start
      expect(response.status).to eq 200
    end

    it "does not have access to #save_page" do
      post :save_pad
      expect(response.status).to eq 401
    end

    xit "does not have access to #get_pages" do
      get :get_pad
      expect(response.status).to eq 401
    end
  end

  describe "#start" do
    context "when signed in" do
      login_user

      it "assigns a user hash to @user" do
        get :start
        user_hash = JSON.parse(assigns(:user))
        expect(user_hash).to be_a_user_hash
      end
    end

    context "when not signed in" do
      it "assigns an empty hash to @user" do
        get :start
        user_hash = JSON.parse(assigns(:user))
        expect(user_hash).to eq({})
      end
    end
  end

  describe "#save_pad" do

  end

  describe "#get_pad" do

  end
end
