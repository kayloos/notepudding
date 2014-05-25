class AddConfigFieldToPages < ActiveRecord::Migration
  def change
    add_column :pages, :config, :json
  end
end
